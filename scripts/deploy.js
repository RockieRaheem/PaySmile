const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying PaySmile contracts to Celo Alfajores...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "CELO");

  // Deploy DonationPool
  console.log("\n📦 Deploying DonationPool...");
  const DonationPool = await hre.ethers.getContractFactory("DonationPool");
  const donationPool = await DonationPool.deploy();
  await donationPool.waitForDeployment();
  const donationPoolAddress = await donationPool.getAddress();
  console.log("✅ DonationPool deployed to:", donationPoolAddress);

  // Deploy SmileBadgeNFT
  console.log("\n📦 Deploying SmileBadgeNFT...");
  const SmileBadgeNFT = await hre.ethers.getContractFactory("SmileBadgeNFT");
  const smileBadgeNFT = await SmileBadgeNFT.deploy();
  await smileBadgeNFT.waitForDeployment();
  const smileBadgeNFTAddress = await smileBadgeNFT.getAddress();
  console.log("✅ SmileBadgeNFT deployed to:", smileBadgeNFTAddress);

  // Create sample projects
  console.log("\n🌍 Creating sample community projects...");

  const projects = [
    {
      name: "Clean Water for Kampala",
      description: "Build boreholes in rural Kampala communities",
      recipient: deployer.address, // In production, use real project wallet
      fundingGoal: hre.ethers.parseEther("100"), // 100 CELO
    },
    {
      name: "School Supplies Drive",
      description: "Provide books and materials to underfunded schools",
      recipient: deployer.address,
      fundingGoal: hre.ethers.parseEther("50"), // 50 CELO
    },
    {
      name: "Tree Planting Initiative",
      description: "Plant 1000 trees across Uganda",
      recipient: deployer.address,
      fundingGoal: hre.ethers.parseEther("75"), // 75 CELO
    },
  ];

  for (let i = 0; i < projects.length; i++) {
    const tx = await donationPool.createProject(
      projects[i].name,
      projects[i].description,
      projects[i].recipient,
      projects[i].fundingGoal
    );
    await tx.wait();
    console.log(`✅ Created project ${i}: ${projects[i].name}`);
  }

  // Save deployment info
  const deployment = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      DonationPool: {
        address: donationPoolAddress,
        explorerUrl: `https://alfajores.celoscan.io/address/${donationPoolAddress}`,
      },
      SmileBadgeNFT: {
        address: smileBadgeNFTAddress,
        explorerUrl: `https://alfajores.celoscan.io/address/${smileBadgeNFTAddress}`,
      },
    },
  };

  console.log("\n📋 Deployment Summary:");
  console.log(JSON.stringify(deployment, null, 2));

  // Save to file
  const fs = require("fs");
  const deploymentPath = `./deployments/${hre.network.name}-deployment.json`;

  // Create deployments directory if it doesn't exist
  if (!fs.existsSync("./deployments")) {
    fs.mkdirSync("./deployments");
  }

  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  console.log(`\n💾 Deployment info saved to: ${deploymentPath}`);

  console.log("\n🎉 Deployment complete!");
  console.log("\n⏭️  Next steps:");
  console.log("1. Update your .env file with contract addresses");
  console.log("2. Verify contracts on Celoscan (optional)");
  console.log("3. Update frontend configuration");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
