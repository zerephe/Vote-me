//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;


contract Votes{

    constructor() {
        contractOwner = msg.sender;
    }

    struct Vote{
        bool isActive;
        uint bornTime;
        uint contribution;
        address voteWinner;
        address[] candidates;
        address[] voters;
        mapping (address => uint) candidateVotes;
        mapping (address => bool) isVoted;
        mapping (address => bool) isCandidate;
    }

    uint voteId;
    uint fee;
    address contractOwner;
    address _defaultAddress;
    mapping (uint => Vote) votes;

    modifier ownerOnly {
        require(msg.sender == contractOwner, "Access denied!");
        _;
    }

    function addVote(address[] memory retrivedCandidates) public ownerOnly{
        Vote storage vote = votes[voteId];
        vote.bornTime = block.timestamp;
        vote.isActive = true;
        vote.candidates = retrivedCandidates;

        voteId++;
    }

    function withdraw(address payable receiverAddress, uint _withdrawAmount) public ownerOnly{
        receiverAddress.transfer(_withdrawAmount); 
    }

    function voteFor(uint _voteId, address candidate) public payable{
        require(votes[_voteId].isActive, "Vote doesn't exist!");
        require(votes[_voteId].isCandidate[candidate], "No such candidate!");
        require(votes[_voteId].isVoted[msg.sender], "You've already voted!");
        require(msg.value >= 0.01 ether, "Not enough contribution!");

        address _voteWinner = votes[_voteId].voteWinner;
        
        if(votes[_voteId].candidateVotes[candidate] > votes[_voteId].candidateVotes[_voteWinner]){
            votes[_voteId].voteWinner = candidate;
        }

        votes[_voteId].candidateVotes[candidate]++;
        votes[_voteId].voters.push(msg.sender);
        votes[_voteId].isVoted[msg.sender] = true;
        
        votes[_voteId].contribution += (msg.value/10)*9;
        fee += msg.value/10;
    }

    function removeVote(uint _voteId) public payable{
        require(votes[_voteId].bornTime + 3 days <= block.timestamp, "Can't close the vote yet!");

        payable(votes[_voteId].voteWinner).transfer(votes[_voteId].contribution);

        votes[_voteId].isActive = false;
        votes[_voteId].bornTime = 0;
    }
    function getVoters(uint _voteId) public view returns(address[] memory){
        return votes[_voteId].voters;
    }

    function getCandidates(uint _voteId) public view returns(address[] memory){
         return votes[_voteId].candidates;
    }

    function getWinner(uint _voteId) public view returns(address){
        return votes[_voteId].voteWinner;
    }

    function getVoteCount() public view returns(uint){
        return voteId;
    } 
}

