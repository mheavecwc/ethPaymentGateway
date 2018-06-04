pragma solidity ^0.4.23;
import {Owned} from "./Owned.sol";

contract PaymentGatewayContract is Owned{
    address gatewayWalletAddress;
    uint gatewayBalance;
    mapping(address => Merchant) merchants;
    mapping (address=> PaymentTx) payments;
    mapping(address => uint) balances;

    
    event TxReceived(PaymentTx paymentTx);

    constructor() public {
        gatewayWalletAddress = msg.sender;
        gatewayBalance = 0;
        owner = msg.sender;
    }

    function addMerchant(address _walletAddress, string _name) public onlyOwner {
        Merchant memory newMerchant = Merchant({ walletAddress: _walletAddress, name: _name, balance: 0});
        merchants[_walletAddress] = newMerchant;
    }

    function getMerchant(address _merchantAddress) public view returns(string name, uint balance){
        Merchant memory merchant = merchants[_merchantAddress];
        return (merchant.name, merchant.balance);
    }
    
    function getGatewayBalance() public onlyOwner view returns(uint){
        return gatewayBalance;
    }
    
    function makePayment(address _merchantAddress) payable public{
        uint gatewayFee = msg.value * 10 / 100;
        uint merchantPayment = msg.value - gatewayFee;
        uint merchBalance = merchants[_merchantAddress].balance;
        merchants[_merchantAddress].balance = merchBalance + merchantPayment;
        gatewayBalance =  gatewayBalance + gatewayFee;
    }
    
    function withdrawPayment(address _merchantAddress) onlyOwner public{
        uint merchBalance = balances[_merchantAddress];
        _merchantAddress.transfer(merchBalance);
        balances[_merchantAddress] = 0;
    }

    function withdrawGatewayFees() onlyOwner public{
        uint gatewayFeeBalance = balances[gatewayWalletAddress];
        gatewayWalletAddress.transfer(gatewayFeeBalance);
        balances[gatewayWalletAddress] = 0;
    }

    struct Merchant{
        address walletAddress;
        string name;
        uint balance;
    }

    struct PaymentTx{
        address sender;
        uint amount;
        bytes reference;
    }
}