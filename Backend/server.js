import { instantiateScript } from '@guildofweavers/genstark';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import Web3 from 'web3';

dotenv.config();
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const web3 = new Web3("http://127.0.0.1:8545");
const contractJSON = JSON.parse(
   fs.readFileSync("../Smart Contract/build/contracts/SecureVoting.json", "utf8")
);
const contractABI = contractJSON.abi;
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);


const computationStark = instantiateScript(Buffer.from(`
define Computation over prime field (2^32 - 3 * 2^25 + 1) {
    secret input startValue: element[1];

    // Transition function
    transition 1 register {
        for each (startValue) {
            init { yield startValue; }
            for steps [1..63] { yield $r0 + 2; }
        }
    }

    // Constraints
    enforce 1 constraint {
        for all steps { enforce transition($r) = $n; }
    }
}`));

function generateProof(startValue) {
   const assertions = [
      { register: 0, step: 0, value: BigInt(startValue) },
      { register: 0, step: 63, value: BigInt(startValue) + BigInt(126) }
   ];
   return computationStark.prove(assertions, [[BigInt(startValue)]]);
}

function verifyProof(proof, startValue) {
   const assertions = [
      { register: 0, step: 0, value: BigInt(startValue) },
      { register: 0, step: 63, value: BigInt(startValue) + BigInt(126) }
   ];
   return computationStark.verify(assertions, proof);
}

function stringifyBigInt(obj) {
   return JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
   );
}

app.get("/candidates", async (req, res) => {
   try {
      const candidates = await contract.methods.getCandidates().call();
      const formattedCandidates = candidates.map(candidate => ({
         name: candidate.name,
         voteCount: candidate.voteCount.toString()
      }));

      res.json(formattedCandidates);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

app.post("/vote", async (req, res) => {
   const { account, voterId, candidateIndex } = req.body;
   try {
      const proof = generateProof(voterId);

      const isValid = verifyProof(proof, voterId);
      if (!isValid) {
         return res.status(400).json({ success: false, message: "Invalid proof" });
      }

      const proofHash = web3.utils.sha3(stringifyBigInt(proof));
      await contract.methods.vote(proofHash, candidateIndex).send({ from: account, gasLimit: 9000000 });

      res.json({ success: true, message: "Vote cast successfully!" });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

app.get("/votes/:candidateIndex", async (req, res) => {
   const candidateIndex = req.params.candidateIndex;
   try {
      const count = await contract.methods.getVoteCount(candidateIndex).call();
      res.json({ candidateIndex, count: count.toString() });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

app.get("/accounts", async (req, res) => {
   try {
      const accs = await web3.eth.getAccounts();
      res.status(200).json({ success: true, accounts: accs });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
