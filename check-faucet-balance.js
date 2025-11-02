const { ethers } = require("hardhat");

async function main() {
  console.log("\n🔍 Checking balance on Celo Sepolia blockchain...\n");
  
  const address = "0xa23bC4E86F619EF28371844dDd548aB726F05637";
  const provider = ethers.provider;
  
  console.log("📍 Checking address:", address);
  console.log("🌐 Network:", hre.network.name);
  console.log("🔗 RPC:", hre.network.config.url);
  console.log("");
  
  try {
    // Get balance
    const balance = await provider.getBalance(address);
    console.log("�� Raw balance (wei):", balance.toString());
    console.log("💰 Balance in CELO:", ethers.formatEther(balance));
    
    // Get transaction count (to see if wallet has been used)
    const txCount = await provider.getTransactionCount(address);
    console.log("📊 Transaction count:", txCount);
    
    // Get current block number
    const blockNumber = await provider.getBlockNumber();
    console.log("🔢 Current block number:", blockNumber);
    
    console.log("\n🔗 View on explorer:");
    console.log(`https://alfajores.celoscan.io/address/${address}\n`);
    
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

main().catch(console.error);
