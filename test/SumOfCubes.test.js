const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SumOfCubes", function () {
  let sumOfCubes;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const SumOfCubes = await ethers.getContractFactory("SumOfCubes");
    sumOfCubes = await SumOfCubes.deploy(100);
    await sumOfCubes.waitForDeployment();
  });

  describe("Constructor", function () {
    it("Should set the initial k value", async function () {
      expect(await sumOfCubes.getCurrentK()).to.equal(100);
    });

    it("Should fail if initial k is >= 1001", async function () {
      const SumOfCubes = await ethers.getContractFactory("SumOfCubes");
      await expect(SumOfCubes.deploy(1001)).to.be.revertedWith(
        "k must be less than 1001 and non-negative"
      );
    });

    it("Should fail if initial k is negative", async function () {
      const SumOfCubes = await ethers.getContractFactory("SumOfCubes");
      await expect(SumOfCubes.deploy(-1)).to.be.revertedWith(
        "k must be less than 1001 and non-negative"
      );
    });
  });

  describe("setK", function () {
    it("Should update k value", async function () {
      await sumOfCubes.setK(200);
      expect(await sumOfCubes.getCurrentK()).to.equal(200);
    });

    it("Should emit KValueSet event", async function () {
      await expect(sumOfCubes.setK(200))
        .to.emit(sumOfCubes, "KValueSet")
        .withArgs(200);
    });

    it("Should fail if k >= 1001", async function () {
      await expect(sumOfCubes.setK(1001)).to.be.revertedWith(
        "k must be less than 1001 and non-negative"
      );
    });

    it("Should fail if k is negative", async function () {
      await expect(sumOfCubes.setK(-1)).to.be.revertedWith(
        "k must be less than 1001 and non-negative"
      );
    });
  });

  describe("verifyCubes", function () {
    it("Should verify correct solution with stored k", async function () {
      await sumOfCubes.setK(216);
      await expect(sumOfCubes.verifyCubesWithStoredK(3, 4, 5))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(3, 4, 5, 216, true, "Solution satisfies the equation.");
    });

    it("Should verify correct solution with provided k", async function () {
      await expect(sumOfCubes.verifyCubesWithProvidedK(3, 4, 5, 216))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(3, 4, 5, 216, true, "Solution satisfies the equation.");
    });

    it("Should reject incorrect solution", async function () {
      await sumOfCubes.setK(216);
      await expect(sumOfCubes.verifyCubesWithStoredK(3, 4, 6))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(3, 4, 6, 216, false, "Solution does not satisfy the equation.");
    });

    it("Should reject values outside safe range", async function () {
      const MAX_SAFE_VALUE = ethers.getBigInt("38685626227668009036546048");
      await expect(sumOfCubes.verifyCubesWithProvidedK(MAX_SAFE_VALUE + 1n, 4, 5, 216))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(
          MAX_SAFE_VALUE + 1n,
          4,
          5,
          216,
          false,
          "Input out of safe range for int256 cubing."
        );
    });

    it("Should reject k values >= 1001", async function () {
      await expect(sumOfCubes.verifyCubesWithProvidedK(3, 4, 5, 1001))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(
          3,
          4,
          5,
          1001,
          false,
          "k must be less than 1001 and non-negative"
        );
    });

    it("Should reject negative k values", async function () {
      await expect(sumOfCubes.verifyCubesWithProvidedK(3, 4, 5, -1))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(
          3,
          4,
          5,
          -1,
          false,
          "k must be less than 1001 and non-negative"
        );
    });

    it("Should verify the famous n = 42 solution", async function () {
      // n = 42 solution discovered by Booker and Sutherland in 2019
      const x = -80538738812075974n;
      const y = 80435758145817515n;
      const z = 12602123297335631n;
      const k = 42n;

      await expect(sumOfCubes.verifyCubesWithProvidedK(x, y, z, k))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(x, y, z, k, true, "Solution satisfies the equation.");
    });

    it("Should reject incorrect solution for n = 42", async function () {
      // Modify one digit in x to make it incorrect
      const x = -80538738812075973n; // Changed last digit from 4 to 3
      const y = 80435758145817515n;
      const z = 12602123297335631n;
      const k = 42n;

      await expect(sumOfCubes.verifyCubesWithProvidedK(x, y, z, k))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(x, y, z, k, false, "Solution does not satisfy the equation.");
    });
  });
});