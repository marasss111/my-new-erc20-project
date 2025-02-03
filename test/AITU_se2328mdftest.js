const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AstanaITUniversity_se2328_Modified", function () {
    let Token, token, owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        Token = await ethers.getContractFactory("AstanaITUniversity_se2328_Modified");
        token = await Token.deploy(owner.address, 5000);
        await token.waitForDeployment();
    });

    it("Should initialize with the correct owner and initial supply", async function () {
        const ownerBalance = await token.balanceOf(owner.address);
        console.log(`Owner: ${await token.owner()}, Initial Supply: ${ownerBalance.toString()}`);
        expect(await token.owner()).to.equal(owner.address);
        expect(ownerBalance).to.equal(ethers.parseUnits("5000", 18));
    });

    it("Should allow transfers and log transactions", async function () {
        await token.transfer(addr1.address, ethers.parseUnits("200", 18));
        const balance = await token.balanceOf(addr1.address);
        console.log(`addr1 Balance after transfer: ${balance.toString()}`);
        expect(balance).to.equal(ethers.parseUnits("200", 18));
    });

    it("Should store transaction details correctly", async function () {
        const tx = await token.transfer(addr1.address, ethers.parseUnits("100", 18));
        const receipt = await tx.wait();
        const blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;

        const txHash = ethers.keccak256(
            ethers.solidityPacked([
                "address", "address", "uint256", "uint256", "uint256"
            ], [owner.address, addr1.address, ethers.parseUnits("100", 18), blockTimestamp, receipt.blockNumber])
        );
        console.log(`Transaction Hash: ${txHash}`);

        const transferInfo = await token.getTransactionInfo(txHash);
        console.log(`Transfer Info: Sender - ${transferInfo[0]}, Receiver - ${transferInfo[1]}, Amount - ${transferInfo[2]}`);
        expect(transferInfo[0]).to.equal(owner.address);
        expect(transferInfo[1]).to.equal(addr1.address);
        expect(transferInfo[2]).to.equal(ethers.parseUnits("100", 18));
    });

    it("Should allow transferFrom after approval", async function () {
        await token.approve(addr1.address, ethers.parseUnits("150", 18));
        await token.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseUnits("150", 18));
        const balance = await token.balanceOf(addr2.address);
        console.log(`addr2 Balance after transferFrom: ${balance.toString()}`);
        expect(balance).to.equal(ethers.parseUnits("150", 18));
    });
});