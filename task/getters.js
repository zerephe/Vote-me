require('dotenv').config();


const Votes = require('../artifacts/contracts/Votes.sol/Votes.json');

task("getVoters", "Get voters list in specific vote")
  .addParam("voteId", "Vote id (0...100)")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners()
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const voteToken = new hre.ethers.Contract(
      contractAddress,
      Votes.abi,
      signer
    );

    let result = await voteToken.getVoters(taskArgs.voteId);

    console.log(result);
  });

  task("getCandidates", "Get candidates list in specific vote")
  .addParam("voteId", "Vote id (0...100)")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners()
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const voteToken = new hre.ethers.Contract(
      contractAddress,
      Votes.abi,
      signer
    );

    let result = await voteToken.getCandidates(taskArgs.voteId);

    console.log(result);
  });

  task("getWinner", "Get winner of specific vote")
  .addParam("voteId", "Vote id (0...100)")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners()
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const voteToken = new hre.ethers.Contract(
      contractAddress,
      Votes.abi,
      signer
    );

    let result = await voteToken.getWinner(taskArgs.voteId);

    console.log(result);
  });

  task("getTimeStamp", "Get timestamp of specific vote")
  .addParam("voteId", "Vote id (0...100)")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners()
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const voteToken = new hre.ethers.Contract(
      contractAddress,
      Votes.abi,
      signer
    );

    let result = await voteToken.getVoteTimeStamp(taskArgs.voteId);

    console.log(result);
  });

  task("getVoteCount", "Get amount of votes")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners()
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const voteToken = new hre.ethers.Contract(
      contractAddress,
      Votes.abi,
      signer
    );

    let result = await voteToken.getVoteCount();

    console.log(result);
  });