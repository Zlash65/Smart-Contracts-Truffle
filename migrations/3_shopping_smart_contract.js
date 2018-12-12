var ShoppingSmartContract = artifacts.require("./ShoppingSmartContract.sol");

module.exports = function(deployer) {
  deployer.deploy(ShoppingSmartContract);
};
