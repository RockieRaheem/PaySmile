const { ethers } = require("ethers");

const privateKey = "0xbe07de17a2203547fba4099ce993032dd783c52784f8c80e4c767a4ebc96585b";
const wallet = new ethers.Wallet(privateKey);

console.log("\n🔍 Verifying private key...\n");
console.log("📍 Derives to address:", wallet.address);
console.log("🎯 Expected address:  0x96a634eFff3C5c84cEa0520DF60BA5c296c6596c");

if (wallet.address.toLowerCase() === "0x96a634eFff3C5c84cEa0520DF60BA5c296c6596c".toLowerCase()) {
  console.log("\n✅ PERFECT MATCH! This is the funded wallet!\n");
} else {
  console.log("\n❌ Address mismatch!\n");
}
