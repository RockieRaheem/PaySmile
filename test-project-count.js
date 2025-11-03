const hre = require("hardhat");

async function main() {
  console.log("\n🔍 Testing getProjectCount...\n");

  const DONATION_POOL_ADDRESS = "0x2781bd8a4B2949b65395Befd032c09626BE98452";
  
  const DonationPool = await hre.ethers.getContractAt(
    "DonationPool",
    DONATION_POOL_ADDRESS
  );

  try {
    const count = await DonationPool.getProjectCount();
    console.log("✅ Project count:", count.toString());
    
    // Try to get each project
    for (let i = 0; i < count; i++) {
      const project = await DonationPool.getProject(i);
      console.log(`\n📋 Project ${i}:`);
      console.log("   Name:", project.name);
      console.log("   Goal:", hre.ethers.formatEther(project.fundingGoal), "CELO");
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

main().catch(console.error);
