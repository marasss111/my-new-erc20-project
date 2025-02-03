const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AstanaITUniversity_se2328 Token", function () {
  let Token, token, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Token = await ethers.getContractFactory("AstanaITUniversity_se2328");
    token = await Token.deploy();
  });

  it("Should deploy with correct initial supply", async function () {
    const totalSupply = await token.totalSupply();
    expect(totalSupply).to.equal(2000n * 10n ** 18n);
  });

  it("Should transfer tokens successfully", async function () {
    await token.transfer(addr1.address, 100n * 10n ** 18n);
    expect(await token.balanceOf(addr1.address)).to.equal(100n * 10n ** 18n);

    const recentTransfer = await token.getRecentTransfer();
    expect(recentTransfer[0]).to.equal(owner.address);
    expect(recentTransfer[1]).to.equal(addr1.address);
    expect(recentTransfer[2]).to.equal(100n * 10n ** 18n);
  });

  it("Should approve and transferFrom tokens successfully", async function () {
    await token.approve(addr1.address, 50n * 10n ** 18n);
    await token.connect(addr1).transferFrom(owner.address, addr2.address, 50n * 10n ** 18n);

    expect(await token.balanceOf(addr2.address)).to.equal(50n * 10n ** 18n);

    const recentTransfer = await token.getRecentTransfer();
    expect(recentTransfer[0]).to.equal(owner.address);
    expect(recentTransfer[1]).to.equal(addr2.address);
    expect(recentTransfer[2]).to.equal(50n * 10n ** 18n);
  });

  it("Should return correct transfer details", async function () {
    await token.transfer(addr1.address, 100n * 10n ** 18n);

    expect(await token.getTransferSender()).to.equal(owner.address);
    expect(await token.getTransferReceiver()).to.equal(addr1.address);
    expect(BigInt(await token.getTransferTimestamp())).to.be.a("bigint");
  });

  it("Should not transfer if sender does not have enough balance", async function () {
    await expect(
        token.connect(addr1).transfer(addr2.address, 500n * 10n ** 18n)
    ).to.be.reverted;
  });
});
