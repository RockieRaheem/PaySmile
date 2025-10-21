# PaySmile Local Testnet - Quick Reference

## 🎯 What's Running

- **Blockchain**: Hardhat Localhost (Chain ID: 31337)
  - RPC: http://127.0.0.1:8545
- **Frontend**: Next.js app on http://localhost:9002
- **Contracts**:
  - DonationPool: `0x5FC8d32690cc91D4c39d9d3abcBD16989F875707`
  - SmileBadgeNFT: `0x0165878A594ca255338adfa4d48449f69242Eb8F`

## 🦊 MetaMask Setup (One-time)

### Step 1: Add Network

1. MetaMask → Network dropdown (top left) → Add network → Add manually
2. Fill in:
   - **Network name**: Hardhat Localhost
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency symbol**: ETH
3. Save

### Step 2: Import Account

1. MetaMask → Account icon → Import Account
2. Select "Private Key"
3. Paste: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
4. Import → You'll see 10,000 ETH!

### Step 3: Connect to App

1. MetaMask → Select "Hardhat Localhost" network
2. Refresh app (http://localhost:9002)
3. Click "Connect Your Wallet"
4. Click "Injected" (MetaMask)
5. Approve connection

## 💰 Test Accounts (All have 10,000 ETH)

**Account #0** (Main - already imported above)

- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

**Account #1** (Donor 1)

- Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

**Account #2** (Donor 2)

- Address: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- Private Key: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`

## 🚀 Test the App

### Via Browser (MetaMask)

1. Go to Projects page
2. Click "Vote" on any project → Confirm in MetaMask
3. Click "Donate" → Enter amount → Confirm
4. Check Dashboard to see your activity
5. View Badges page for earned NFTs

### Via Terminal (No wallet needed)

```bash
cd /home/anonymous-user/Desktop/PaySmile
npx hardhat run scripts/test-app.js --network localhost
```

## 🛠️ Useful Commands

### Check if blockchain is running

```bash
curl -X POST http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

### Check if app is running

```bash
curl http://localhost:9002
```

### Run test script

```bash
npx hardhat run scripts/test-app.js --network localhost
```

### View Hardhat console (for debugging)

```bash
npx hardhat console --network localhost
```

## 📦 Sample Projects (Pre-loaded)

1. **Clean Water for Kampala** (ID: 0)
2. **School Supplies Drive** (ID: 1)
3. **Tree Planting Initiative** (ID: 2)

All projects have 0 initial funding and 0 votes (unless you've tested already).

## ⚠️ Known Harmless Warnings

These appear in console but don't affect functionality:

- "Connection interrupted while trying to subscribe" - WalletConnect issue, use MetaMask
- "metadata.url differs from actual page url" - Cosmetic only
- Image dimension warnings - UI works fine

## 🔄 Restart Everything

If you need to restart:

```bash
# Stop all (Ctrl+C in terminals)
# Then restart:
cd /home/anonymous-user/Desktop/PaySmile
npx hardhat node &
sleep 3
npx hardhat run scripts/deploy.js --network localhost
npm run dev
```

## 💡 Tips

- This is a **local testnet** - no real money
- Data resets when Hardhat node stops
- Transactions are instant (no waiting!)
- Free unlimited test ETH
- Perfect for development and testing

---

**Last Updated**: Contract addresses updated with latest deployment
**Chain ID**: 31337 (Hardhat Localhost)
**Status**: ✅ All services running
