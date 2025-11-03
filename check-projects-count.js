const hre = require("hardhat");

async function main() {
  console.log("\n🔍 Checking projects on deployed contract...\n");

  const DONATION_POOL_ADDRESS = "0x2781bd8a4B2949b65395Befd032c09626BE98452";
  
  const DonationPool = await hre.ethers.getContractAt(
    "DonationPool",
    DONATION_POOL_ADDRESS
  );

  const projectCount = await DonationPool.projectCount();
  console.log("📊 Total projects:", projectCount.toString());

  for (let i = 0; i < projectCount; i++) {
    const project = await DonationPool.getProject(i);
    console.log(`\n📋 Project ${i}:`);
    console.log("   Name:", project.name);
    console.log("   Description:", project.description);
    console.log("   Goal:", hre.ethers.formatEther(project.fundingGoal), "CELO");
    console.log("   Raised:", hre.ethers.formatEther(project.totalFunding), "CELO");
  }
}

main().catch(console.error);
