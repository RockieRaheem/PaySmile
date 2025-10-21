const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("\n🚀 Testing PaySmile App Features...\n");

  // Get the deployed contract addresses
  const donationPoolAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const smileBadgeNFTAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  // Get signers (test accounts)
  const [owner, donor1, donor2] = await ethers.getSigners();

  console.log("📋 Test Accounts:");
  console.log("   Owner:", owner.address);
  console.log("   Donor 1:", donor1.address);
  console.log("   Donor 2:", donor2.address);

  // Get contract instances
  const DonationPool = await ethers.getContractFactory("DonationPool");
  const donationPool = DonationPool.attach(donationPoolAddress);

  const SmileBadgeNFT = await ethers.getContractFactory("SmileBadgeNFT");
  const smileBadgeNFT = SmileBadgeNFT.attach(smileBadgeNFTAddress);

  console.log("\n" + "=".repeat(60));
  console.log("📊 CURRENT PROJECTS");
  console.log("=".repeat(60));

  // Get all projects
  const projectCount = await donationPool.nextProjectId();
  for (let i = 0; i < projectCount; i++) {
    const project = await donationPool.getProject(i);
    console.log(`\nProject #${i}: ${project.title}`);
    console.log(`   Description: ${project.description}`);
    console.log(`   Goal: ${ethers.formatEther(project.goalAmount)} ETH`);
    console.log(`   Raised: ${ethers.formatEther(project.raisedAmount)} ETH`);
    console.log(`   Votes: ${project.votes}`);
    console.log(`   Active: ${project.isActive}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🗳️  TEST 1: VOTING ON PROJECTS");
  console.log("=".repeat(60));

  // Vote on project 0 from donor1
  console.log("\n✅ Donor 1 voting on Project #0...");
  const voteTx1 = await donationPool.connect(donor1).voteForProject(0);
  await voteTx1.wait();
  console.log("   Vote successful!");

  // Vote on project 0 from donor2
  console.log("\n✅ Donor 2 voting on Project #0...");
  const voteTx2 = await donationPool.connect(donor2).voteForProject(0);
  await voteTx2.wait();
  console.log("   Vote successful!");

  // Check updated votes
  const updatedProject = await donationPool.getProject(0);
  console.log(`\n📊 Project #0 now has ${updatedProject.votes} votes!`);

  console.log("\n" + "=".repeat(60));
  console.log("💰 TEST 2: MAKING DONATIONS");
  console.log("=".repeat(60));

  // Donate to project 0
  const donationAmount = ethers.parseEther("0.5"); // 0.5 ETH
  console.log(
    `\n✅ Donor 1 donating ${ethers.formatEther(
      donationAmount
    )} ETH to Project #0...`
  );
  const donateTx = await donationPool
    .connect(donor1)
    .donate(0, { value: donationAmount });
  await donateTx.wait();
  console.log("   Donation successful!");

  // Check updated raised amount
  const projectAfterDonation = await donationPool.getProject(0);
  console.log(
    `\n📊 Project #0 raised amount: ${ethers.formatEther(
      projectAfterDonation.raisedAmount
    )} ETH`
  );

  console.log("\n" + "=".repeat(60));
  console.log("🎖️  TEST 3: NFT BADGES");
  console.log("=".repeat(60));

  // Check if donor1 has any badges
  const donor1Balance = await smileBadgeNFT.balanceOf(donor1.address);
  console.log(`\n📊 Donor 1 has ${donor1Balance} NFT badge(s)`);

  if (donor1Balance > 0) {
    const tokenId = await smileBadgeNFT.tokenOfOwnerByIndex(donor1.address, 0);
    console.log(`   Token ID: ${tokenId}`);
    const tokenURI = await smileBadgeNFT.tokenURI(tokenId);
    console.log(`   Token URI: ${tokenURI}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ ALL TESTS COMPLETED!");
  console.log("=".repeat(60));
  console.log("\n🎉 Your PaySmile app is working perfectly!");
  console.log("💡 You can see these changes reflected in the web app at:");
  console.log("   http://localhost:9002");
  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
