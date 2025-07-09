// contracts/SecureVoting.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecureVoting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    mapping(bytes32 => bool) public usedProofs;
    mapping(address => bool) public hasVoted;
    
    Candidate[] public candidates;

    event VoteCast(bytes32 proofHash, uint256 candidateIndex);

    constructor(string[] memory _candidateNames) {
        for (uint i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name: _candidateNames[i],
                voteCount: 0
            }));
        }
    }

    function vote(bytes32 proofHash, uint256 candidateIndex) public {
        require(!hasVoted[msg.sender], "Already voted");
        require(!usedProofs[proofHash], "Proof already used");
        require(candidateIndex < candidates.length, "Invalid candidate");
        usedProofs[proofHash] = true;
        hasVoted[msg.sender] = true;
        candidates[candidateIndex].voteCount += 1;

        emit VoteCast(proofHash, candidateIndex);
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVoteCount(uint256 candidateIndex) public view returns (uint256) {
        require(candidateIndex < candidates.length, "Invalid candidate");
        return candidates[candidateIndex].voteCount;
    }
}
