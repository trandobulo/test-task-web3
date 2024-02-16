require("@nomicfoundation/hardhat-toolbox");
const dotenv = require('dotenv');

dotenv.config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: process.env.RPC_FORK,
      },
    }
  }
};
