const hre = require("hardhat");
const { ethers } = require("hardhat");
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log("\n🎮 PaySmile Interactive Testing Console");
  console.log("═══════════════════════════════════════════════════════════════\n");

  const donationPoolAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const smileBadgeNFTAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const [owner, donor1, donor2] = await ethers.getSigners();

  console.log("💰 Your Test Accounts (All have 10,000 ETH!):");
  console.log(`   Account 1: ${owner.address}`);
  console.log(`   Account 2: ${donor1.address}`);
  console.log(`   Account 3: ${donor2.address}\n`);

  const DonationPool = await ethers.getContractFactory("DonationPool");
  const donationPool = DonationPool.attach(donationPoolAddress);

  const SmileBadgeNFT = await ethers.getContractFactory("SmileBadgeNFT");
  const smileBadgeNFT = SmileBadgeNFT.attach(smileBadgeNFTAddress);

  while (true) {
    console.log("\n╔════════════════════════════════════════════════════════════╗");
    console.log("║                     MAIN MENU                              ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    console.log("1. 📋 View All Projects");
    console.log("2. 🗳️  Vote for a Project");
    console.log("3. 💰 Donate to a Project");
    console.log("4. 📊 View My Donations");
    console.log("5. 🎖️  View My NFT Badges");
    console.log("6. 💳 Check Account Balances");
    console.log("7. 🚪 Exit");
    console.log("");

    const choice = await question("Choose an option (1-7): ");

    switch(choice.trim()) {
      case '1':
        await viewProjects(donationPool);
        break;
      case '2':
        await voteForProject(donationPool, owner, donor1, donor2);
        break;
      case '3':
        await donateToProject(donationPool, owner, donor1, donor2);
        break;
      case '4':
        await viewMyDonations(donationPool, owner, donor1, donor2);
        break;
      case '5':
        await viewMyBadges(smileBadgeNFT, owner, donor1, donor2);
        break;
      case '6':
        await checkBalances(owner, donor1, donor2);
        break;
      case '7':
        console.log("\n👋 Thanks for testing PaySmile! Goodbye!\n");
        rl.close();
        process.exit(0);
      default:
        console.log("\n❌ Invalid option. Please choose 1-7.");
    }
  }
}

async function viewProjects(donationPool) {
  console.log("\n📋 ALL PROJECTS");
  console.log("═══════════════════════════════════════════════════════════════");
  
  const projectCount = await donationPool.projectCounter();
  for (let i = 0; i < projectCount; i++) {
    const project = await donationPool.projects(i);
    console.log(`\n🎯 Project #${i}: ${project.name}`);
    console.log(`   Description: ${project.description}`);
    console.log(`   Goal: ${ethers.formatEther(project.fundingGoal)} ETH`);
    console.log(`   Current Funding: ${ethers.formatEther(project.currentFunding)} ETH`);
    console.log(`   Votes: ${project.votesReceived}`);
    console.log(`   Active: ${project.isActive ? '✅' : '❌'}`);
  }
}

async function voteForProject(donationPool, owner, donor1, donor2) {
  console.log("\n🗳️  VOTE FOR A PROJECT");
  console.log("═══════════════════════════════════════════════════════════════");
  
  const projectCount = await donationPool.projectCounter();
  console.log(`\nAvailable projects: 0 to ${projectCount - 1}`);
  
  const projectId = await question("Enter project ID to vote for: ");
  const accountChoice = await question("Vote from which account? (1/2/3): ");
  
  let signer;
  switch(accountChoice.trim()) {
    case '1': signer = owner; break;
    case '2': signer = donor1; break;
    case '3': signer = donor2; break;
    default:
      console.log("❌ Invalid account choice.");
      return;
  }

  try {
    console.log("\n⏳ Casting vote...");
    const tx = await donationPool.connect(signer).voteForProject(parseInt(projectId));
    await tx.wait();
    
    const project = await donationPool.projects(parseInt(projectId));
    console.log(`\n✅ Vote successful!`);
    console.log(`   Project "${project.name}" now has ${project.votesReceived} votes!`);
  } catch (error) {
    console.log(`\n❌ Vote failed: ${error.message}`);
  }
}

