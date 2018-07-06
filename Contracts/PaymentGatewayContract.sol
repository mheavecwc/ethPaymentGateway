pragma solidity ^0.4.23;
import "./math/SafeMath.sol";
import "./ownership/Ownable.sol";
import "./GatewayERC20Contract.sol";

contract PaymentGatewayContract is Ownable{
    using SafeMath for uint256;
    uint gatewayFeePercentage;
    uint256 gatewayBalance;
    mapping(address => Merchant) merchants;

    GatewayERC20Contract tokenContract;

    event AddMerchantEvent(address merchant);
    event PaymentMadeEvent(address _merchant, string _reference, uint _amount);
    event PaymentMadeInTokensEvent(address _merchant, string _reference, uint _tokenAmount);
    event WithdrawGatewayFundsEvent(address _walletAddress, uint _amount);
    event WithdrawPaymentEvent(address _walletAddress, uint _amount);

    constructor() public {
        gatewayFeePercentage = 10;
        gatewayBalance = 0;
    }

    function setTokenContract(address _tokenContractAddress) public onlyOwner{
        tokenContract = GatewayERC20Contract(_tokenContractAddress);
    }

    function issueTokens(address _recipient, uint _amount) public onlyOwner{
        tokenContract.issueTokens(_recipient, _amount);
    }


    function addMerchant(address _walletAddress) public onlyOwner {
        require(!isExistingMerchant(_walletAddress));
        Merchant memory newMerchant = Merchant({ balance: 0, created: true});
        merchants[_walletAddress] = newMerchant;
        emit AddMerchantEvent(_walletAddress);
    }

    function makePayment(address _merchantAddress, string _reference) payable allowedToMakePayment(_merchantAddress, _reference) public{
        uint gatewayFee = calculateGatewayFee(msg.value);
        gatewayBalance = SafeMath.add(gatewayBalance, gatewayFee);

        uint merchantPayment = SafeMath.sub(msg.value, gatewayFee);
        addPaymentToMerchantBalance(_merchantAddress, merchantPayment);

        emit PaymentMadeEvent(_merchantAddress, _reference, msg.value);
    }

    function makePaymentInTokens(address _merchantAddress, string _reference, uint _tokenAmount) 
        allowedToMakePayment(_merchantAddress, _reference) public{
        tokenContract.gatewayTokenTransfer(msg.sender, _merchantAddress, _tokenAmount);
        emit PaymentMadeInTokensEvent(_merchantAddress, _reference, _tokenAmount);
    }

    function addPaymentToMerchantBalance(address _merchantAddress, uint256 _paymentAmount) private {
        uint256 currentBalance = merchants[_merchantAddress].balance;
        merchants[_merchantAddress].balance = SafeMath.add(currentBalance, _paymentAmount);
    }

    function withdrawPayment(address _merchantAddress) public{
        require(permittedToAccessAccount(_merchantAddress));
        uint merchBalance = merchants[_merchantAddress].balance;
        _merchantAddress.transfer(merchBalance);
        merchants[_merchantAddress].balance = 0;
        emit WithdrawPaymentEvent(_merchantAddress, merchBalance);
    }

    // Fees
    function setGatewayFee(uint _newFee) onlyOwner public{
        require(_newFee < 100);
        gatewayFeePercentage = _newFee;
    }

    function withdrawGatewayFees() onlyOwner public{
        owner.transfer(gatewayBalance);
        emit WithdrawGatewayFundsEvent(owner, gatewayBalance);                
        gatewayBalance = 0;
    }

    // Read only functions
    function getMerchantBalance(address _merchantAddress) public view returns(address, uint){
        require(permittedToAccessAccount(_merchantAddress));        
        Merchant memory merchant = merchants[_merchantAddress];
        return (_merchantAddress, merchant.balance);
    }

    function getGatewayBalance() public onlyOwner view returns(uint){
        return gatewayBalance;
    }

    // Calculations
    function calculateGatewayFee(uint _amount) private view returns(uint fee){
        return SafeMath.mul(_amount, gatewayFeePercentage) / 100;
    }

    // Require functions
    function permittedToAccessAccount(address _address) private view returns (bool valid){
        if(msg.sender == owner){
            return true;
        }
        return msg.sender == _address;
    }

    function isExistingMerchant(address _merchantAddress) internal view returns (bool){
        return merchants[_merchantAddress].created;
    }

    function isStringEqual(string _input_a, string _input_b) private pure returns(bool){
        return keccakHash(_input_a) == keccakHash(_input_b);
    }

    function isStringEmpty(string _input) private pure returns(bool){
        return keccakHash(_input) == keccakHash("");
    }


    function keccakHash(string _input) private pure returns (bytes32){
        return keccak256(abi.encodePacked(_input));
    }

    modifier allowedToMakePayment(address _merchant, string _reference){
        require(!isStringEmpty(_reference));
        require(isExistingMerchant(_merchant));
        _;
    }

    struct Merchant{
        uint balance;
        bool created;
    }
}