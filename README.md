# Sum of Cubes Smart Contract

This smart contract verifies solutions to the equation x³ + y³ + z³ = k for any k value less than 1001.

## Overview

The contract provides functionality to verify solutions for the equation x³ + y³ + z³ = k, where k is any non-negative number less than 1001. It includes safety checks for number overflow and maintains a current k value that can be updated by users.

## Features

- Verification of solutions for any k < 1001
- Safe handling of large numbers to prevent overflow
- Event logging for verification attempts
- Configurable k value through setter function
- Maximum safe value protection for cube calculations

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

Deploy to a network (requires specifying an initial k value):

```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

## Contract Functions

### setK

```solidity
function setK(int256 newK) public
```

Sets a new value for k (must be less than 1000 and non-negative).

### getCurrentK

```solidity
function getCurrentK() public view returns (int256)
```

Returns the current value of k.

### verifyCubes

```solidity
function verifyCubes(int256 x, int256 y, int256 z) public returns (bool)
```

Verifies if x³ + y³ + z³ equals the current k value.

```solidity
function verifyCubes(int256 x, int256 y, int256 z, int256 k) public returns (bool)
```

Verifies if x³ + y³ + z³ = k for a specified k value.

## Technical Details

- Solidity Version: ^0.8.0
- Maximum Safe Value: 38,685,626,227,668,009,036,546,048
- Maximum k Value: 1000
- License: MIT

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Compile contracts:
```bash
npx hardhat compile
```

3. Run tests:
```bash
npx hardhat test
```

4. Start local node:
```bash
npx hardhat node
```

5. Deploy to local network:
```bash
npx hardhat run scripts/deploy.js --network localhost
```
