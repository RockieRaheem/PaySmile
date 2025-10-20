# MetaMask Setup for PaySmile (Hardhat Localhost)

## 🦊 Add Hardhat Localhost Network to MetaMask

### Step 1: Add Custom Network

1. Open MetaMask extension
2. Click the network selector (top left - shows "Ethereum Mainnet" or current network)
3. Click "Add network" or "Add a custom network"
4. Enter these details:

```
Network Name: Hardhat Localhost
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
Block Explorer URL: (leave empty)
```

5. Click "Save"

### Step 2: Import Test Account

1. Click your account icon (top right)
2. Select "Import Account"
3. Select "Private Key"
4. Paste this private key:

```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

5. Click "Import"

**You should see 10,000 ETH in your account!** ✅

### Step 3: Switch to Hardhat Localhost

1. Click the network selector again
2. Select "Hardhat Localhost"
3. You should see your balance: **10,000 ETH**

## 🎯 Quick Test

1. Go to http://localhost:9002/dashboard
2. The red "Wrong Network" alert should **disappear**
3. Projects should load **instantly** (2-3 seconds)
4. Try voting on a project - it should work!

## 📍 Deployed Contract Addresses

```
DonationPool: 0x5FbDB2315678afecb367f032d93F642f64180aa3
SmileBadgeNFT: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

## ✅ Test Account Details

```
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Balance: 10,000 ETH (test tokens)
```

⚠️ **WARNING**: Never use this account on real networks! The private key is public.

## 🐛 Troubleshooting

### "Wrong Network" alert still showing?

- Make sure MetaMask is switched to "Hardhat Localhost"
- Refresh the page after switching networks

### "Connection Refused" errors?

- Make sure Hardhat node is running: `npx hardhat node`
- Check the terminal for the message: "Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/"

### Projects not loading?

- Clear browser cache and refresh
- Check MetaMask is on the correct network (Hardhat Localhost)
- Check browser console for errors

## 🚀 Sample Projects Already Created

1. **Clean Water for Kampala** - Goal: 100 ETH
2. **School Supplies Drive** - Goal: 50 ETH
3. **Tree Planting Initiative** - Goal: 75 ETH

You can vote for any of these projects now!
