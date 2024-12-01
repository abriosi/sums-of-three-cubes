const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SumOfCubes", function () {
  let sumOfCubes;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const SumOfCubes = await ethers.getContractFactory("SumOfCubes");
    sumOfCubes = await SumOfCubes.deploy();
    await sumOfCubes.waitForDeployment();
  });

  describe("verifyCubes", function () {
    it("Should verify correct solution", async function () {
      await expect(sumOfCubes.verifyCubes(3, 4, 5, 216))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(3, 4, 5, 216, true, "Solution satisfies the equation.");
    });

    it("Should reject incorrect solution", async function () {
      await expect(sumOfCubes.verifyCubes(3, 4, 6, 216))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(3, 4, 6, 216, false, "Solution does not satisfy the equation.");
    });

    it("Should reject values outside safe range", async function () {
      const MAX_SAFE_VALUE = ethers.getBigInt("38685626227668009036546048");
      await expect(sumOfCubes.verifyCubes(MAX_SAFE_VALUE + 1n, 4, 5, 216))
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
      await expect(sumOfCubes.verifyCubes(3, 4, 5, 1001))
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
      await expect(sumOfCubes.verifyCubes(3, 4, 5, -1))
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

      await expect(sumOfCubes.verifyCubes(x, y, z, k))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(x, y, z, k, true, "Solution satisfies the equation.");
    });

    it("Should reject incorrect solution for n = 42", async function () {
      // Modify one digit in x to make it incorrect
      const x = -80538738812075973n; // Changed last digit from 4 to 3
      const y = 80435758145817515n;
      const z = 12602123297335631n;
      const k = 42n;

      await expect(sumOfCubes.verifyCubes(x, y, z, k))
        .to.emit(sumOfCubes, "VerificationAttempt")
        .withArgs(x, y, z, k, false, "Solution does not satisfy the equation.");
    });
  });
});