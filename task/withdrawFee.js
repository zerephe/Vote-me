require('dotenv').config();


const Votes = require('../artifacts/contracts/Votes.sol/Votes.json');

task("withdrawFee", "Withdraw fee to a specific address")
  .addParam("recipientAddress", "Address of recipient")
  .addParam("withdrawAmount", "Amount of withdrawal tokens")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners();
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const voteToken = new hre.ethers.Contract(
      contractAddress,
      Votes.abi,
      signer
    );

    const result = await voteToken.withdrawFee(taskArgs.recipientAddress, taskArgs.withdrawAmount);
    console.log(result);
  });

