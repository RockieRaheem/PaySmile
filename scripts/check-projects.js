const hre = require("hardhat");

async function main() {
  const donationPoolAddress =
    process.env.NEXT_PUBLIC_DONATION_POOL_ADDRESS ||
    "0xE469dccD949591d120466A5F34E36Dfe4335F625";

  console.log(`\n📍 DonationPool: ${donationPoolAddress}\n`);

  const DonationPool = await hre.ethers.getContractAt(
    "DonationPool",
    donationPoolAddress
  );
  const count = await DonationPool.getProjectCount();

  console.log(`📊 Total Projects: ${count}\n`);

  for (let i = 0; i < count; i++) {
    const project = await DonationPool.getProject(i);
    console.log(`Project ${i}:`);
    console.log(`  Name: ${project.name}`);
    console.log(
      `  Funding: ${hre.ethers.formatEther(
        project.currentFunding
      )} / ${hre.ethers.formatEther(project.fundingGoal)} CELO`
    );
    console.log(`  Active: ${project.isActive}`);
    console.log(`  Votes: ${project.votesReceived}\n`);
  }
}

main().catch(console.error);
