const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AstanaITUniversity_se2328 - Initial Version", function () {
    let Token, token, owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        Token = await ethers.getContractFactory("AstanaITUniversity_se2328");
        token = await Token.deploy(owner.address);
        await token.waitForDeployment();
    });

    it("Should deploy and assign the total supply to the owner", async function () {
        const ownerBalance = await token.balanceOf(owner.address);
        expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("Should allow transfer of tokens", async function () {
        await token.transfer(addr1.address, 50);
        expect(await token.balanceOf(addr1.address)).to.equal(50);
    });

    it("Should record transaction info correctly", async function () {
        const tx = await token.transfer(addr1.address, 50);
        const receipt = await tx.wait();

        const block = await ethers.provider.getBlock(receipt.blockNumber);

        const txHash = ethers.solidityPackedKeccak256(
            ["address", "address", "uint256", "uint256", "uint256"],
            [owner.address, addr1.address, 50, block.timestamp, receipt.blockNumber]
        );

        const transaction = await token.getTransactionInfo(txHash);

        expect(transaction[0]).to.equal(owner.address);
        expect(transaction[1]).to.equal(addr1.address);
        expect(transaction[2]).to.equal(50);
        expect(transaction[3]).to.equal(block.timestamp);
    });
});


describe("AstanaITUniversity_se2328 - Modified Version", function () {
    let Token, token, owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        Token = await ethers.getContractFactory("AstanaITUniversity_se2328");
        token = await Token.deploy(owner.address);
        await token.waitForDeployment();
    });

    it("Should initialize with specified owner", async function () {
        expect(await token.owner()).to.equal(owner.address);
    });

    it("Should allow transfers after initialization", async function () {
        await token.transfer(addr1.address, 100);
        expect(await token.balanceOf(addr1.address)).to.equal(100);
    });
});
