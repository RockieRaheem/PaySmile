/**
 * Create a new wallet for PaySmile - Sepolia testnet
 * This generates a fresh address that hasn't hit faucet rate limits
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔐 Creating new PaySmile wallet...\n");

  // Generate a random wallet
  const wallet = hre.ethers.Wallet.createRandom();

  console.log("✅ New wallet created successfully!\n");
  console.log("=".repeat(60));
  console.log("📍 ADDRESS:", wallet.address);
  console.log("🔑 PRIVATE KEY:", wallet.privateKey);
  console.log("🌱 MNEMONIC:", wallet.mnemonic.phrase);
  console.log("=".repeat(60));

  // Save to a secure file
  const walletInfo = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
    createdAt: new Date().toISOString(),
    network: "Sepolia Testnet",
  };

  const walletPath = path.join(__dirname, "..", ".new-wallet-info.json");
  fs.writeFileSync(walletPath, JSON.stringify(walletInfo, null, 2));

  console.log(`\n💾 Wallet info saved to: .new-wallet-info.json`);
  console.log("\n⚠️  IMPORTANT SECURITY NOTES:");
  console.log("   1. NEVER share your private key or mnemonic with anyone");
  console.log("   2. This is a TEST wallet for Sepolia only");
  console.log("   3. Do NOT send real funds to this address on mainnet");
  console.log("\n📋 NEXT STEPS:");
  console.log("   1. Copy the ADDRESS above");
  console.log("   2. Import to MetaMask:");
  console.log("      - Click MetaMask icon → Settings → Networks");
  console.log("      - Select 'Import account'");
  console.log("      - Paste the PRIVATE KEY above");
  console.log("   3. Get test CELO:");
  console.log(
    "      - Visit a Sepolia faucet, e.g.: https://sepoliafaucet.com/ or https://faucet.sepolia.dev/"
  );
  console.log("      - Paste your new ADDRESS");
  console.log("      - Click 'Get CELO'");
  console.log("   4. Verify balance:");
  console.log(`      - https://sepolia.etherscan.io/address/${wallet.address}`);
  console.log("\n🎯 Once funded, update .env with:");
  console.log(`   PRIVATE_KEY=${wallet.privateKey}`);
  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
