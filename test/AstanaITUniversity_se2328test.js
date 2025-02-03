const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AstanaITUniversity_se2328", function () {
    let Token, token, owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        Token = await ethers.getContractFactory("AstanaITUniversity_se2328");
        token = await Token.deploy(owner.address);
        await token.waitForDeployment();
    });

    it("Should have correct name and symbol", async function () {
        const name = await token.name();
        const symbol = await token.symbol();
        console.log(`Token Name: ${name}, Symbol: ${symbol}`);
        expect(name).to.equal("AstanaITUniversity_se2328");
        expect(symbol).to.equal("AITU2328");
    });

    it("Should assign initial supply to owner", async function () {
        const ownerBalance = await token.balanceOf(owner.address);
        console.log(`Owner Initial Balance: ${ownerBalance.toString()}`);
        expect(ownerBalance).to.equal(ethers.parseUnits("2000", 18));
    });

    it("Should transfer tokens between accounts", async function () {
        await token.transfer(addr1.address, ethers.parseUnits("100", 18));
        const balance = await token.balanceOf(addr1.address);
        console.log(`addr1 Balance after transfer: ${balance.toString()}`);
        expect(balance).to.equal(ethers.parseUnits("100", 18));
    });

    it("Should record transfer transactions", async function () {
        const tx = await token.transfer(addr1.address, ethers.parseUnits("50", 18));
        const receipt = await tx.wait();
        const blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;

        const txHash = ethers.keccak256(
            ethers.solidityPacked([
                "address", "address", "uint256", "uint256", "uint256"
            ], [owner.address, addr1.address, ethers.parseUnits("50", 18), blockTimestamp, receipt.blockNumber])
        );
        console.log(`Transaction Hash: ${txHash}`);

        const transferInfo = await token.getTransactionInfo(txHash);
        console.log(`Transfer Info: Sender - ${transferInfo[0]}, Receiver - ${transferInfo[1]}, Amount - ${transferInfo[2]}`);
        expect(transferInfo[0]).to.equal(owner.address);
        expect(transferInfo[1]).to.equal(addr1.address);
        expect(transferInfo[2]).to.equal(ethers.parseUnits("50", 18));
    });

    it("Should transferFrom with approval", async function () {
        await token.approve(addr1.address, ethers.parseUnits("50", 18));
        await token.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseUnits("50", 18));
        const balance = await token.balanceOf(addr2.address);
        console.log(`addr2 Balance after transferFrom: ${balance.toString()}`);
        expect(balance).to.equal(ethers.parseUnits("50", 18));
    });

    it("Should retrieve sender and receiver from transaction hash", async function () {
        const tx = await token.transfer(addr1.address, ethers.parseUnits("75", 18));
        const receipt = await tx.wait();
        const blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;

        const txHash = ethers.keccak256(
            ethers.solidityPacked([
                "address", "address", "uint256", "uint256", "uint256"
            ], [owner.address, addr1.address, ethers.parseUnits("75", 18), blockTimestamp, receipt.blockNumber])
        );
        console.log(`Transaction Hash: ${txHash}`);

        const sender = await token.getSender(txHash);
        const receiver = await token.getReceiver(txHash);
        console.log(`Sender: ${sender}, Receiver: ${receiver}`);

        expect(sender).to.equal(owner.address);
        expect(receiver).to.equal(addr1.address);
    });

    it("Should convert timestamp to string", async function () {
        const tx = await token.transfer(addr1.address, ethers.parseUnits("30", 18));
        const receipt = await tx.wait();
        const blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;

        const txHash = ethers.keccak256(
            ethers.solidityPacked([
                "address", "address", "uint256", "uint256", "uint256"
            ], [owner.address, addr1.address, ethers.parseUnits("30", 18), blockTimestamp, receipt.blockNumber])
        );
        console.log(`Transaction Hash: ${txHash}`);

        const timestampString = await token.getLatestBlockTimestampHumanReadable(txHash);
        console.log(`Timestamp as String: ${timestampString}`);

        expect(timestampString).to.equal(blockTimestamp.toString());
    });
});