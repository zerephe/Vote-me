const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Votes", function () {
  
  let Token; 
  let voteToken;
  let addr1;
  let addr2;
  let contrib = "10000000000000000";

  beforeEach(async function(){
    // Getting ContractFactory and Signers
    Token = await ethers.getContractFactory("Votes");
    [owner, addr1, addr2] = await ethers.getSigners();
    
    voteToken = await Token.deploy();
    await voteToken.deployed();

  });

  describe("Deployment", function () {

    it("Should verify the owner", async function () {
      // Expecting stored owner variable to be equal to signer owner 
      expect(await voteToken.owner()).to.equal(owner.address);
    });

    it("Should be proper address", async function(){
      //Checking with waffle if address is proper
      expect(voteToken.address).to.be.properAddress;
    });

    it("Should be 0 amount in balance right after deployment or by default", async function(){
      //Checking balance of address
      expect(await ethers.provider.getBalance(voteToken.address)).to.equal(0);
    });
  });

  describe("Voting", function(){

    it("Should be reverted if non owner tried adding vote", async function(){
      await expect(voteToken.connect(addr1).addVote(["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
                                                     "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"])).to.be.revertedWith("Access denied!");
    });

    it("Should be some votes added", async function(){
      //Adding vote
      await voteToken.addVote(["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
                               "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"]);

      //Checking if vote has been added
      expect(await voteToken.getVoteCount()).to.eq(1);
    });

    it("Should be able to vote", async function(){
      await voteToken.addVote(["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
                               "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]);
      await voteToken.voteFor(0, "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", {value: contrib});
      
      let voters = await voteToken.getVoters(0);
      expect(voters.length).to.eq(1);
    });

    it("Should be reverted if vote doesn't exist", async function(){
      await expect(voteToken.voteFor(0, addr1.address,{value: contrib})).to.be.revertedWith("Vote doesn't exist!");
    });

    it("Should be reverted if candidate doesn't exist", async function(){
      await voteToken.addVote(["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
                               "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"]);
      await expect(voteToken.voteFor(0, addr1.address,{value: contrib})).to.be.revertedWith("No such candidate!");
    });

    it("Should be reverted if candidate is voting", async function(){
      await voteToken.addVote([addr1.address, "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]);
      await expect(voteToken.connect(addr1).voteFor(0, addr1.address,{value: contrib})).to.be.revertedWith("Candidates can't vote!");
    });

    it("Should be reverted if tried voting many times", async function(){
      await voteToken.addVote([addr1.address, "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]);
      await voteToken.voteFor(0, addr1.address,{value: contrib});
      await expect(voteToken.voteFor(0, addr1.address,{value: contrib})).to.be.revertedWith("You've already voted!");
    });

    it("Should be reverted if not enough contributed", async function(){
      await voteToken.addVote([addr1.address, "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]);
      await expect(voteToken.voteFor(0, addr1.address,{value: 100})).to.be.revertedWith("Not enough contribution!");
    });

    it("Should be able to finish existing vote", async function(){
      await voteToken.addVote([addr1.address, "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]);
      await voteToken.testTime();
      await voteToken.finishVote(0);
      expect(await voteToken.getVoteTimeStamp(0)).to.eq(0);
    });

    it("Should be reverted if vote doesn't exist", async function(){
      await expect(voteToken.finishVote(0)).to.be.revertedWith("No such vote!");
    });

    it("Should be reverted if 3 days not", async function(){
      await voteToken.addVote([addr1.address, "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]);
      await expect(voteToken.finishVote(0)).to.be.revertedWith("Can't close the vote yet!");
    });

    it("Should be added some candidates", async function(){
      await voteToken.addVote(["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
                               "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
                               "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"]);
      let candidates = await voteToken.getCandidates(0);
      expect(candidates.length).to.eq(3);
    });

    it("Should be some winner", async function(){
      //Adding votes and voters
      await voteToken.addVote(["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]);
      await voteToken.voteFor(0, "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",{value: contrib});
      await voteToken.connect(addr1).voteFor(0, "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",{value: contrib});
      await voteToken.connect(addr2).voteFor(0, "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",{value: contrib});     
      await voteToken.testTime();
      await voteToken.finishVote(0);
      expect(await voteToken.getWinner(0)).to.eq("0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2");
    });
  });

  describe("Txs", function(){
    it("Should revert withdrawal if owner is fake", async function() {
      await expect(voteToken.connect(addr1).withdrawFee(addr2.address, 0)).to.be.revertedWith("Access denied!");
    });

    it("Should be possible to withdraw", async function(){
      //Make some vote then withdraw it to another address
      await voteToken.addVote(["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]);
      await voteToken.voteFor(0, "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",{value: contrib});

      let withdrawal = await voteToken.withdrawFee(addr1.address, 100);
      await expect(() => withdrawal).to.changeEtherBalances([voteToken, addr1], [-100, 100]);
      await withdrawal.wait();
    });

    it("Should be possible to send contribution to vote-winner", async function(){
      //Make some vote
      await voteToken.addVote([addr1.address, "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]);
      await voteToken.voteFor(0, addr1.address,{value: contrib});
      await voteToken.testTime();

      let sendContrib = await voteToken.finishVote(0);
      await expect(() => sendContrib).to.changeEtherBalances([voteToken, addr1], [-(contrib/10)*9, (contrib/10)*9]);
      await sendContrib.wait();
    });

    it("Should be reverted if there was no vote for candidates", async function(){
      await voteToken.addVote([addr1.address, "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]);
      await voteToken.testTime();
      await voteToken.finishVote(0);
      await expect(voteToken.getWinner(0)).to.be.revertedWith("No votes, no winner!");
    });
  });
});
