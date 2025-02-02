# AstanaITUniversity_se2328 ERC-20 Token

This repository contains an ERC-20 token projects named **AstanaITUniversity_se2328** and **AITU_se2328mdf** created as part of the Blockchain Technologies Assignment 3, Part 2. The project demonstrates:

- Initial version of the contract  
- Updated version with constructor parameters
- Test cases for moth smart contracts
- And usage of **Solidity, Hardhat, Chai and Ethers.js**

**University:** Astana IT University  
**Group:** SE-2328  

---

## Table of Contents
- [Project Requirements](#project-requirements)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Screenshots](#screenshots)
- [License](#license)

## Project Requirements

The project involves writing test cases for the **AstanaITUniversity_se2328** and their modified version of ERC-20 token contract. The tasks include:

- Writing unit tests for **all functions** in the smart contract.
- Modifying the contract's **constructor** to accept an input parameter.
- Ensuring the **new constructor parameter is used meaningfully** within the contract.
- Writing test cases for the **modified version** of the contract.

## Prerequisites

- **Node.js** 
- **npm**
- **Hardhat**
- **MetaMask** (for deployment & testing)
- **Holesky testnet** (or another testnet for deployment)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/marasss111/my-new-erc20-project.git
   cd my-new-erc20-project
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. (Optional) Install any additional required packages:
   ```sh
   npm install --save-dev @nomicfoundation/hardhat-chai-matchers
   ```

## Project Structure

```
.
├── contracts
│   ├── AstanaITUniversity_se2328.sol
│   └── AITU_se2328mdf.sol
├── test
│   ├── AstanaITUniversity_se2328test.js
│   └── AITU_se2328mdftest.js
├── scripts
│   └── deploy.js
├── ignition/modules
│   └── Lock.js
├── .env
├── hardhat.config.js
├── package.json
├── README.md
└── LICENSE
```

### Explanation:
- `contracts/AstanaITUniversity_se2328.sol`: Smart contract from part 1.
- `contracts/AITU_se2328mdf.sol`: Smart contract with modifications.
- `test/AstanaITUniversity_se2328test.js`: Test cases for the initial contract version.
- `test/AITU_se2328mdftest.js`: Test cases for the modified contract.
- `scripts/deploy.js`: Script to deploy the contract on a test network.
- `.env`: Stores private keys & RPC URLs (excluded from version control).
- `hardhat.config.js`: Hardhat configuration file.

## Configuration

Create a `.env` file in the root directory:

```sh
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
HOLESKY_RPC_URL=https://YOUR_HOLESKY_RPC
```

Modify `hardhat.config.js` if necessary:

```js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    holesky: {
      url: process.env.HOLESKY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

## Running Tests

To execute test cases, run the following commands:

### Run tests for the initial contract:
```sh
npx hardhat test test/AstanaITUniversity_se2328test.js
```

### Run tests for the modified contract:
```sh
npx hardhat test test/AITU_se2328mdftest.js
```

### Or simply use:
```sh
npx hardhat test
```

If tests are successful, you should see output indicating that all test cases passed.

## Screenshots


## License

This project is licensed under the **MIT License**.

For details, refer to the [LICENSE](LICENSE) file in this repository.
