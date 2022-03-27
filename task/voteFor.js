require('dotenv').config();

const Votes = require('../artifacts/contracts/Votes.sol/Votes.json');

task("voteFor", "Vote for a candidate")
  .addParam("voteId", "Vote id (0...100)")
  .addParam("candidateAddress", "Write candidate's address")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners()
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const voteToken = new hre.ethers.Contract(
      contractAddress,
      Votes.abi,
      signer
    );

    let contribution = hre.ethers.utils.parseEther("0.01");
    const result = await voteToken.voteFor(taskArgs.voteId, taskArgs.candidateAddress, {value: contribution});
    console.log(result);
  });

  