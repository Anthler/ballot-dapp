pragma solidity >= 0.5.5;
pragma experimental ABIEncoderV2;

import "./Ballot.sol";

contract BallotFactory{

    mapping(uint => Ballot) public elections;
    uint private count;
    address public superAdmin;

    modifier onlyOwner(){
        require(msg.sender == superAdmin);
        _;
    }

    function createElection(
        string memory _description, 
        bytes32[] memory _proposalNames,
        bytes[] memory _attachedDocs, 
        uint startDate,
        uint endDate
    ) public onlyOwner(){
        uint id = count++;
        elections[id] = new Ballot(_proposalNames, _description,_attachedDocs,startDate,endDate);
    }

    function getCount() public view returns(uint){
        return count;
    }
}