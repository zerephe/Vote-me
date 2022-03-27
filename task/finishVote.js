require('dotenv').config();


const Votes = require('../artifacts/contracts/Votes.sol/Votes.json');

task("finishVote", "Finish vote! (Only after 3 days))")
  .addParam("voteId", "Vote id to finish(0...100)")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners()
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const voteToken = new hre.ethers.Contract(
      contractAddress,
      Votes.abi,
      signer
    );

    const result = await voteToken.finishVote(taskArgs.voteId);
    console.log(result);
  });

  

  