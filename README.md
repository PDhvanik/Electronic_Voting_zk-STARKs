# Electronic Voting with zk-STARKs

A secure, privacy-preserving electronic voting system leveraging zk-STARKs for cryptographic proof and Ethereum smart contracts for transparent, tamper-resistant vote tallying.

---

## Table of Contents

- [Introduction](#introduction)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Smart Contract Details](#smart-contract-details)
- [Backend API](#backend-api)
- [Frontend Usage](#frontend-usage)
- [Setup Guide](#setup-guide)
  - [1. Smart Contract](#1-smart-contract)
  - [2. Backend](#2-backend)
  - [3. Frontend](#3-frontend)
- [Development & Testing](#development--testing)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Introduction

This project demonstrates a decentralized, privacy-preserving electronic voting system. It combines zk-STARKs (Zero-Knowledge Scalable Transparent ARguments of Knowledge) for cryptographic proof of vote validity, and Ethereum smart contracts for transparent, auditable vote storage and counting.

**Key goals:**

- Voter privacy: No link between voter and vote.
- Vote integrity: Only valid votes are counted, and double voting is prevented.
- Transparency: Anyone can verify the vote tally on-chain.

---

## Architecture

```mermaid
graph TD
  A[Frontend (HTML/JS)] -- REST API --> B[Backend (Express + zk-STARK)]
  B -- Web3.js --> C[Smart Contract (Ethereum)]
  C -- Vote Tally, Candidates --> B
  B -- Candidates, Vote Counts --> A
```

- **Frontend**: User interface for voting and viewing results.
- **Backend**: Generates and verifies zk-STARK proofs, interacts with the smart contract.
- **Smart Contract**: Stores candidates, vote counts, and prevents double voting.

---

## Features

- **zk-STARK Proofs**: Each vote is accompanied by a zero-knowledge proof of validity.
- **Ethereum Smart Contract**: Immutable, transparent vote storage and tallying.
- **Double Voting Prevention**: Enforced both on-chain and in backend logic.
- **Live Vote Counts**: Real-time updates via backend API.
- **Simple UI**: Easy to use, no build step required.

---

## Technology Stack

- **Smart Contract**: Solidity, Truffle
- **Backend**: Node.js, Express, Web3.js, @guildofweavers/genstark, dotenv
- **Frontend**: HTML, JavaScript (vanilla)
- **Blockchain**: Local Ethereum node (Ganache recommended)

---

## Directory Structure

```
.
├── Backend/           # Express backend with zk-STARK logic
│   ├── server.js
│   ├── package.json
│   └── ...
├── Frontend/          # Simple HTML/JS frontend
│   ├── index.html
│   └── script.js
└── Smart Contract/    # Solidity contract and Truffle config
    ├── contracts/
    │   └── SecureVoting.sol
    ├── migrations/
    ├── build/contracts/
    │   └── SecureVoting.json
    └── truffle-config.js
```

---

## Smart Contract Details

- **File**: `Smart Contract/contracts/SecureVoting.sol`
- **Main Functions**:
  - `vote(bytes32 proofHash, uint256 candidateIndex)`: Casts a vote if the proof and sender are unique.
  - `getCandidates()`: Returns all candidates and their vote counts.
  - `getVoteCount(uint256 candidateIndex)`: Returns the vote count for a candidate.
- **Security**:
  - Prevents double voting by tracking both sender and proof hash.
  - Only allows voting for valid candidate indices.
- **Events**:
  - `VoteCast(bytes32 proofHash, uint256 candidateIndex)`

---

## Backend API

- **Base URL**: `http://localhost:5000`

| Endpoint                 | Method | Description                                             |
| ------------------------ | ------ | ------------------------------------------------------- |
| `/candidates`            | GET    | List all candidates                                     |
| `/vote`                  | POST   | Cast a vote (requires account, voterId, candidateIndex) |
| `/votes/:candidateIndex` | GET    | Get vote count for a candidate                          |
| `/accounts`              | GET    | List available Ethereum accounts                        |

**Example: Cast a Vote**

```json
POST /vote
{
  "account": "0x...",
  "voterId": 123456,
  "candidateIndex": 0
}
```

---

## Frontend Usage

- Open `Frontend/index.html` in your browser (no build step required).
- Select an account, choose a candidate, and vote!
- View live vote counts and status messages.

---

## Setup Guide

### 1. Smart Contract

1. **Install dependencies**
   ```bash
   cd "Smart Contract"
   npm install
   ```
2. **Start local Ethereum node** (e.g., Ganache on port 8545)
3. **Compile and deploy contract**
   ```bash
   truffle migrate --reset
   ```
   - The contract will be deployed to your local network. Note the deployed contract address.
   - You can customize candidate names in the migration script or contract constructor.

### 2. Backend

1. **Install dependencies**
   ```bash
   cd ../Backend
   npm install
   ```
2. **Configure environment**
   - Create a `.env` file in `Backend/`:
     ```env
     CONTRACT_ADDRESS=<deployed_contract_address>
     ```
   - Replace `<deployed_contract_address>` with the address from the Truffle deployment output.
3. **Start the backend server**
   ```bash
   npm start
   ```
   - The backend runs on `http://localhost:5000` by default.

### 3. Frontend

- Open `Frontend/index.html` directly in your browser.
- No build step required.

---

## Development & Testing

- **Smart Contract**: Use Truffle for compilation, migration, and testing.
  ```bash
  cd "Smart Contract"
  truffle test
  ```
- **Backend**: Add tests as needed (currently none specified).
- **Frontend**: Manual testing via browser.

---

## Security Considerations

- **Demo Only**: This project is for educational/demo purposes. Do not use in production.
- **Voter Privacy**: The frontend generates a random voterId for demonstration. In real systems, voter authentication and privacy must be handled securely.
- **Private Keys**: Never expose private keys or sensitive data in frontend or public repos.
- **Contract Deployment**: Always verify contract addresses and network before deploying.

---

## Troubleshooting

- **Contract Not Found**: Ensure Ganache is running and the contract is deployed. Update `CONTRACT_ADDRESS` in `.env`.
- **CORS Issues**: The backend enables CORS. If you encounter issues, check browser console and backend logs.
- **Web3 Connection**: Ensure the backend can connect to your Ethereum node at `http://127.0.0.1:8545`.
- **Port Conflicts**: Make sure ports 5000 (backend) and 8545 (Ganache) are free.

---

## License

MIT

---

## Acknowledgments

- [@guildofweavers/genstark](https://github.com/GuildOfWeavers/genSTARK)
- [Truffle Suite](https://trufflesuite.com/)
- [Web3.js](https://web3js.readthedocs.io/)
- [Ethereum](https://ethereum.org/)
- [Ganache](https://trufflesuite.com/ganache/)

---
