const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const networkName = hre.network.name;
  console.log(`\n🔍 Checking balance on ${networkName}...\n`);

  // Get wallet info
  const walletInfoPath = ".wallet-info.json";
  let address;

  if (fs.existsSync(walletInfoPath)) {
    const walletInfo = JSON.parse(fs.readFileSync(walletInfoPath, "utf8"));
    address = walletInfo.address;
  } else {
    const [signer] = await ethers.getSigners();
    address = await signer.getAddress();
  }

  console.log("📍 Wallet Address:", address);

  // Get balance
  const balance = await ethers.provider.getBalance(address);
  const balanceInCelo = ethers.formatEther(balance);

  console.log(
    "💰 Balance:",
    balanceInCelo,
    networkName === "sepolia" ? "ETH" : "ETH"
  );

  if (networkName === "sepolia") {
    console.log(
      "🔗 Explorer:",
      `https://sepolia.etherscan.io/address/${address}`
    );
  }

  // Check if balance is sufficient
  if (parseFloat(balanceInCelo) < 0.1) {
    console.log("\n❌ Insufficient balance!");
    console.log("   You need at least 0.1 ETH to deploy contracts.");
    console.log("\n📝 To get free test tokens:");
    console.log("   🔗 https://sepoliafaucet.com/");
    console.log(`   📍 Use address: ${address}\n`);
  } else {
    console.log("\n✅ Balance sufficient for deployment!");
    console.log("   You can now deploy contracts:\n");
    console.log(
      `   npx hardhat run scripts/deploy.js --network ${networkName}\n`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
