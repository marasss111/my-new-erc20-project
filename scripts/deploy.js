async function main() {
    const [deployer] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("AstanaITUniversity_se2328");
    const token = await Token.deploy();  
    await token.waitForDeployment();    
  
    const contractAddress = await token.getAddress(); 
    console.log("Token deployed to:", contractAddress);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });