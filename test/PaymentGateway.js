var PaymentGatewayContract = artifacts.require("PaymentGatewayContract");

contract('PaymentGatewayContract', function(accounts){
    it("Should add merchant to contract", function(){
        return PaymentGatewayContract.deployed().then(function(instance){
                console.log(instance.addMerchant);
        });

    });
});