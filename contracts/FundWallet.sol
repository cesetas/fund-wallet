// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract FundWallet is Ownable {

    address[] public funders;
    uint public balance;
    mapping(address=>bool) public isFunded;
    mapping(address=>uint) public fundedAmount;


    constructor () {
        balance = address(this).balance;
    }

    function addFund() public payable{
        require(msg.value>0, "must be more than zero");
        if (!isFunded[msg.sender]){
            funders.push(msg.sender);
            isFunded[msg.sender]=true;
        }
        fundedAmount[msg.sender] += msg.value;
        balance += msg.value;
    }

    function withdrawFund(uint _amount) public payable onlyOwner{
        require(_amount>0, "must be positive");
        payable(msg.sender).transfer(_amount);
        balance -= _amount;
    }

    function getAllFunders() public view returns (address[] memory) {
        return funders;
    }

    function getFunderAtIndex(uint8 index) external view returns(address) {
        return funders[index];
    }
}


// const instance = await FundWallet.deployed();

// instance.addFund({from: account[0], value: "100000000000000000"})
// instance.addFund({from: account[1], value: "100000000000000000"})


// instance.withdrawFund({"10000000000000000", (from: account[0])})