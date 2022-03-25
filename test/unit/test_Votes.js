const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Donatator", function () {
  
  let Token; 
  let donationToken;
  let addr1;
  let addr2;

  beforeEach(async function(){
    // Getting ContractFactory and Signers
    Token = await ethers.getContractFactory("MakeDonation");
    [owner, addr1, addr2] = await ethers.getSigners();
    
    donationToken = await Token.deploy();
    await donationToken.deployed();

  });

  describe("Deployment", function () {

    it("Should verify the owner", async function () {
      // Expecting stored owner variable to be equal to signer owner 
      expect(await donationToken.owner()).to.equal(owner.address);
    });

    it("Should be proper address", async function(){
      //Checking with waffle if address is proper
      expect(donationToken.address).to.be.properAddress;
    });

    it("Should be no donator right after deployment", async function(){
      // Retriving donators array
      expect(await donationToken.getDonatorAddresses().length).to.be.undefined;
    });

    it("Should be 0 amount in balance right after deployment or by default", async function(){
      //Checking balance of address
      expect(await donationToken.getBalance()).to.equal(0);
    });

  });

  describe("Txs", function(){

    it("Should succeed making donation (transfer)", async function() {
      // Donate 50 tokens
      await donationToken.donate(50, { from: owner.address, value: 50 });
      expect(await donationToken.getDonationAmount(owner.address)).to.equal(50);
    });
    
    it("Should return address and right amount of tokens transfered by this address", async function(){
      // Donate some tokens
      let amount = 200;
      await donationToken.connect(addr1).donate(amount, { from: addr1.address, value: amount });

      //Retrive information
      let donationAddresses = await donationToken.getDonatorAddresses();
      expect(donationAddresses[0]).to.equal(addr1.address);
      expect(await donationToken.getDonationAmount(addr1.address)).to.equal(amount);
    });
    
    it("Should be possible to withdraw", async function(){
      //Make some donation then withdraw it to another address
      await donationToken.donate(100, { from: owner.address, value: 100 });

      let withdrawal = await donationToken.withdraw(addr1.address, 100);
      await expect(() => withdrawal).to.changeEtherBalances([donationToken, addr1], [-100, 100]);
      await withdrawal.wait();
    });

    it("Should be uniqe addresses in donor list", async function(){
      await donationToken.donate(1, { from: owner.address, value: 1 });
      await donationToken.connect(addr1).donate(2, { from: addr1.address, value: 2 });
      await donationToken.connect(owner).donate(10, { from: owner.address, value: 10 });

      let donationAddresses = await donationToken.getDonatorAddresses(); 
      expect(donationAddresses.length).to.equal(2);
    });

    it("Should revert withdrawal if owner is fake", async function() {
      await expect(donationToken.connect(addr1).withdraw(addr2.address, 0)).to.be.revertedWith("Access denied!");
    });

    it("Should revert withdrawal if not enough balance", async function() {
      await expect(donationToken.withdraw(addr1.address, 100)).to.be.revertedWith("Not enough tokens to proceed!");
    });

    it("Should revert if donation amount and tx value doesn't match", async function() {
      await expect(donationToken.donate(50, { from: owner.address, value: 40 })).to.be.revertedWith("Error! Not enough tokens to transfer!");
    });

    it("Should revert if address is not a donor", async function(){
      //Retriving balance from address
      await expect(donationToken.getDonationAmount(owner.address)).to.be.revertedWith("This address is not donor!");
    });

    it("Should revert if donation amount and tx value doesn't match", async function() {
      await expect(donationToken.donate(0, { from: owner.address, value: 0 })).to.be.revertedWith("Invalid amount of donation!");
    });
  });

  describe("Donor database", function(){

    it("Should be a right amount of donors and right amount of contribution that was made", async function(){
      await donationToken.donate(1, { from: owner.address, value: 1 });
      await donationToken.connect(addr1).donate(2, { from: addr1.address, value: 2 });
      await donationToken.connect(addr2).donate(3, { from: addr2.address, value: 3 });

      let donationAddresses = await donationToken.getDonatorAddresses(); 
      expect(donationAddresses.length).to.equal(3);

      for(let i = 0; i < 3; i++){
        expect(await donationToken.getDonationAmount(donationAddresses[i])).to.equal(i+1);
      }
    });
  });

});
