const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SumOfCubes", function () {
  let sumOfCubes;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const SumOfCubes = await ethers.getContractFactory("SumOfCubes");
    sumOfCubes = await SumOfCubes.deploy();
    await sumOfCubes.waitForDeployment();
  });

  describe("Constructor", function () {
    it("Should initialize unsolved numbers correctly", async function () {
      expect(await sumOfCubes.getUnsolvedCount()).to.equal(8);
      const unsolvedNumbers = await sumOfCubes.getUnsolvedNumbers();
      expect(unsolvedNumbers).to.deep.equal([3n, 114n, 390n, 627n, 633n, 732n, 921n, 975n]);
    });
  });

  describe("Vault Funding", function () {
    it("Should accept ETH and emit VaultFunded event", async function () {
      const amount = ethers.parseEther("1.0");
      await expect(addr1.sendTransaction({
        to: await sumOfCubes.getAddress(),
        value: amount
      }))
        .to.emit(sumOfCubes, "VaultFunded")
        .withArgs(addr1.address, amount);
    });
  });

  describe("Solution Verification", function () {
    beforeEach(async function () {
      // Fund the contract
      await addr1.sendTransaction({
        to: await sumOfCubes.getAddress(),
        value: ethers.parseEther("1.0")
      });
    });

    it("Should verify correct solution for n = 3", async function () {
      const x = 1n;
      const y = 1n;
      const z = 1n;
      const k = 3n;

      await expect(sumOfCubes.connect(addr2).verifyCubes(x, y, z, k))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(x, y, z, k, true, "Solution satisfies the equation.");
    });

    it("Should verify another correct solution for n = 3", async function () {
      const x = 569936821221962380720n;
      const y = -569936821113563493509n;
      const z = -472715493453327032n;
      const k = 3n;

      await expect(sumOfCubes.connect(addr2).verifyCubes(x, y, z, k))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(x, y, z, k, true, "Solution satisfies the equation.");
    });

    it("Should reject incorrect solution for n = 3", async function () {
      const x = 1n;
      const y = 1n;
      const z = 2n;
      const k = 3n;

      await expect(sumOfCubes.connect(addr2).verifyCubes(x, y, z, k))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(x, y, z, k, false, "Solution does not satisfy the equation.");
    });

    it("Should reject values outside safe range", async function () {
      const MAX_SAFE_VALUE = ethers.getBigInt("38685626227668009036546048");
      await expect(sumOfCubes.verifyCubes(MAX_SAFE_VALUE + 1n, 4, 5, 3))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(
          MAX_SAFE_VALUE + 1n,
          4,
          5,
          3,
          false,
          "Input out of safe range for int256 cubing."
        );
    });

    it("Should reject k values >= 1001", async function () {
      await expect(sumOfCubes.verifyCubes(1, 1, 1, 1001))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(
          1,
          1,
          1,
          1001,
          false,
          "k must be less than 1001 and non-negative"
        );
    });

    it("Should reject negative k values", async function () {
      await expect(sumOfCubes.verifyCubes(1, 1, 1, -1))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(
          1,
          1,
          1,
          -1,
          false,
          "k must be less than 1001 and non-negative"
        );
    });

    it("Should reject non-listed numbers", async function () {
      await expect(sumOfCubes.verifyCubes(1, 1, 1, 100))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(1, 1, 1, 100, false, "This number is not in the unsolved list");
    });

    it("Should verify the famous n = 42 solution but reject it as not in list", async function () {
      const x = -80538738812075974n;
      const y = 80435758145817515n;
      const z = 12602123297335631n;
      const k = 42n;

      await expect(sumOfCubes.verifyCubes(x, y, z, k))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(x, y, z, k, false, "This number is not in the unsolved list");
    });

    it("Should reward solver and mark number as solved", async function () {
      const x = 1n;
      const y = 1n;
      const z = 1n;
      const k = 3n;

      await expect(sumOfCubes.connect(addr2).verifyCubes(x, y, z, k))
        .to.emit(sumOfCubes, "SolutionFound")
        .withArgs(k, addr2.address, ethers.parseEther("0.125")); // 1 ETH / 8 unsolved numbers

      const unsolvedNumber = await sumOfCubes.unsolvedNumbers(k);
      expect(unsolvedNumber.solved).to.be.true;
      expect(unsolvedNumber.solver).to.equal(addr2.address);
      expect(await sumOfCubes.getUnsolvedCount()).to.equal(7);
    });
  });
});