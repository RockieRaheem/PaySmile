/**
 * Verify Sepolia network configuration
 * Run: npx hardhat run scripts/verify-sepolia-setup.js --network sepolia
 */

const hre = require("hardhat");

async function main() {
  console.log("🔍 Verifying Sepolia Network Setup...\n");

  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  console.log("📡 Network Information:");
  console.log(`   Name: ${network.name}`);
  console.log(`   Chain ID: ${network.chainId}`);
  console.log(`   Expected Chain ID: 11155111 (Sepolia)`);

  if (network.chainId.toString() === "11155111") {
    console.log("   ✅ Chain ID matches Sepolia!\n");
  } else {
    console.log("   ❌ Chain ID mismatch!\n");
    throw new Error(`Expected Sepolia (11155111), got ${network.chainId}`);
  }

  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log("👤 Signer Information:");
  console.log(`   Address: ${signer.address}`);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(signer.address);
  const balanceInEth = hre.ethers.formatEther(balance);
  console.log(`   Balance: ${balanceInEth} ETH`);

  if (parseFloat(balanceInEth) > 0) {
    console.log("   ✅ Wallet has funds!\n");
  } else {
    console.log(
      "   ⚠️  Wallet has no funds. Get test ETH from a Sepolia faucet.\n"
    );
    console.log("   Faucet options:");
    console.log("   - https://sepoliafaucet.com/");
    console.log("   - https://faucet.sepolia.dev/");
    console.log("   - https://www.alchemy.com/faucets/ethereum-sepolia\n");
  }

  // Check RPC connection
  const blockNumber = await hre.ethers.provider.getBlockNumber();
  console.log("🔗 RPC Connection:");
  console.log(`   Current Block: ${blockNumber}`);
  console.log("   ✅ RPC connection working!\n");

  console.log("=".repeat(60));
  console.log("✅ Sepolia setup verification complete!");
  console.log("=".repeat(60));
  console.log("\n📋 Next Steps:");
  if (parseFloat(balanceInEth) === 0) {
    console.log("   1. Fund wallet with test ETH from a Sepolia faucet");
    console.log(
      "   2. Deploy contracts: npx hardhat run scripts/deploy.js --network sepolia"
    );
  } else {
    console.log(
      "   1. Deploy contracts: npx hardhat run scripts/deploy.js --network sepolia"
    );
    console.log("   2. Update .env.local with contract addresses");
  }
  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
