const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AstanaITUniversity_se2328", function () {
  let Token, token;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Token = await ethers.getContractFactory("AstanaITUniversity_se2328");
    token = await Token.deploy();
    await token.waitForDeployment();
  });

  it("should transfer tokens and store transaction info", async function () {
    const tx = await token.transfer(addr1.address, 100);
    const receipt = await tx.wait();
    const blockNumber = receipt.blockNumber;
    const blockData = await ethers.provider.getBlock(blockNumber);
    const blockTimestamp = blockData.timestamp;

    const txHash = ethers.solidityPackedKeccak256(
      ["address", "address", "uint256", "uint256", "uint256"],
      [owner.address, addr1.address, 100, blockTimestamp, blockNumber]
    );

    const transactionInfo = await token.getTransactionInfo(txHash);
    console.log("Transaction Info:", transactionInfo);

    const [sender, receiver, amount, timestamp] = transactionInfo;
    expect(sender).to.equal(owner.address);
    expect(receiver).to.equal(addr1.address);
    expect(amount).to.equal(100);
    expect(timestamp).to.equal(blockTimestamp);

    const savedSender = await token.getSender(txHash);
    const savedReceiver = await token.getReceiver(txHash);
    expect(savedSender).to.equal(owner.address);
    expect(savedReceiver).to.equal(addr1.address);


    const humanReadableJS = convertTimestampToReadable(blockTimestamp);
    console.log("Human-readable Timestamp (GMT 0):", humanReadableJS);
  });

  function convertTimestampToReadable(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); 
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
});