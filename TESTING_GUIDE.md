# 🧪 PaySmile Local Testing Guide

## Current Status

✅ **Hardhat Node Running** (localhost:8545)
✅ **Contracts Deployed**
✅ **Next.js Dev Server Running** (localhost:9002)

---

## 📝 Contract Addresses (Localhost)

```
DonationPool: 0x5FbDB2315678afecb367f032d93F642f64180aa3
SmileBadgeNFT: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

---

## 🔧 MetaMask Setup

### 1. Add Localhost Network

1. Open MetaMask
2. Click network dropdown (top left)
3. Click "Add network" → "Add a network manually"
4. Enter these details:

```
Network Name: Hardhat Localhost
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
```

5. Click "Save"
6. Switch to "Hardhat Localhost" network

### 2. Import Test Account

Click MetaMask menu → Import Account → Private Key

**Test Account #1:**

```
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Balance: 10,000 ETH
```

⚠️ **This is a PUBLIC test key - NEVER use on mainnet!**

**Additional Test Accounts** (if needed):

```
Account #2: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Account #3: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

---

## 🎮 Testing Flows

### Flow 1: View Projects

1. Open http://localhost:9002
2. Click "Get Started"
3. Click "Connect Wallet"
4. Approve MetaMask connection
5. Navigate to "Vote" tab (bottom nav)
6. You should see 3 sample projects from the blockchain:
   - Clean Water for Kampala
   - School Supplies Drive
   - Tree Planting Initiative

### Flow 2: Vote for a Project

1. Go to Projects page (vote tab)
2. Click "Vote" on any project
3. MetaMask popup will appear
4. Approve transaction (gas fees apply)
5. Wait for confirmation
6. Vote count should increase
7. Button should show "Voted" or be disabled

### Flow 3: Donate to a Project

This requires calling the contract directly for now.

**Option A: Using Hardhat Console**

```bash
# In a new terminal
npx hardhat console --network localhost
```

```javascript
const DonationPool = await ethers.getContractAt(
  "DonationPool",
  "0x5FbDB2315678afecb367f032d93F642f64180aa3"
);

// Donate 0.1 ETH to project 0
await DonationPool.donateToProject(0, {
  value: ethers.parseEther("0.1"),
});

// Check project funding
const project = await DonationPool.getProject(0);
console.log("Current funding:", ethers.formatEther(project.currentFunding));
```

**Option B: Browser Console (Advanced)**

```javascript
// Will be implemented in dashboard later
```

### Flow 4: Check Your Stats

```javascript
// In Hardhat console
const yourAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const total = await DonationPool.getDonorTotal(yourAddress);
console.log("Total donated:", ethers.formatEther(total), "ETH");
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect wallet"

**Solution:**

- Ensure MetaMask is on "Hardhat Localhost" network (Chain ID 31337)
- Check that Hardhat node is running
- Try refreshing the page

### Issue: "Transaction Failed"

**Solution:**

- Make sure you have ETH in your test account
- Check that contract address is correct in .env.local
- Look at MetaMask error message for details

### Issue: "Projects not loading"

**Solution:**

1. Check API endpoint: http://localhost:9002/api/project/0
2. Should return JSON with project data
3. Check browser console for errors
4. Verify contracts are deployed: Run deployment script again

### Issue: "Hardhat node stopped"

**Solution:**

```bash
# Restart Hardhat node
npx hardhat node

# Redeploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Update .env.local if contract addresses changed
```

---

## 🔍 Verification Commands

### Check if contracts are deployed

```bash
# In Hardhat console
npx hardhat console --network localhost

const pool = await ethers.getContractAt("DonationPool", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
await pool.getProjectCount(); // Should return 3
```

### Check API endpoint

```bash
curl http://localhost:9002/api/project/0
```

Expected response:

```json
{
  "id": 0,
  "name": "Clean Water for Kampala",
  "description": "Build boreholes in rural Kampala communities",
  "fundingGoal": "100000000000000000000",
  "currentFunding": "0",
  "isActive": true,
  "isFunded": false,
  "votesReceived": "0",
  "category": "Healthcare"
}
```

### Check MetaMask connection

- Open browser DevTools (F12)
- Go to Console tab
- Type: `window.ethereum.isConnected()`
- Should return: `true`

---

## 📊 Current Project Data

**Project 0: Clean Water for Kampala**

- Goal: 100 ETH
- Category: Healthcare

**Project 1: School Supplies Drive**

- Goal: 50 ETH
- Category: Education

**Project 2: Tree Planting Initiative**

- Goal: 75 ETH
- Category: Environment

---

## ✅ Success Checklist

- [ ] MetaMask connected to localhost (Chain ID 31337)
- [ ] Test account imported with 10,000 ETH
- [ ] Can see 3 projects on /projects page
- [ ] Can vote for a project (transaction succeeds)
- [ ] Vote count increases after voting
- [ ] Can donate via Hardhat console
- [ ] Funding amount increases after donation

---

## 🎯 Next Testing Steps

1. ✅ **Basic Flow Working** - Vote functionality
2. ⏳ **Implement Donate Button** - Add donate UI to projects page
3. ⏳ **Update Dashboard** - Show real blockchain stats
4. ⏳ **Badge Minting** - Test NFT badge functionality
5. ⏳ **Deploy to Alfajores** - Test on real testnet

---

## 🚀 Quick Test Commands

```bash
# Terminal 1: Hardhat Node (already running)
npx hardhat node

# Terminal 2: Deploy
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Dev Server (already running)
npm run dev

# Terminal 4: Hardhat Console (for testing)
npx hardhat console --network localhost
```

---

## 📱 Testing Checklist for EthNile Demo

- [ ] Wallet connects successfully
- [ ] Projects load from blockchain
- [ ] Vote transaction works
- [ ] Vote count updates
- [ ] Donate transaction works (via console)
- [ ] Funding progress updates
- [ ] NFT badge mints after donation
- [ ] Dashboard shows correct stats

---

**Happy Testing! 🎉**

If you encounter any issues, check the troubleshooting section or the browser/terminal console for error messages.
