pragma solidity ^0.4.23;
import "./math/SafeMath.sol";
import "./ownership/Ownable.sol";


contract PaymentGatewayContract is Ownable{
    using SafeMath for uint256;
    uint gatewayFeePercentage = 10;
    uint256 gatewayBalance;
    mapping(address => Merchant) merchants;

    event AddMerchantEvent(string description, Merchant merchant);
    event PaymentMadeEvent(string description, address _merchant, uint _amount);
    event WithdrawPaymentEvent(string description, address _walletAddress, uint _amount);

    constructor() public {
        owner = msg.sender;
        gatewayBalance = 0;
        owner = msg.sender;
    }

    function addMerchant(address _walletAddress, string _name) public onlyOwner {
        require(!isExistingMerchant(_walletAddress));
        Merchant memory newMerchant = Merchant({ name: _name, balance: 0, created: true});
        merchants[_walletAddress] = newMerchant;
        emit AddMerchantEvent("New merchant added", newMerchant);
    }

    function makePayment(address _merchantAddress) payable public{
        uint gatewayFee = calculateGatewayFee(msg.value);
        gatewayBalance = SafeMath.add(gatewayBalance, gatewayFee);

        uint merchantPayment = SafeMath.sub(msg.value, gatewayFee);
        addPaymentToMerchantBalance(_merchantAddress, merchantPayment);

        emit PaymentMadeEvent("Payment made", _merchantAddress, msg.value);
    }

    function addPaymentToMerchantBalance(address _merchantAddress, uint256 _paymentAmount) private {
        uint256 currentBalance = merchants[_merchantAddress].balance;
        merchants[_merchantAddress].balance = SafeMath.add(currentBalance, _paymentAmount);
    }

    function withdrawPayment(address _merchantAddress) public{
        require(permittedToWithdraw(_merchantAddress));
        uint merchBalance = merchants[_merchantAddress].balance;
        _merchantAddress.transfer(merchBalance);
        merchants[_merchantAddress].balance = 0;
        emit WithdrawPaymentEvent("Merchant payment withdrawal", _merchantAddress, merchBalance);
    }

    function withdrawGatewayFees() onlyOwner public{
        owner.transfer(gatewayBalance);
        gatewayBalance = 0;
        emit WithdrawPaymentEvent("Gateway payment withdrawal", owner, gatewayBalance);        
    }

    // Read only functions
    function getMerchant(address _merchantAddress) public view returns(string name, uint balance){
        Merchant memory merchant = merchants[_merchantAddress];
        return (merchant.name, merchant.balance);
    }

    function getGatewayBalance() public onlyOwner view returns(uint){
        return gatewayBalance;
    }

    // Calculations
    function calculateGatewayFee(uint _amount) private view returns(uint fee){
        return SafeMath.mul(_amount, gatewayFeePercentage) / 100;
    }

    // Require functions
    function permittedToWithdraw(address _address) private view returns (bool valid){
        if(msg.sender == owner){
            return true;
        }
        return msg.sender == _address;
    }

    function isExistingMerchant(address _merchantAddress) internal view returns (bool){
        return merchants[_merchantAddress].created;
    }

    struct Merchant{
        string name;
        uint balance;
        bool created;
    }
}