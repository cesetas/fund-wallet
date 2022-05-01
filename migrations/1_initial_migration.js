const FundWallet = artifacts.require("FundWallet");

module.exports = function (deployer) {
  deployer.deploy(FundWallet);
};
