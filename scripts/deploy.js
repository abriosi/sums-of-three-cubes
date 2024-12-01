const hre = require("hardhat");

async function main() {
  const SumOfCubes = await hre.ethers.getContractFactory("SumOfCubes");
  const sumOfCubes = await SumOfCubes.deploy();

  await sumOfCubes.waitForDeployment();

  const address = await sumOfCubes.getAddress();
  console.log("SumOfCubes deployed to:", address);

  // Fund the contract with some initial ETH for rewards (0.1 ETH)
  const [deployer] = await hre.ethers.getSigners();
  await deployer.sendTransaction({
    to: address,
    value: hre.ethers.parseEther("0.1")
  });
  console.log("Contract funded with 0.1 ETH");

  // Get initial state
  const unsolvedCount = await sumOfCubes.getUnsolvedCount();
  const unsolvedNumbers = await sumOfCubes.getUnsolvedNumbers();
  console.log(`\nUnsolved numbers (${unsolvedCount}):`);
  console.log(unsolvedNumbers.map(n => n.toString()).join(", "));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });