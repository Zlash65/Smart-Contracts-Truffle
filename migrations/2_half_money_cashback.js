var HalfMoneyCashback = artifacts.require("./HalfMoneyCashback.sol");

module.exports = function(deployer) {
  deployer.deploy(HalfMoneyCashback);
};
