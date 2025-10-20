# 🚀 PaySmile Quick Reference

## 📍 Deployed Contracts (Localhost)

```
DonationPool:  0x5FbDB2315678afecb367f032d93F642f64180aa3
SmileBadgeNFT: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

## 🔑 Test Account

```
Address:     0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Balance:     10,000 ETH
```

## 🌐 Network Settings (MetaMask)

```
Network Name: Hardhat Localhost
RPC URL:      http://127.0.0.1:8545
Chain ID:     31337
Currency:     ETH
```

## 🖥️ Local URLs

```
Frontend:       http://localhost:9002
Hardhat RPC:    http://127.0.0.1:8545
Dashboard:      http://localhost:9002/dashboard
Projects:       http://localhost:9002/projects
Setup:          http://localhost:9002/setup
```

## ⚡ Quick Commands

```bash
# Start Hardhat node
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Start dev server
npm run dev

# Verify setup
./scripts/verify-setup.sh

# Hardhat console
npx hardhat console --network localhost
```

## 🧪 Quick Test Commands (Hardhat Console)

```javascript
// Get contract
const pool = await ethers.getContractAt(
  "DonationPool",
  "0x5FbDB2315678afecb367f032d93F642f64180aa3"
);

// Donate to project 0
await pool.donateToProject(0, { value: ethers.parseEther("1") });

// Check project
const p = await pool.getProject(0);
console.log("Funding:", ethers.formatEther(p.currentFunding));

// Check your stats
const [me] = await ethers.getSigners();
const stats = await pool.getDonorStats(me.address);
console.log("Total:", ethers.formatEther(stats.totalDonations));
```

## 📚 Documentation

```
METAMASK_SETUP.md              - Wallet configuration
docs/END_TO_END_TESTING.md     - Testing guide
docs/NETWORK_FIX.md             - Troubleshooting
docs/DEPLOYMENT_COMPLETE.md     - Full deployment summary
```

## ✅ Pre-flight Checklist

- [ ] Hardhat node running (check terminal)
- [ ] Contracts deployed (see deployments/localhost-deployment.json)
- [ ] Dev server running on :9002
- [ ] MetaMask has Hardhat Localhost network
- [ ] Test account imported with 10,000 ETH
- [ ] MetaMask switched to Hardhat Localhost

## 🎯 Sample Projects (Pre-created)

```
ID 0: Clean Water for Kampala    (100 ETH goal)
ID 1: School Supplies Drive       (50 ETH goal)
ID 2: Tree Planting Initiative    (75 ETH goal)
```

## 🐛 Quick Fixes

**Wrong Network Alert?**
→ Switch MetaMask to Hardhat Localhost

**Connection Refused?**
→ Start Hardhat: `npx hardhat node`

**No Projects?**
→ Re-deploy: `npx hardhat run scripts/deploy.js --network localhost`

**Slow Loading?**
→ Check MetaMask is on Chain ID 31337, not 1

---

**Ready to test!** 🎉
