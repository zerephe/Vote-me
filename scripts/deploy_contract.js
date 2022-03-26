const hre = require("hardhat");
const ethers = hre.ethers


async function main() {
  const [signer] = await ethers.getSigners()
  const Votes = await hre.ethers.getContractFactory("Votes", signer);
  const votes = await Votes.deploy();

  await votes.deployed();

  console.log("Contract deployed address: ", votes.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
