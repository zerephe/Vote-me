//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;


contract Votes{

    constructor() {
        contractOwner = msg.sender;
    }

    struct Vote{
        mapping (address => uint) candidateVotes;
        mapping (address => bool) isVoted;
        mapping (address => bool) isCandidate;
        uint bornTime;
        uint contribution;
        address voteWinner;
        address[] candidates;
        address[] voters;
        bool isActive;
    }
    
    address contractOwner;
    address _defaulrAddress;
    mapping (uint => Vote) votes;
    uint voteId;
    uint voteDuration = 3 days;

    function addVote(address[] memory retrivedCandidates) public ownerOnly{
        Vote storage vote = votes[voteId];
        vote.bornTime = block.timestamp;
        vote.isActive = true;
        vote.candidates = retrivedCandidates;

        for(uint i = 0; i < retrivedCandidates.length; i++){
            vote.isCandidate[retrivedCandidates[i]] = true;
        }

        voteId++;
    }

    function withdrawFee(address payable receiverAddress, uint _withdrawAmount) public ownerOnly{
        receiverAddress.transfer(_withdrawAmount); 
    }

    function voteFor(uint _voteId, address candidate) public payable{
        Vote storage vote = votes[_voteId];

        require(vote.isActive, "Vote doesn't exist!");
        require(vote.isCandidate[candidate], "No such candidate!");
        require(!vote.isCandidate[msg.sender], "Candidates can't vote!");
        require(!vote.isVoted[msg.sender], "You've already voted!");
        require(msg.value >= 0.01 ether, "Not enough contribution!");

        address _voteWinner = vote.voteWinner;
        
        if(vote.candidateVotes[candidate] > vote.candidateVotes[_voteWinner] || vote.voteWinner == _defaulrAddress){
            vote.voteWinner = candidate;
        }

        vote.candidateVotes[candidate]++;
        vote.voters.push(msg.sender);
        vote.isVoted[msg.sender] = true;
        vote.contribution += (msg.value/10)*9;
    }

    function finishVote(uint _voteId) public payable{
        Vote storage vote = votes[_voteId];
        
        require(vote.bornTime > 0, "No such vote!");
        require(vote.bornTime <= block.timestamp - voteDuration , "Can't close the vote yet!");

        payable(vote.voteWinner).transfer(vote.contribution);

        vote.isActive = false;
        vote.bornTime = 0;
    }

    modifier ownerOnly {
        require(msg.sender == contractOwner, "Access denied!");
        _;
    }

    function owner() public view returns(address) {
        return contractOwner;
    }
    
    function testTime() public ownerOnly{
        //This function is for test only.
        //Sets vote duration to 0 in order to be able to finish voting while testing
        voteDuration = 0;
    }

    function getVoters(uint _voteId) public view returns(address[] memory){
        Vote storage vote = votes[_voteId];
        return vote.voters;
    }

    function getCandidates(uint _voteId) public view returns(address[] memory){
        Vote storage vote = votes[_voteId];
        return vote.candidates;
    }

    function getWinner(uint _voteId) public view returns(address){
        Vote storage vote = votes[_voteId];

        require(vote.voteWinner != _defaulrAddress, "No votes, no winner!");
        return vote.voteWinner;
    }

    function getVoteCount() public view returns(uint){
        return voteId;
    }

    function getVoteTimeStamp(uint _voteId) public view returns(uint){
        Vote storage vote = votes[_voteId];
        return vote.bornTime;
    } 
}