async function donateToProject(donationPool, owner, donor1, donor2) {
  console.log("\n💰 DONATE TO A PROJECT");
  console.log("═══════════════════════════════════════════════════════════════");
  
  const projectCount = await donationPool.projectCounter();
  console.log(`\nAvailable projects: 0 to ${projectCount - 1}`);
  
  const projectId = await question("Enter project ID to donate to: ");
  const amount = await question("Enter amount in ETH (e.g., 0.1): ");
  const accountChoice = await question("Donate from which account? (1/2/3): ");
  
  let signer;
  switch(accountChoice.trim()) {
    case '1': signer = owner; break;
    case '2': signer = donor1; break;
    case '3': signer = donor2; break;
    default:
      console.log("❌ Invalid account choice.");
      return;
  }

  try {
    console.log("\n⏳ Processing donation...");
    const tx = await donationPool.connect(signer).donate(parseInt(projectId), {
      value: ethers.parseEther(amount)
    });
    await tx.wait();
    
    const project = await donationPool.projects(parseInt(projectId));
    console.log(`\n✅ Donation successful!`);
    console.log(`   Donated ${amount} ETH to "${project.name}"`);
    console.log(`   Project now has ${ethers.formatEther(project.currentFunding)} ETH`);
  } catch (error) {
    console.log(`\n❌ Donation failed: ${error.message}`);
  }
}

async function viewMyDonations(donationPool, owner, donor1, donor2) {
  console.log("\n📊 YOUR DONATIONS");
  console.log("═══════════════════════════════════════════════════════════════");
  
  const accountChoice = await question("Check which account? (1/2/3): ");
  
  let address;
  switch(accountChoice.trim()) {
    case '1': address = owner.address; break;
    case '2': address = donor1.address; break;
    case '3': address = donor2.address; break;
    default:
      console.log("❌ Invalid account choice.");
      return;
  }

  const totalDonated = await donationPool.totalDonationsByDonor(address);
  console.log(`\n💰 Total donated from this account: ${ethers.formatEther(totalDonated)} ETH`);
  
  const projectCount = await donationPool.projectCounter();
  console.log("\nBreakdown by project:");
  for (let i = 0; i < projectCount; i++) {
    const contributed = await donationPool.donorProjectContributions(address, i);
    if (contributed > 0n) {
      const project = await donationPool.projects(i);
      console.log(`   • ${project.name}: ${ethers.formatEther(contributed)} ETH`);
    }
  }
}

async function viewMyBadges(smileBadgeNFT, owner, donor1, donor2) {
  console.log("\n🎖️  YOUR NFT BADGES");
  console.log("═══════════════════════════════════════════════════════════════");
  
  const accountChoice = await question("Check which account? (1/2/3): ");
  
  let address;
  switch(accountChoice.trim()) {
    case '1': address = owner.address; break;
    case '2': address = donor1.address; break;
    case '3': address = donor2.address; break;
    default:
      console.log("❌ Invalid account choice.");
      return;
  }

  const balance = await smileBadgeNFT.balanceOf(address);
  console.log(`\n🏆 You have ${balance} NFT badge(s)!`);
  
  if (balance > 0) {
    for (let i = 0; i < balance; i++) {
      const tokenId = await smileBadgeNFT.tokenOfOwnerByIndex(address, i);
      console.log(`   • Badge #${tokenId}`);
    }
  } else {
    console.log("   (Make some donations to earn badges!)");
  }
}

async function checkBalances(owner, donor1, donor2) {
  console.log("\n💳 ACCOUNT BALANCES");
  console.log("═══════════════════════════════════════════════════════════════");
  
  const balance1 = await ethers.provider.getBalance(owner.address);
  const balance2 = await ethers.provider.getBalance(donor1.address);
  const balance3 = await ethers.provider.getBalance(donor2.address);
  
  console.log(`\n💰 Account 1 (${owner.address}):`);
  console.log(`   ${ethers.formatEther(balance1)} ETH`);
  
  console.log(`\n💰 Account 2 (${donor1.address}):`);
  console.log(`   ${ethers.formatEther(balance2)} ETH`);
  
  console.log(`\n💰 Account 3 (${donor2.address}):`);
  console.log(`   ${ethers.formatEther(balance3)} ETH`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
