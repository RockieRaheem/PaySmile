# 🧪 PaySmile End-to-End Testing Guide

## ✅ Prerequisites Checklist

Before testing, ensure:

- [x] Hardhat node is running (`npx hardhat node`)
- [x] Contracts are deployed to localhost (DonationPool: 0x5FbDB...0aa3)
- [x] Next.js dev server is running (`npm run dev` on port 9002)
- [x] MetaMask has Hardhat Localhost network added (Chain ID: 31337)
- [x] Test account imported (0xf39F...2266 with 10,000 ETH)
- [x] MetaMask switched to Hardhat Localhost network

## 🎯 Testing Flow

### 1️⃣ Wallet Connection Test

**Steps:**

1. Go to http://localhost:9002
2. Click "Connect Wallet" or go to http://localhost:9002/connect
3. Select MetaMask
4. Approve connection in MetaMask popup
5. Verify you're redirected to dashboard

**Expected Results:**

- ✅ MetaMask popup appears
- ✅ Shows Hardhat Localhost network
- ✅ Shows your address: 0xf39F...2266
- ✅ Connection succeeds
- ✅ Redirected to /dashboard

---

### 2️⃣ Dashboard Data Test

**Steps:**

1. Navigate to http://localhost:9002/dashboard
2. Wait 2-3 seconds for blockchain data to load

**Expected Results:**

- ✅ No "Wrong Network" alert appears
- ✅ "Welcome back" section shows your address
- ✅ Total Donations shows "0 ETH" (initially)
- ✅ Active Projects section shows 3 projects:
  - Clean Water for Kampala (100 ETH goal)
  - School Supplies Drive (50 ETH goal)
  - Tree Planting Initiative (75 ETH goal)
- ✅ Page loads in 2-3 seconds (not 30+ seconds)

---

### 3️⃣ Projects Page Test

**Steps:**

1. Navigate to http://localhost:9002/projects
2. View all available projects

**Expected Results:**

- ✅ No "Wrong Network" alert
- ✅ Shows 3 community projects
- ✅ Each project shows:
  - Project name and description
  - Progress bar (0% initially)
  - Current funding: 0 ETH
  - Goal amount
  - Vote button
  - Vote count (0 votes initially)

---

### 4️⃣ Voting Test

**Steps:**

1. On Projects page, click "Vote" on any project
2. MetaMask popup appears - review transaction
3. Click "Confirm" in MetaMask
4. Wait for transaction confirmation (1-2 seconds)

**Expected Results:**

- ✅ MetaMask shows transaction details:
  - Network: Hardhat Localhost
  - Contract: 0x5FbDB...0aa3 (DonationPool)
  - Gas fee: ~0.0001 ETH
- ✅ Transaction confirms quickly (1-2 seconds)
- ✅ Vote count increases by 1
- ✅ "Vote" button changes to "Voted ✓" (disabled)
- ✅ Success toast/notification appears

**Test Multiple Votes:**

- Try voting on the same project again → Should show "Already voted" or button stays disabled
- Vote on a different project → Should succeed

---

### 5️⃣ Donation Test (Via Hardhat Console)

Since the donation UI isn't fully built, test via Hardhat console:

**Steps:**

1. Open new terminal
2. Run: `npx hardhat console --network localhost`
3. Execute these commands:

```javascript
// Get contract instance
const pool = await ethers.getContractAt(
  "DonationPool",
  "0x5FbDB2315678afecb367f032d93F642f64180aa3"
);

// Donate 1 ETH to project 0
await pool.donateToProject(0, { value: ethers.parseEther("1") });

// Check project funding
const project = await pool.getProject(0);
console.log(
  "Current funding:",
  ethers.formatEther(project.currentFunding),
  "ETH"
);

// Check your donor stats
const [deployer] = await ethers.getSigners();
const stats = await pool.getDonorStats(deployer.address);
console.log(
  "Total donations:",
  ethers.formatEther(stats.totalDonations),
  "ETH"
);
```

4. Go back to dashboard and refresh

**Expected Results:**

- ✅ Transaction succeeds in console
- ✅ Dashboard shows updated "Total Donations: 1 ETH"
- ✅ Projects page shows project progress bar at 1/100 (1%)
- ✅ Current funding shows "1 ETH / 100 ETH"

---

### 6️⃣ Round-up Calculator Test

**Steps:**

1. Navigate to http://localhost:9002/setup
2. View the round-up calculator
3. Try different round-up options:
   - 10 Shillings
   - 50 Shillings
   - 100 Shillings

**Expected Results:**
For purchase amount **9,547 UGX**:

