// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SumOfCubes {
    // Maximum absolute value for int256 cubing without overflow
    int256 private constant MAX_SAFE_VALUE = 38685626227668009036546048;
    // Maximum value for k
    int256 private constant MAX_K = 1001;

    // Add new constant for test numbers
    int256 private constant TEST_NUMBER_1 = 3;
    int256 private constant TEST_NUMBER_2 = 42;

    // Struct to track unsolved numbers
    struct UnsolvedNumber {
        bool exists;
        bool solved;
        address solver;
        bool isTestNumber;  // New field
    }

    // Mapping to track unsolved numbers
    mapping(int256 => UnsolvedNumber) public unsolvedNumbers;
    
    // Array to keep track of all unsolved numbers for easy iteration
    int256[] public unsolvedNumbersList;
    
    // Owner of the contract
    address public immutable owner;
    
    // Events
    event VerificationAttempt(
        int256 x,
        int256 y,
        int256 z,
        int256 k,
        bool result,
        string message
    );
    
    event SolutionFound(
        int256 k,
        address solver,
        uint256 reward
    );
    
    event VaultFunded(
        address funder,
        uint256 amount
    );

    constructor() {
        owner = msg.sender;
        
        // Initialize unsolved numbers
        int256[] memory numbers = new int256[](9);  // Increased array size
        numbers[0] = TEST_NUMBER_1;   // For testing, marked as test number
        numbers[1] = TEST_NUMBER_2;   // Another test number with known solution
        numbers[2] = 114;
        numbers[3] = 390;
        numbers[4] = 627;
        numbers[5] = 633;
        numbers[6] = 732;
        numbers[7] = 921;
        numbers[8] = 975;
        
        for(uint i = 0; i < numbers.length; i++) {
            unsolvedNumbers[numbers[i]] = UnsolvedNumber({
                exists: true,
                solved: false,
                solver: address(0),
                isTestNumber: (numbers[i] == TEST_NUMBER_1)
            });
            unsolvedNumbersList.push(numbers[i]);
        }
    }

    function verifyCubes(int256 x, int256 y, int256 z, int256 k) public returns (bool) {
        // Check if k is within valid range
        if (k >= MAX_K || k < 0) {
            emit VerificationAttempt(x, y, z, k, false, "k must be less than 1001 and non-negative");
            return false;
        }

        // Check if this is an unsolved number and if it's already been solved
        UnsolvedNumber storage unsolvedNumber = unsolvedNumbers[k];
        if (!unsolvedNumber.exists) {
            emit VerificationAttempt(x, y, z, k, false, "This number is not in the unsolved list");
            return false;
        }
        if (unsolvedNumber.solved) {
            emit VerificationAttempt(x, y, z, k, false, "This number has already been solved");
            return false;
        }

        // Validate input range
        if (
            x < -MAX_SAFE_VALUE || x > MAX_SAFE_VALUE ||
            y < -MAX_SAFE_VALUE || y > MAX_SAFE_VALUE ||
            z < -MAX_SAFE_VALUE || z > MAX_SAFE_VALUE
        ) {
            emit VerificationAttempt(x, y, z, k, false, "Input out of safe range for int256 cubing.");
            return false;
        }

        // Calculate x^3, y^3, and z^3 safely
        int256 xCubed = x * x * x;
        int256 yCubed = y * y * y;
        int256 zCubed = z * z * z;

        // Check if the sum equals k
        bool result = xCubed + yCubed + zCubed == k;

        if (result) {
            if (!unsolvedNumber.isTestNumber) {
                // Calculate reward BEFORE marking as solved
                // Only count non-test numbers for reward calculation
                uint256 nonTestUnsolvedCount = getNonTestUnsolvedCount();
                uint256 reward = nonTestUnsolvedCount > 0 ? 
                    address(this).balance / nonTestUnsolvedCount : 0;
                
                // Mark as solved and record solver
                unsolvedNumber.solved = true;
                unsolvedNumber.solver = msg.sender;
                
                // Send reward only for non-test numbers
                if (reward > 0) {
                    payable(msg.sender).transfer(reward);
                    emit SolutionFound(k, msg.sender, reward);
                }
            } else {
                // For test numbers, just mark as verified without reward
                emit SolutionFound(k, msg.sender, 0);
            }
        }

        emit VerificationAttempt(
            x, 
            y, 
            z, 
            k, 
            result, 
            result ? "Solution satisfies the equation." : "Solution does not satisfy the equation."
        );

        return result;
    }

    // Function to get count of remaining unsolved numbers
    function getUnsolvedCount() public view returns (uint256) {
        uint256 count = 0;
        for(uint i = 0; i < unsolvedNumbersList.length; i++) {
            if (!unsolvedNumbers[unsolvedNumbersList[i]].solved) {
                count++;
            }
        }
        return count;
    }

    // Function to get all unsolved numbers
    function getUnsolvedNumbers() public view returns (int256[] memory) {
        uint256 count = getUnsolvedCount();
        int256[] memory unsolved = new int256[](count);
        uint256 index = 0;
        
        for(uint i = 0; i < unsolvedNumbersList.length; i++) {
            if (!unsolvedNumbers[unsolvedNumbersList[i]].solved) {
                unsolved[index] = unsolvedNumbersList[i];
                index++;
            }
        }
        
        return unsolved;
    }

    // New helper function to count unsolved non-test numbers
    function getNonTestUnsolvedCount() public view returns (uint256) {
        uint256 count = 0;
        for(uint i = 0; i < unsolvedNumbersList.length; i++) {
            int256 number = unsolvedNumbersList[i];
            if (!unsolvedNumbers[number].solved && !unsolvedNumbers[number].isTestNumber) {
                count++;
            }
        }
        return count;
    }

    // Function to fund the vault
    receive() external payable {
        emit VaultFunded(msg.sender, msg.value);
    }
}