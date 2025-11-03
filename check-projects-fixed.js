const hre = require("hardhat");

async function main() {
  console.log("\n🔍 Checking projects on deployed contract...\n");

  const DONATION_POOL_ADDRESS = "0x2781bd8a4B2949b65395Befd032c09626BE98452";
  
  const DonationPool = await hre.ethers.getContractAt(
    "DonationPool",
    DONATION_POOL_ADDRESS
  );

  // Try calling getProject with incrementing IDs until we get an error
  let projectCount = 0;
  for (let i = 0; i < 10; i++) {
    try {
      const project = await DonationPool.getProject(i);
      console.log(`\n📋 Project ${i}:`);
      console.log("   Name:", project.name);
      console.log("   Description:", project.description.substring(0, 60) + "...");
      console.log("   Goal:", hre.ethers.formatEther(project.fundingGoal), "CELO");
      console.log("   Raised:", hre.ethers.formatEther(project.totalFunding), "CELO");
      console.log("   Active:", project.isActive);
      projectCount++;
    } catch (error) {
      break;
    }
  }
  
  console.log(`\n✅ Total projects found: ${projectCount}\n`);
}

main().catch(console.error);
