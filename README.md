# Sum of Three Cubes Smart Contract

This smart contract verifies solutions to the equation x³ + y³ + z³ = k for specific unsolved values of k, with rewards for finding solutions.

## Overview

The contract maintains a list of historically unsolved numbers for the equation x³ + y³ + z³ = k. When a valid solution is found for any of these numbers, the solver receives a reward from the contract's vault. The numbers are:

Test numbers:
- 3 (for basic testing, can be verified multiple times, no rewards)
- 42 (famous solved case, can be solved once to test reward mechanism)

Unsolved numbers (with rewards):
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
- Test number (3) that can be verified repeatedly without rewards
- Known solved number (42) for testing reward mechanism
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

1. For regular numbers (including 42):
   - The solver receives a reward equal to: `vault_balance / number_of_unsolved_numbers`
   - The number is marked as solved and cannot be claimed again
   - The reward amount is automatically transferred to the solver's address

2. For the test number (3):
   - Solutions can be verified multiple times
   - No rewards are given
   - Used for testing and educational purposes

## Known Solutions

For testing purposes, here are some known solutions:

### n = 3
Basic solution:
```javascript
x = 1
y = 1
z = 1
```

Alternative solution:
```javascript
x = 569936821221962380720
y = -569936821113563493509
z = -472715493453327032
```

### n = 42
Solution (can be used once to test reward mechanism):
```javascript
x = -80538738812075974
y = 80435758145817515
z = 12602123297335631
```

## Contributing to the Vault

Anyone can contribute to the reward vault by sending ETH directly to the contract address. These funds will be used to reward future solutions.

## Historical Context & Further Reading

This problem is part of a classic challenge in number theory that asks whether a given number can be expressed as the sum of three cubes of integers (allowing both positive and negative values). While seemingly simple, it has challenged mathematicians for decades.

Recent notable breakthroughs include:
- In 2019, Andrew Booker found the first solution for 33 after 65 years of searching
- Later that year, Booker and Andrew Sutherland solved the famous case of 42, requiring 1.3 million hours of computing time
- A new solution for 3 was discovered using the massive computing power of the Charity Engine global grid

The seven numbers in this contract (114, 390, 627, 633, 732, 921, and 975) represent the only remaining unsolved cases below 1000. A necessary condition for a number n to be expressible as a sum of three cubes is that it cannot equal 4 or 5 modulo 9.

For more information, see the [Wikipedia article on Sums of Three Cubes](https://en.wikipedia.org/wiki/Sums_of_three_cubes).
