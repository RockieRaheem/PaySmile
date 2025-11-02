/**
 * Script to add 4 real Rwanda crisis projects to the DonationPool contract
 * Run: npx hardhat run scripts/add-rwanda-projects.js --network alfajores
 */

const hre = require("hardhat");
const { parseEther } = require("viem");

// Rwanda crisis projects data (synced with USSD backend and frontend)
const RWANDA_PROJECTS = [
  {
    name: "Emergency Food Relief - Bugesera",
    description:
      "3,500 families facing severe food shortage due to prolonged drought in Bugesera District. Immediate food aid needed for survival.",
    recipient: process.env.PROJECT_RECIPIENT_ADDRESS || "", // Will use deployer address if not set
    fundingGoal: parseEther("0.05"), // 50,000 RWF ≈ 0.05 CELO (1 CELO ≈ 1M RWF for demo)
    category: "Emergency Relief",
    location: "Bugesera District, Rwanda",
  },
  {
    name: "Flood Victims Shelter - Rubavu",
    description:
      "850 families displaced by Lake Kivu floods urgently need temporary shelter and essential supplies to rebuild their lives.",
    recipient: process.env.PROJECT_RECIPIENT_ADDRESS || "",
    fundingGoal: parseEther("0.085"), // 85,000 RWF ≈ 0.085 CELO
    category: "Disaster Relief",
    location: "Rubavu District, Rwanda",
  },
  {
    name: "Malaria Treatment - Nyagatare",
    description:
      "Over 2,100 children affected by malaria outbreak. Critical need for mosquito nets, testing kits, and treatment supplies.",
    recipient: process.env.PROJECT_RECIPIENT_ADDRESS || "",
    fundingGoal: parseEther("0.035"), // 35,000 RWF ≈ 0.035 CELO
    category: "Healthcare",
    location: "Nyagatare District, Rwanda",
  },
  {
    name: "Maternal Health Crisis - Gicumbi",
    description:
      "600+ pregnant women at risk due to ambulance and medical equipment shortage. Lives depend on immediate healthcare support.",
    recipient: process.env.PROJECT_RECIPIENT_ADDRESS || "",
    fundingGoal: parseEther("0.045"), // 45,000 RWF ≈ 0.045 CELO
    category: "Healthcare",
    location: "Gicumbi District, Rwanda",
  },
];

async function main() {
  console.log("🇷🇼 Adding Rwanda Crisis Projects to DonationPool...\n");

  // Get contract address from environment
  const donationPoolAddress = process.env.NEXT_PUBLIC_DONATION_POOL_ADDRESS;

  if (!donationPoolAddress) {
    throw new Error(
      "❌ NEXT_PUBLIC_DONATION_POOL_ADDRESS not found in .env.local"
    );
  }

  console.log(`📍 DonationPool Address: ${donationPoolAddress}\n`);

  // Get the contract instance
  const DonationPool = await hre.ethers.getContractAt(
    "DonationPool",
    donationPoolAddress
  );

  // Get signer (deployer/owner)
  const [signer] = await hre.ethers.getSigners();
  console.log(`👤 Using account: ${signer.address}\n`);

  // Check if signer is the owner
  const owner = await DonationPool.owner();
  if (owner.toLowerCase() !== signer.address.toLowerCase()) {
    throw new Error(
      `❌ Signer ${signer.address} is not the contract owner (${owner})`
    );
  }

  console.log("✅ Signer is contract owner. Proceeding...\n");

  // Get current project count
  const currentCount = await DonationPool.getProjectCount();
  console.log(`📊 Current project count: ${currentCount}\n`);

  // Add each project
  for (let i = 0; i < RWANDA_PROJECTS.length; i++) {
    const project = RWANDA_PROJECTS[i];
    const recipientAddress = project.recipient || signer.address; // Use deployer if not set

    console.log(`\n${"=".repeat(60)}`);
    console.log(`📝 Creating Project ${i + 1}/${RWANDA_PROJECTS.length}`);
    console.log(`${"=".repeat(60)}`);
    console.log(`Name: ${project.name}`);
    console.log(`Location: ${project.location}`);
    console.log(`Category: ${project.category}`);
    console.log(
      `Funding Goal: ${hre.ethers.formatEther(project.fundingGoal)} CELO`
    );
    console.log(`Recipient: ${recipientAddress}`);
    console.log(`Description: ${project.description.substring(0, 80)}...`);

    try {
      // Create project on blockchain
      const tx = await DonationPool.createProject(
        project.name,
        project.description,
        recipientAddress,
        project.fundingGoal
      );

      console.log(`\n⏳ Transaction submitted: ${tx.hash}`);
      console.log(`⏳ Waiting for confirmation...`);

      const receipt = await tx.wait();
      console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);

      // Get the project ID from the event
      const projectCreatedEvent = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "ProjectCreated"
      );

      if (projectCreatedEvent) {
        const projectId = projectCreatedEvent.args[0];
        console.log(`🎉 Project ID: ${projectId.toString()}`);

        // Verify the project was created
        const projectData = await DonationPool.getProject(projectId);
        console.log(`\n📋 Verification:`);
        console.log(`   - Name: ${projectData.name}`);
        console.log(
          `   - Funding Goal: ${hre.ethers.formatEther(
            projectData.fundingGoal
          )} CELO`
        );
        console.log(`   - Is Active: ${projectData.isActive}`);
        console.log(`   - Current Funding: ${projectData.currentFunding}`);
      }
    } catch (error) {
      console.error(`\n❌ Error creating project: ${error.message}`);
      throw error;
    }
  }

  // Final summary
  const finalCount = await DonationPool.getProjectCount();
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🎉 SUCCESS! All Rwanda projects added!`);
  console.log(`${"=".repeat(60)}`);
  console.log(`📊 Projects before: ${currentCount}`);
  console.log(`📊 Projects after: ${finalCount}`);
  console.log(`📊 Projects added: ${finalCount - currentCount}`);
  console.log(`\n✅ Projects are now live on the blockchain!`);
  console.log(
    `✅ Users can donate via USSD (*384*400004#) or Web App (PaySmile)`
  );
  console.log(`✅ All donations are tracked on-chain for transparency`);
  console.log(`\n🌍 Let's help Rwanda together! 🇷🇼\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
