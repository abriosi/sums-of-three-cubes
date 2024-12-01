const hre = require("hardhat");

async function main() {
  // Get the contract instance
  const SumOfCubes = await hre.ethers.getContractFactory("SumOfCubes");
  const contractAddress = "0xd58838d197Bb35A0b9D23B3e0114ED7EcC367D06"; // Replace with your deployed contract address
  const sumOfCubes = await SumOfCubes.attach(contractAddress);

  // Get initial contract state
  const initialUnsolvedCount = await sumOfCubes.getUnsolvedCount();
  const initialUnsolvedNumbers = await sumOfCubes.getUnsolvedNumbers();
  const initialBalance = await hre.ethers.provider.getBalance(contractAddress);

  console.log("\nInitial Contract Status:");
  console.log("Balance:", hre.ethers.formatEther(initialBalance), "ETH");
  console.log("Unsolved numbers:", initialUnsolvedNumbers.map(n => n.toString()).join(", "));
  console.log("Remaining unsolved:", initialUnsolvedCount.toString());

  // Try the test solution for n = 3
  const x = 1n;
  const y = 1n;
  const z = 1n;
  const k = 3n;

  console.log("\nVerifying solution for n = 3...");
  const tx = await sumOfCubes.verifyCubes(x, y, z, k);
  const receipt = await tx.wait();

  // Find and parse events
  for (const log of receipt.logs) {
    try {
      const event = sumOfCubes.interface.parseLog(log);
      if (event.name === "VerificationAttempt") {
        console.log("\nVerification Result:");
        console.log("Success:", event.args.result);
        console.log("Message:", event.args.message);
      } else if (event.name === "SolutionFound") {
        console.log("\nSolution Found!");
        console.log("Number solved:", event.args.k.toString());
        console.log("Reward:", hre.ethers.formatEther(event.args.reward), "ETH");
        console.log("Solver:", event.args.solver);
      }
    } catch (e) {
      // Skip logs that aren't from our contract
      continue;
    }
  }

  // Get updated state
  const newUnsolvedCount = await sumOfCubes.getUnsolvedCount();
  const newUnsolvedNumbers = await sumOfCubes.getUnsolvedNumbers();
  const newBalance = await hre.ethers.provider.getBalance(contractAddress);

  console.log("\nFinal Contract Status:");
  console.log("Balance:", hre.ethers.formatEther(newBalance), "ETH");
  console.log("Unsolved numbers:", newUnsolvedNumbers.map(n => n.toString()).join(", "));
  console.log("Remaining unsolved:", newUnsolvedCount.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
