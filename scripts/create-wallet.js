const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n🔐 Creating a new Sepolia testnet wallet...\n");

  // Create a random wallet
  const wallet = ethers.Wallet.createRandom();

  console.log("═══════════════════════════════════════════════════════════");
  console.log("✅ NEW WALLET CREATED!");
  console.log("═══════════════════════════════════════════════════════════\n");
  console.log("📍 Address:", wallet.address);
  console.log("🔑 Private Key:", wallet.privateKey);
  console.log("\n⚠️  IMPORTANT: Save these credentials securely!");
  console.log("   This is a TESTNET wallet for development only.\n");

  console.log("═══════════════════════════════════════════════════════════");
  console.log("📋 NEXT STEPS:");
  console.log("═══════════════════════════════════════════════════════════\n");
  console.log("1️⃣  Save your private key to .env file:");
  console.log(`   echo "PRIVATE_KEY=${wallet.privateKey}" >> .env\n`);

  console.log("2️⃣  Get FREE test ETH tokens from a Sepolia faucet:");
  console.log("   🔗 https://sepoliafaucet.com/");
  console.log(`   📍 Use this address: ${wallet.address}\n`);

  console.log(
    "3️⃣  Verify you received tokens (wait ~30 seconds after faucet):"
  );
  console.log(
    "   🔗 https://sepolia.etherscan.io/address/" + wallet.address + "\n"
  );

  console.log("4️⃣  Deploy your contracts to Sepolia:");
  console.log("   npx hardhat run scripts/deploy.js --network sepolia\n");

  console.log("═══════════════════════════════════════════════════════════\n");

  // Save wallet info to a file for reference
  const walletInfo = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
    network: "Sepolia Testnet",
    chainId: 11155111,
    faucet: "https://sepoliafaucet.com/",
    explorer: `https://sepolia.etherscan.io/address/${wallet.address}`,
  };

  const walletPath = path.join(__dirname, "../.wallet-info.json");
  fs.writeFileSync(walletPath, JSON.stringify(walletInfo, null, 2));
  console.log(
    "💾 Wallet info saved to .wallet-info.json (DO NOT COMMIT THIS FILE!)\n"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
