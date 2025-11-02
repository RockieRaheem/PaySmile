const { ethers } = require("ethers");

// The address that received CELO from faucet
const receivedAddress = "0x96a634eFff3C5c84cEa0520DF60BA5c296c6596c";

// Test private keys we've used
const privateKeys = [
  "0x24ecf72ffa04abc67bb0c2e6ebbe2a860c28e86c2ee6ad5d67e59cae1bd06975", // Old key
  "0xb153fdb9ffe7e4472a538dd9c121f944b5b4732598eaace2b8f46c89646c0fe8", // New key
];

console.log("\n🔍 Finding correct private key for funded address...\n");

privateKeys.forEach((pk, index) => {
  const wallet = new ethers.Wallet(pk);
  console.log(`Key ${index + 1}: ${pk}`);
  console.log(`   Derives to: ${wallet.address}`);
  if (wallet.address.toLowerCase() === receivedAddress.toLowerCase()) {
    console.log(`   ✅ MATCH! This is the funded wallet!\n`);
  } else {
    console.log(`   ❌ Not a match\n`);
  }
});
