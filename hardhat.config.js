require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {},
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    bitfinity: {
      url: 'https://testnet.bitfinity.network',
      accounts: ['089b9888552787c24d8f4e4b96c11221884def4c2ae3f296a48ad65c4c9eb64a'],
      chainId: 355113,
      timeout: 120000,
    },
  },
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 40000,
  },
}
