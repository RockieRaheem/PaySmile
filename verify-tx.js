const { ethers } = require("hardhat");

async function main() {
  console.log("\n🔍 Verifying transaction and balance...\n");
  
  const txHash = "0xde51ec5d4d0259d10f730335396ec5dcf3c59d41aae4ec04bf9adecada5ce97c";
  const address = "0xa23bC4E86F619EF28371844dDd548aB726F05637";
  
  try {
    // Check transaction
    console.log("📋 Checking transaction:", txHash);
    const receipt = await ethers.provider.getTransactionReceipt(txHash);
    
    if (receipt) {
      console.log("✅ Transaction confirmed!");
      console.log("   Block:", receipt.blockNumber);
      console.log("   Status:", receipt.status === 1 ? "Success" : "Failed");
      console.log("   Gas used:", receipt.gasUsed.toString());
    } else {
      console.log("⏳ Transaction pending or not found yet...");
    }
    
    // Check balance
    console.log("\n💰 Checking balance...");
    const balance = await ethers.provider.getBalance(address);
    const balanceInCelo = ethers.formatEther(balance);
    
    console.log("   Address:", address);
    console.log("   Balance:", balanceInCelo, "CELO");
    
    if (parseFloat(balanceInCelo) > 0) {
      console.log("\n✅ SUCCESS! You have CELO tokens!");
      console.log("🚀 Ready to deploy contracts!\n");
    } else {
      console.log("\n⏳ Balance is 0 - transaction may still be processing...");
      console.log("   Wait 1-2 minutes and try again\n");
    }
    
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

main().catch(console.error);
