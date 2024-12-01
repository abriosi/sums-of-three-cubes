const hre = require("hardhat");

async function main() {
  // Get the contract instance
  const SumOfCubes = await hre.ethers.getContractFactory("SumOfCubes");
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address
  const sumOfCubes = await SumOfCubes.attach(contractAddress);

  // Get initial contract state
  const initialUnsolvedCount = await sumOfCubes.getUnsolvedCount();
  const initialNonTestUnsolvedCount = await sumOfCubes.getNonTestUnsolvedCount();
  const initialUnsolvedNumbers = await sumOfCubes.getUnsolvedNumbers();
  const initialBalance = await hre.ethers.provider.getBalance(contractAddress);

  console.log("\nInitial Contract Status:");
  console.log("Balance:", hre.ethers.formatEther(initialBalance), "ETH");
  console.log("Unsolved numbers:", initialUnsolvedNumbers.map(n => n.toString()).join(", "));
  console.log("Total remaining unsolved:", initialUnsolvedCount.toString());
  console.log("Non-test remaining unsolved:", initialNonTestUnsolvedCount.toString());

  // Test cases
  const testCases = [
    {
      name: "n = 3 (repeatable test)",
      x: 1n,
      y: 1n,
      z: 1n,
      k: 3n
    },
    {
      name: "n = 42 (one-time reward test)",
      x: -80538738812075974n,
      y: 80435758145817515n,
      z: 12602123297335631n,
      k: 42n
    }
  ];

  // Try each test case
  for (const test of testCases) {
    console.log(`\nVerifying solution for ${test.name}...`);
    const tx = await sumOfCubes.verifyCubes(test.x, test.y, test.z, test.k);
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
  }

  // Get updated state
  const newUnsolvedCount = await sumOfCubes.getUnsolvedCount();
  const newNonTestUnsolvedCount = await sumOfCubes.getNonTestUnsolvedCount();
  const newUnsolvedNumbers = await sumOfCubes.getUnsolvedNumbers();
  const newBalance = await hre.ethers.provider.getBalance(contractAddress);

  console.log("\nFinal Contract Status:");
  console.log("Balance:", hre.ethers.formatEther(newBalance), "ETH");
  console.log("Unsolved numbers:", newUnsolvedNumbers.map(n => n.toString()).join(", "));
  console.log("Total remaining unsolved:", newUnsolvedCount.toString());
  console.log("Non-test remaining unsolved:", newNonTestUnsolvedCount.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
