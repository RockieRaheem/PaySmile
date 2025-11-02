const hre = require("hardhat");

async function main() {
  console.log("\n🔍 Testing Hardhat signer...\n");
  
  const [signer] = await hre.ethers.getSigners();
  const address = await signer.getAddress();
  
  console.log("📍 Signer address:", address);
  console.log("🎯 Expected:      0x96a634eFff3C5c84cEa0520DF60BA5c296c6596c");
  console.log("🌐 Network:       ", hre.network.name);
  console.log("🔢 Chain ID:      ", hre.network.config.chainId);
}

main().catch(console.error);
