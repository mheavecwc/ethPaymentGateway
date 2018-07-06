pragma solidity ^0.4.23;

contract ERC20Interface {
    function totalSupply() public view returns (uint);
    function balanceOf(address tokenOwner) public view returns (uint balance);
    function transfer(address to, uint tokens) public returns (bool success);

    event IssueTokens(address indexed recipient, uint amount, uint balanceBefore, uint balanceAfter, address issuedBy);
    event Transfer(address indexed from, address indexed to, uint tokens);
}