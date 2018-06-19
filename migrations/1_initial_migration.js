var Migrations = artifacts.require("./Migrations.sol");
var PaymentGatewayContract = artifacts.require("./PaymentGatewayContract.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(PaymentGatewayContract);
};