- ✅ 10 Shillings → 9,550 UGX total → **3 UGX donation**
- ✅ 50 Shillings → 9,550 UGX total → **3 UGX donation**
- ✅ 100 Shillings → 9,600 UGX total → **53 UGX donation**

---

### 7️⃣ Network Switching Test

**Steps:**

1. In MetaMask, switch to "Ethereum Mainnet"
2. Go to dashboard or projects page
3. Observe the red alert banner
4. Click "Switch to Hardhat Localhost" button
5. Approve network switch in MetaMask

**Expected Results:**

- ✅ Red alert appears: "You're connected to Ethereum Mainnet but PaySmile contracts are deployed on Hardhat Localhost"
- ✅ Button shows "Switch to Hardhat Localhost"
- ✅ Clicking button triggers MetaMask popup
- ✅ After switching, alert disappears
- ✅ Page auto-refreshes and loads data correctly

---

### 8️⃣ Performance Test

**Before (Wrong Network - Ethereum Mainnet):**

- ⏱️ Dashboard load: 30+ seconds
- ⏱️ Projects page: 30+ seconds
- ❌ Voting fails with gas errors

**After (Correct Network - Hardhat Localhost):**

- ⏱️ Dashboard load: 2-3 seconds
- ⏱️ Projects page: 2-3 seconds
- ✅ Voting succeeds in 1-2 seconds

---

## 🐛 Common Issues & Solutions

### Issue 1: "Wrong Network" alert won't go away

**Solution:**

- Check MetaMask is on "Hardhat Localhost" (not Ethereum Mainnet)
- Refresh browser page after switching
- Clear browser cache if persistent

### Issue 2: "Connection Refused" errors in console

**Solution:**

- Verify Hardhat node is running: `ps aux | grep hardhat`
- If not running: `npx hardhat node`
- Check terminal shows: "Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/"

### Issue 3: Projects not loading or showing 0 projects

**Solution:**

- Re-run deployment script: `npx hardhat run scripts/deploy.js --network localhost`
- Verify contracts deployed at correct addresses in .env.local
- Check browser console for errors

### Issue 4: MetaMask shows wrong balance (not 10,000 ETH)

**Solution:**

- Verify you imported the correct private key: `0xac0974bec...2ff80`
- Check you're on Hardhat Localhost network (Chain ID: 31337)
- Reset MetaMask account: Settings → Advanced → Clear activity tab data

### Issue 5: Voting transaction fails

**Solution:**

- Ensure you have ETH for gas fees (test account has 10,000 ETH)
- Check you haven't already voted on that project
- Verify contract address is correct: 0x5FbDB...0aa3

---

## 📊 Test Results Template

Copy this template to document your testing:

```
## Test Results - [Date]

### Environment
- Hardhat Node: ✅ Running / ❌ Not Running
- Dev Server: ✅ Running on port 9002 / ❌ Not Running
- MetaMask Network: Hardhat Localhost (31337)
- Test Account: 0xf39F...2266

### Test Results
1. Wallet Connection: ✅ Pass / ❌ Fail
2. Dashboard Load: ✅ Pass / ❌ Fail (Load time: ___ seconds)
3. Projects Display: ✅ Pass / ❌ Fail (Showing ___ projects)
4. Voting: ✅ Pass / ❌ Fail
5. Donation (Console): ✅ Pass / ❌ Fail
6. Round-up Calculator: ✅ Pass / ❌ Fail
7. Network Switching: ✅ Pass / ❌ Fail
8. Performance: ✅ Pass / ❌ Fail (Load time: ___ seconds)

### Issues Found
- [List any issues discovered]

### Notes
- [Add any additional observations]
```

---

## 🚀 Next Steps After Testing

Once all tests pass:

1. **Deploy to Celo Alfajores Testnet**

   - Get test CELO: https://faucet.celo.org/alfajores
   - Update hardhat.config.js with private key
   - Run: `npx hardhat run scripts/deploy.js --network alfajores`
   - Update .env.local with new addresses
   - Set NEXT_PUBLIC_CHAIN_ID=44787

2. **Prepare for EthNile Submission**

   - Record demo video showing all features
   - Update README.md with deployment info
   - Document smart contract addresses
   - Prepare presentation slides

3. **Production Deployment**
   - Deploy contracts to Celo Mainnet
   - Deploy frontend to Vercel/Firebase
   - Configure production environment variables
   - Set up monitoring and analytics

---

## 📞 Support

If you encounter issues not covered here:

1. Check `docs/NETWORK_FIX.md` for network-specific issues
2. Check `METAMASK_SETUP.md` for wallet setup
3. Review browser console for detailed error messages
4. Check Hardhat node terminal for transaction logs

---

**Happy Testing! 🎉**
