var Migrations = artifacts.require("./Migrations.sol");
var PaymentGatewayContract = artifacts.require("./PaymentGatewayContract.sol");
var GatewayERC20Contract = artifacts.require("./GatewayERC20Contract.sol");

module.exports = function(deployer) {  
  deployer.deploy(Migrations);
  var gateway;
  deployer.deploy(PaymentGatewayContract).then((g) => {
    gateway = g;
    return deployer.deploy(GatewayERC20Contract, gateway.address);
  }).then((erc20) => {
    return gateway.setTokenContract(erc20.address);
  });
};
