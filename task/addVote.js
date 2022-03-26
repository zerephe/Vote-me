require('dotenv').config();

const Votes = require('../artifacts/contracts/Votes.sol/Votes.json');

task("addVote", "Add vote!")
  .addParam("candidates", "Write down vote candidates addresses!")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners()
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const voteToken = new hre.ethers.Contract(
      contractAddress,
      Votes.abi,
      signer
    );

    let retrivedCandidates = taskArgs.candidates.replace(' ', '').split(',');
    const result = await voteToken.addVote(retrivedCandidates);
    console.log(result);
  });
