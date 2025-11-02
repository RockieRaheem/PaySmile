require("dotenv").config();
const { ethers } = require("ethers");

console.log("\n🔍 Testing .env loading...\n");
console.log("Private key from .env:", process.env.PRIVATE_KEY ? "Found" : "NOT FOUND");

if (process.env.PRIVATE_KEY) {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  console.log("📍 Derives to:", wallet.address);
  console.log("🎯 Expected:  0x96a634eFff3C5c84cEa0520DF60BA5c296c6596c\n");
}
