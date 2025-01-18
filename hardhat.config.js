require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

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
