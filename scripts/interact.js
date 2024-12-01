const hre = require("hardhat");

async function main() {
  // Get the contract instance
  const SumOfCubes = await hre.ethers.getContractFactory("SumOfCubes");
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address
  const sumOfCubes = await SumOfCubes.attach(contractAddress);

  // Try the famous n = 42 solution
  const x = -80538738812075974n;
  const y = 80435758145817515n;
  const z = 12602123297335631n;
  const k = 42n;

  console.log("\nVerifying the famous n = 42 solution...");
  const tx = await sumOfCubes.verifyCubesWithProvidedK(x, y, z, k);
  const receipt = await tx.wait();

  // Find the VerificationAttempt event
  const event = receipt.logs[0];
  console.log("Transaction hash:", tx.hash);
  console.log("Result:", event.args[4]); // true/false
  console.log("Message:", event.args[5]); // The verification message
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
