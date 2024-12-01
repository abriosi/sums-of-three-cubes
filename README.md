# Sum of Three Cubes Smart Contract

This smart contract verifies solutions to the equation x³ + y³ + z³ = k for specific unsolved values of k, with rewards for finding solutions.

## Overview

The contract maintains a list of historically unsolved numbers for the equation x³ + y³ + z³ = k. When a valid solution is found for any of these numbers, the solver receives a reward from the contract's vault. The numbers are:

- 3 (included for testing)
- 114
- 390
- 627
- 633
- 732
- 921
- 975

## Features

- Verification of solutions for specific unsolved numbers
- Reward system for finding valid solutions
- Safe handling of large numbers to prevent overflow
- Event logging for verification attempts and solutions
- Maximum safe value protection for cube calculations
- Vault funding mechanism for rewards

## Technical Details

- Solidity Version: ^0.8.0
- Maximum Safe Value: 38,685,626,227,668,009,036,546,048
- Maximum k Value: 1000
- Reward Distribution: Equal split of vault balance among remaining unsolved numbers

## Prerequisites

- Node.js v18.20.0 or higher
- npm v10.5.0 or higher

You can use nvm (Node Version Manager) to install the correct version:
```bash
nvm use 18.20.0
```

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/abriosi/sums-of-three-cubes
cd sums-of-three-cubes
npm install
```

## Testing

Run the test suite:

```bash
npx hardhat test
```

Run test coverage:

```bash
npx hardhat coverage
```

## Deployment

### Local Network
1. Start a local node:
```bash
npx hardhat node
```

2. Deploy to local network:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. Interact with the deployed contract:
```bash
npx hardhat run scripts/interact.js --network localhost
```

### Testnet Deployment (e.g., Sepolia)

1. Create `.env` file:
```plaintext
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=your_sepolia_rpc_url
ETHERSCAN_API_KEY=your_etherscan_api_key
```

2. Deploy to Sepolia:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

3. Verify contract on Etherscan:
```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### Contract Interaction

1. Through Etherscan:
   - Go to the contract address on Etherscan
   - Connect your wallet
   - Use the "Write Contract" section to call functions

2. Through code:
```javascript
const ethers = require('ethers');
const contractABI = require('./artifacts/contracts/SumOfCubes.sol/SumOfCubes.json').abi;

async function interactWithContract() {
    // Connect to provider (e.g., MetaMask)
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Create contract instance
    const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
    // Example: Verify the n = 3 solution
    const tx = await contract.verifyCubes(
        569936821221962380720n,
        -569936821113563493509n,
        -472715493453327032n,
        3
    );
    
    // Wait for transaction
    const receipt = await tx.wait();
    console.log("Transaction:", receipt);
}
```

## Contract Functions

### verifyCubes
```solidity
function verifyCubes(int256 x, int256 y, int256 z, int256 k) public returns (bool)
```
Verifies if x³ + y³ + z³ = k for a specified k value. If the solution is valid and k is in the unsolved list, the solver receives a reward.

### getUnsolvedCount
```solidity
function getUnsolvedCount() public view returns (uint256)
```
Returns the number of remaining unsolved numbers.

### getUnsolvedNumbers
```solidity
function getUnsolvedNumbers() public view returns (int256[] memory)
```
Returns an array of all currently unsolved numbers.

## Events

### VerificationAttempt
```solidity
event VerificationAttempt(int256 x, int256 y, int256 z, int256 k, bool result, string message)
```
Emitted for each verification attempt with detailed results.

### SolutionFound
```solidity
event SolutionFound(int256 k, address solver, uint256 reward)
```
Emitted when a valid solution is found and rewarded.

### VaultFunded
```solidity
event VaultFunded(address funder, uint256 amount)
```
Emitted when the vault receives funding.

## Rewards System

The contract maintains a vault of ETH that can be used to reward successful solutions. When a valid solution is submitted:

1. The solver receives a reward equal to: `vault_balance / number_of_unsolved_numbers`
2. The number is marked as solved and cannot be claimed again
3. The reward amount is automatically transferred to the solver's address

## Contributing to the Vault

Anyone can contribute to the reward vault by sending ETH directly to the contract address. These funds will be used to reward future solutions.
