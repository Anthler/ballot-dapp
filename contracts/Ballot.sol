pragma solidity >= 0.5.5;
pragma experimental ABIEncoderV2;

contract Ballot {

    struct Voter {
        uint weight;
        bool voted;
        address delegate;
        uint vote;
    }

    struct Proposal {
        string name; 
        uint voteCount;
    }

    string public description;
    uint public startDate;
    uint public endDate;
    //bytes[] public attachedDocs;
    bytes public attachedDoc;
    address public chairperson;
    mapping(address => Voter) public voters;
    mapping(uint => Proposal) public proposals;
    uint public proposalsCount;

    enum State{Init, Started, Ended, Closed}
    State public state;
    
    constructor(
        string[] memory _proposalNames, 
        string memory _description, 
        bytes memory _attachedDoc, 
        uint _startDate, 
        uint _endDate
    ) public {
        chairperson = tx.origin;
        voters[chairperson].weight = 1;
        description = _description;
        startDate = _startDate;
        endDate = _endDate;
        
        attachedDoc = _attachedDoc;
        

        for (uint i = 0; i < _proposalNames.length; i++) {
            proposalsCount++;
            
            proposals[proposalsCount] = Proposal({
                name: _proposalNames[i],
                voteCount: 0
            });
        }

        // for(uint i = 0; i < _attachedDocs.length; i++){
        //     attachedDocs.push(_attachedDocs[i]);
        // }
    }

    function giveRightToVote(address voter) public {
        require(msg.sender == chairperson,"Only chairperson can give right to vote.");
        require(!voters[voter].voted,"The voter already voted.");
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
    }

    function delegate(address to) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You already voted.");

        require(to != msg.sender, "Self-delegation is disallowed.");
        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;
            require(to != msg.sender, "Found loop in delegation.");
        }
        
        sender.voted = true;
        sender.delegate = to;
        Voter storage delegate_ = voters[to];
        if (delegate_.voted) {
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            delegate_.weight += sender.weight;
        }
    }

    function vote(uint proposal) public {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = proposal;
        proposals[proposal].voteCount += sender.weight;
    }

    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p <= proposalsCount; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() public view
            returns (string memory winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }

    function close() public {
        require(msg.sender == chairperson, "You are not authorized to carry this action");
        state = State.Closed;
    }

    // function getAttachedDocuments() public view returns(bytes[] memory){
    //     return attachedDocs;
    // }
}