const hre = require("hardhat");

async function main() {
  const SumOfCubes = await hre.ethers.getContractFactory("SumOfCubes");
  const sumOfCubes = await SumOfCubes.deploy(100);

  await sumOfCubes.waitForDeployment();

  console.log("SumOfCubes deployed to:", await sumOfCubes.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });