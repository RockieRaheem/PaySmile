const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("\n🌍 Adding Rwanda Projects to PaySmile...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Using account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "CELO\n");

  // Use deployed contract address
  const DONATION_POOL_ADDRESS = "0x2781bd8a4B2949b65395Befd032c09626BE98452";
  
  const DonationPool = await hre.ethers.getContractAt(
    "DonationPool",
    DONATION_POOL_ADDRESS
  );

  console.log("📦 Connected to DonationPool at:", DONATION_POOL_ADDRESS);

  // Rwanda projects
  const projects = [
    {
      name: "Emergency Food Relief - Bugesera",
      description: "3,500 families facing severe food shortage due to prolonged drought",
      recipient: deployer.address,
      fundingGoal: hre.ethers.parseEther("50"),
    },
    {
      name: "Flood Victims Shelter - Rubavu",
      description: "850 families displaced by Lake Kivu floods urgently need shelter",
      recipient: deployer.address,
      fundingGoal: hre.ethers.parseEther("85"),
    },
    {
      name: "Malaria Treatment - Nyagatare",
      description: "Over 2,100 children affected by malaria outbreak",
      recipient: deployer.address,
      fundingGoal: hre.ethers.parseEther("35"),
    },
  ];

  console.log("\n🚀 Creating projects...\n");

  for (let i = 0; i < projects.length; i++) {
    try {
      console.log(`Creating project ${i + 1}:`, projects[i].name);
      const tx = await DonationPool.createProject(
        projects[i].name,
        projects[i].description,
        projects[i].recipient,
        projects[i].fundingGoal
      );
      await tx.wait();
      console.log(`✅ Project ${i + 1} created!\n`);
    } catch (error) {
      console.log(`❌ Error creating project ${i + 1}:`, error.message);
    }
  }

  console.log("✅ Done!\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
