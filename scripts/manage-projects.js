const hre = require("hardhat");
require("dotenv").config({ path: ".env.local" });

async function main() {
  const donationPoolAddress = process.env.NEXT_PUBLIC_DONATION_POOL_ADDRESS;

  if (!donationPoolAddress) {
    console.error(
      "❌ NEXT_PUBLIC_DONATION_POOL_ADDRESS not found in .env.local"
    );
    process.exit(1);
  }

  console.log(`\n📍 DonationPool: ${donationPoolAddress}\n`);

  const DonationPool = await hre.ethers.getContractAt(
    "DonationPool",
    donationPoolAddress
  );

  const count = await DonationPool.getProjectCount();
  console.log(`📊 Total Projects: ${count}\n`);

  const projects = [];
  for (let i = 0; i < count; i++) {
    const project = await DonationPool.getProject(i);
    projects.push({
      id: i,
      name: project.name,
      description: project.description,
      fundingGoal: hre.ethers.formatEther(project.fundingGoal),
      currentFunding: hre.ethers.formatEther(project.currentFunding),
      isActive: project.isActive,
      votes: project.votesReceived.toString(),
    });

    console.log(`Project ${i}:`);
    console.log(`  Name: ${project.name}`);
    console.log(`  Description: ${project.description}`);
    console.log(
      `  Funding: ${hre.ethers.formatEther(
        project.currentFunding
      )} / ${hre.ethers.formatEther(project.fundingGoal)} CELO`
    );
    console.log(`  Active: ${project.isActive}`);
    console.log(`  Votes: ${project.votesReceived}\n`);
  }

  // Find duplicates by name
  const nameCount = {};
  projects.forEach((p) => {
    nameCount[p.name] = (nameCount[p.name] || 0) + 1;
  });

  const duplicates = Object.entries(nameCount)
    .filter(([name, count]) => count > 1)
    .map(([name]) => name);

  if (duplicates.length > 0) {
    console.log("\n⚠️  DUPLICATE PROJECTS FOUND:");
    duplicates.forEach((name) => {
      const dupes = projects.filter((p) => p.name === name);
      console.log(`\n"${name}" appears ${dupes.length} times:`);
      dupes.forEach((p) => {
        console.log(`  - Project ID ${p.id} (Active: ${p.isActive})`);
      });
    });

    console.log(
      "\n💡 To deactivate duplicates, uncomment the deactivation code below"
    );
    console.log("   and run this script again.");
  }

  // DEACTIVATE DUPLICATE PROJECTS ONLY
  const projectsToDeactivate = [4, 5]; // Emergency Food duplicate, Flood Victims duplicate

  console.log("\n🔧 Deactivating duplicate projects...");
  for (const projectId of projectsToDeactivate) {
    const project = projects[projectId];
    console.log(`Deactivating project ${projectId}: "${project.name}"...`);
    const tx = await DonationPool.toggleProjectStatus(projectId);
    await tx.wait();
    console.log(`✅ Project ${projectId} deactivated`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
