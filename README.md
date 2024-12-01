# Sum of Three Cubes Smart Contract

This smart contract verifies solutions to the equation x³ + y³ + z³ = k for any k value less than 1001.

## Overview

The contract provides functionality to verify solutions for the equation x³ + y³ + z³ = k, where k is any non-negative number less than 1001. It includes safety checks for number overflow and maintains a current k value that can be updated by users.

## Project Structure

- `contracts/SumOfCubes.sol`: The main smart contract
- `scripts/deploy.js`: Script to deploy the contract
- `scripts/interact.js`: Script to interact with the deployed contract
- `test/SumOfCubes.test.js`: Comprehensive test suite

## Features

- Verification of solutions for any k < 1001
- Safe handling of large numbers to prevent overflow
- Event logging for verification attempts
- Configurable k value through setter function
- Maximum safe value protection for cube calculations
- Historical solutions verification (e.g., n = 42 solution by Booker and Sutherland)

## Technical Details

- Solidity Version: ^0.8.0
- Maximum Safe Value: 38,685,626,227,668,009,036,546,048
- Maximum k Value: 1000
- License: MIT

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

## Contract Functions

### Constructor
```solidity
constructor(int256 initialK)
```
Initializes the contract with a starting k value.

### setK
```solidity
function setK(int256 newK) public
```
Sets a new value for k (must be less than 1001 and non-negative).

### getCurrentK
```solidity
function getCurrentK() public view returns (int256)
```
Returns the current value of k.

### verifyCubesWithStoredK
```solidity
function verifyCubesWithStoredK(int256 x, int256 y, int256 z) public returns (bool)
```
Verifies if x³ + y³ + z³ equals the current k value.

### verifyCubesWithProvidedK
```solidity
function verifyCubesWithProvidedK(int256 x, int256 y, int256 z, int256 k) public returns (bool)
```
Verifies if x³ + y³ + z³ = k for a specified k value.

## Events

### KValueSet
```solidity
event KValueSet(int256 k)
```
Emitted when a new k value is set.

### VerificationAttempt
```solidity
event VerificationAttempt(int256 x, int256 y, int256 z, int256 k, bool result, string message)
```
Emitted for each verification attempt with detailed results.

## Notable Solutions

The contract can verify historically significant solutions, including:

- n = 42: (-80538738812075974)³ + 80435758145817515³ + 12602123297335631³ = 42
  (Discovered by Booker and Sutherland in 2019)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
