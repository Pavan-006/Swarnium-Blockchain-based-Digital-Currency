require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.0",
  networks: {
    swarnium: {
      url: "http://127.0.0.1:8545", // Local blockchain
      accounts: ["c7e8a34ce020b0831a5c35d815cec422ed48864273610dfd843c10a814fee98f"], 
      chainId: 1337 // Custom chain ID
    }
  }
};