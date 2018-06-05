pragma solidity ^0.4.23;

contract Owned{
    function owned() public { owner = msg.sender; }
    address owner;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }    

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));      
        owner = newOwner;
    }    
}