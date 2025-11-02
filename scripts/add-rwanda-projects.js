/**
 * Script to add 4 real Rwanda crisis projects to the DonationPool contract
 * Run: npx hardhat run scripts/add-rwanda-projects.js --network sepolia
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
    fundingGoal: parseEther("50"), // $50 worth of CELO - realistic for emergency relief
    category: "Emergency Relief",
    location: "Bugesera District, Rwanda",
  },
  {
    name: "Flood Victims Shelter - Rubavu",
    description:
      "850 families displaced by Lake Kivu floods urgently need temporary shelter and essential supplies to rebuild their lives.",
    recipient: process.env.PROJECT_RECIPIENT_ADDRESS || "",
    fundingGoal: parseEther("85"), // $85 worth of CELO - shelter materials
    category: "Disaster Relief",
    location: "Rubavu District, Rwanda",
  },
  {
    name: "Malaria Treatment - Nyagatare",
    description:
      "Over 2,100 children affected by malaria outbreak. Critical need for mosquito nets, testing kits, and treatment supplies.",
    recipient: process.env.PROJECT_RECIPIENT_ADDRESS || "",
    fundingGoal: parseEther("35"), // $35 worth of CELO - medical supplies
    category: "Healthcare",
    location: "Nyagatare District, Rwanda",
  },
  {
    name: "Maternal Health Crisis - Gicumbi",
    description:
      "600+ pregnant women at risk due to ambulance and medical equipment shortage. Lives depend on immediate healthcare support.",
    recipient: process.env.PROJECT_RECIPIENT_ADDRESS || "",
    fundingGoal: parseEther("45"), // $45 worth of CELO - medical equipment
    category: "Healthcare",
    location: "Gicumbi District, Rwanda",
  },
];

async function main() {
  console.log("🇷🇼 Adding Rwanda Crisis Projects to DonationPool...\n");

  // Get contract address from environment (.env.local or .env)
  const donationPoolAddress =
    process.env.NEXT_PUBLIC_DONATION_POOL_ADDRESS ||
    "0xE469dccD949591d120466A5F34E36Dfe4335F625";

  if (!donationPoolAddress) {
    throw new Error(
      "❌ NEXT_PUBLIC_DONATION_POOL_ADDRESS not found in environment"
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
      `Funding Goal: ${hre.ethers.formatEther(project.fundingGoal)} ETH`
    );
    console.log(`Recipient: ${recipientAddress}`);
    console.log(`Description: ${project.description.substring(0, 80)}...`);

    try {
      // Create project on blockchain with high gas to ensure fast confirmation
      const tx = await DonationPool.createProject(
        project.name,
        project.description,
        recipientAddress,
        project.fundingGoal,
        {
          gasLimit: 300000,
          maxPriorityFeePerGas: hre.ethers.parseUnits("10", "gwei"),
          maxFeePerGas: hre.ethers.parseUnits("100", "gwei"),
        }
      );

      console.log(`\n⏳ Tx: ${tx.hash}`);

      const receipt = await tx.wait(1);
      console.log(`✅ Block ${receipt.blockNumber}`);

      // Quick verification - get project ID from event
      const iface = DonationPool.interface;
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed && parsed.name === "ProjectCreated") {
            console.log(`🎉 Project ID: ${parsed.args[0].toString()}`);
            break;
          }
        } catch (e) {
          // skip unparseable logs
        }
      }
    } catch (error) {
      console.error(`\n❌ Error: ${error.message}`);
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
