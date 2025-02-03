const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AITU_se2328mdf Token", function () {
    let Token, token, owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        Token = await ethers.getContractFactory("AITU_se2328mdf");
        token = await Token.deploy(5000); // Deploy with custom initial supply
        await token.waitForDeployment();
        console.log("Contract deployed at:", token.target);
    });

    it("Should have correct name, symbol, and initial supply", async function () {
        console.log("Checking token details...");
        expect(await token.name()).to.equal("AstanaITUniversity_se2328");
        expect(await token.symbol()).to.equal("AITU2328");

        const totalSupply = await token.totalSupply();
        console.log("Total Supply:", ethers.formatUnits(totalSupply, 18));
        expect(totalSupply).to.equal(ethers.parseUnits("5000", 18));
    });

    it("Should assign the correct initial supply to the owner", async function () {
        const ownerBalance = await token.balanceOf(owner.address);
        console.log("Owner initial balance:", ethers.formatUnits(ownerBalance, 18));
        expect(ownerBalance).to.equal(ethers.parseUnits("5000", 18));
    });

    it("Should transfer tokens correctly", async function () {
        console.log("Transferring 100 tokens from owner to addr1...");
        await token.transfer(addr1.address, ethers.parseUnits("100", 18));

        const balance = await token.balanceOf(addr1.address);
        console.log("Addr1 balance after transfer:", ethers.formatUnits(balance, 18));

        const [sender, receiver, amount, timestamp] = await token.getRecentTransfer();
        console.log("Last Transfer:", sender, "->", receiver, "Amount:", ethers.formatUnits(amount, 18));

        expect(sender).to.equal(owner.address);
        expect(receiver).to.equal(addr1.address);
        expect(amount).to.equal(ethers.parseUnits("100", 18));
        expect(timestamp).to.be.gt(0);
    });

    it("Should correctly store transaction details", async function () {
        await token.transfer(addr1.address, ethers.parseUnits("50", 18));

        const sender = await token.getTransferSender();
        const receiver = await token.getTransferReceiver();
        const timestamp = await token.getTransferTimestamp();

        console.log("Last transaction sender:", sender);
        console.log("Last transaction receiver:", receiver);
        console.log("Last transaction timestamp:", timestamp);

        expect(sender).to.equal(owner.address);
        expect(receiver).to.equal(addr1.address);
        expect(timestamp).to.be.gt(0);
    });

    it("Should allow transferFrom with approval", async function () {
        console.log("Approving addr1 to transfer 50 tokens from owner...");
        await token.approve(addr1.address, ethers.parseUnits("50", 18));

        console.log("Addr1 transferring 50 tokens from owner to addr2...");
        await token.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseUnits("50", 18));

        const balance = await token.balanceOf(addr2.address);
        console.log("Addr2 balance after transferFrom:", ethers.formatUnits(balance, 18));

        const [sender, receiver, amount] = await token.getRecentTransfer();
        console.log("Last Transfer:", sender, "->", receiver, "Amount:", ethers.formatUnits(amount, 18));

        expect(sender).to.equal(owner.address);
        expect(receiver).to.equal(addr2.address);
        expect(amount).to.equal(ethers.parseUnits("50", 18));
    });

    it("Should format timestamp correctly", async function () {
        await token.transfer(addr1.address, ethers.parseUnits("30", 18));

        const formattedTime = await token.getFormattedTimestamp();
        console.log("Formatted timestamp:", formattedTime);

        expect(formattedTime).to.match(/^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{1,2}$/);
    });

    it("Should emit TransferDetails event on transfer", async function () {
        const amount = ethers.parseUnits("25", 18);
        console.log("Transferring", ethers.formatUnits(amount, 18), "tokens...");

        const blockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;

        await expect(token.transfer(addr1.address, amount))
            .to.emit(token, "TransferDetails")
            .withArgs(owner.address, addr1.address, amount, blockTimestamp + 1); // Adding +1 as the transaction is mined in the next block

        console.log("TransferDetails event emitted.");
    });


    it("Should correctly store the contract owner", async function () {
        const contractOwner = await token.contractOwner();
        console.log("Contract Owner:", contractOwner);
        expect(contractOwner).to.equal(owner.address);
    });

    it("Should reject zero initial supply", async function () {
        const TokenZeroSupply = await ethers.getContractFactory("AITU_se2328mdf");
        console.log("Attempting to deploy with zero supply...");
        await expect(TokenZeroSupply.deploy(0)).to.be.revertedWith("Initial supply must be greater than 0");
    });

    it("Should not allow transfers exceeding balance", async function () {
        console.log("Attempting to transfer more tokens than available...");
        await expect(
            token.connect(addr1).transfer(addr2.address, ethers.parseUnits("10000", 18))
        ).to.be.reverted;
    });

    async function getBlockTimestamp() {
        const block = await ethers.provider.getBlock("latest");
        return block.timestamp;
    }
});
