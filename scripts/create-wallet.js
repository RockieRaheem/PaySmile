const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n🔐 Creating a new Celo testnet wallet...\n");

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

  console.log("2️⃣  Get FREE test CELO tokens from the faucet:");
  console.log("   🔗 https://faucet.celo.org/alfajores");
  console.log(`   📍 Use this address: ${wallet.address}\n`);

  console.log(
    "3️⃣  Verify you received tokens (wait ~30 seconds after faucet):"
  );
  console.log(
    "   🔗 https://alfajores.celoscan.io/address/" + wallet.address + "\n"
  );

  console.log("4️⃣  Deploy your contracts to Celo Alfajores:");
  console.log("   npx hardhat run scripts/deploy.js --network alfajores\n");

  console.log("═══════════════════════════════════════════════════════════\n");

  // Save wallet info to a file for reference
  const walletInfo = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
    network: "Celo Alfajores Testnet",
    chainId: 44787,
    faucet: "https://faucet.celo.org/alfajores",
    explorer: `https://alfajores.celoscan.io/address/${wallet.address}`,
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
