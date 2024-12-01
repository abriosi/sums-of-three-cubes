// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SumOfCubes {
    // Maximum absolute value for int256 cubing without overflow
    int256 private constant MAX_SAFE_VALUE = 38685626227668009036546048;
    // Maximum value for k
    int256 private constant MAX_K = 1001;

    // Event to log results for debugging
    event VerificationAttempt(
        int256 x,
        int256 y,
        int256 z,
        int256 k,
        bool result,
        string message
    );

    function verifyCubes(int256 x, int256 y, int256 z, int256 k) public returns (bool) {
        // Check if k is within valid range FIRST
        if (k >= MAX_K || k < 0) {
            emit VerificationAttempt(x, y, z, k, false, "k must be less than 1001 and non-negative");
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

        // Emit event with result
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
}