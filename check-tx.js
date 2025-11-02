const { ethers } = require("hardhat");

async function main() {
  console.log("\n🔍 Checking transaction status...\n");
  
  const txHash = "0x15ac26943e14aedc74ac3930206dd831a72ef4ddd55a32a6f251a6ddebe8f8ac";
  const provider = ethers.provider;
  
  try {
    const tx = await provider.getTransaction(txHash);
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (tx) {
      console.log("📍 Transaction found!");
      console.log("   From:", tx.from);
      console.log("   To:", tx.to);
      console.log("   Value:", ethers.formatEther(tx.value), "CELO");
      console.log("   Block:", tx.blockNumber);
    }
    
    if (receipt) {
      console.log("\n📋 Receipt:");
      console.log("   Status:", receipt.status === 1 ? "✅ Success" : "❌ Failed");
      console.log("   Gas used:", receipt.gasUsed.toString());
    }
    
    // Check current balance
    const balance = await provider.getBalance("0x96a634eFff3C5c84cEa0520DF60BA5c296c6596c");
    console.log("\n💰 Current balance:", ethers.formatEther(balance), "CELO\n");
    
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

main().catch(console.error);
