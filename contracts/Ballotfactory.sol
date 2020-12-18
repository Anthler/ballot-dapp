pragma solidity >= 0.5.5;
pragma experimental ABIEncoderV2;

import "./Ballot.sol";

contract BallotFactory{

    Ballot[] public elections;
    address public superAdmin;
    mapping(address => bool) isValidProposer;

    modifier onlyOwner(){
        require(msg.sender == superAdmin);
        _;
    }

    constructor() public{
        superAdmin = msg.sender;
    }
    struct Proposer{
        uint id;
        string name;
        string desciption;
    }

    function createElection(
        string[] memory _proposalNames,
        string memory _description,
        bytes memory _attachedDoc, 
        uint startDate,
        uint endDate
    ) public onlyOwner(){
        Ballot ball = new Ballot(_proposalNames, _description,_attachedDoc,startDate,endDate);
        elections.push(ball);
    }

    function getCount() public view returns(uint){
        return elections.length;
    }

    function getAllElections() public view returns(Ballot[] memory _elections){
        _elections = elections;
    }

    function addNewProposer(address _proposer) public onlyOwner(){
        isValidProposer[_proposer] = true;
    }

    function deleteProposer(address _proposer) public onlyOwner(){
        isValidProposer[_proposer] = false;
    }
}