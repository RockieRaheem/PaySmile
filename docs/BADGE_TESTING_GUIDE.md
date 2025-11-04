# Quick Start: Testing Badge Minting

## Prerequisites

You need the **private key of the wallet that deployed the SmileBadgeNFT contract** at address `0x0A0Be3D3c76b301007E0Ab612b36a9E72bAEd4F3` on Alfajores.

## Setup Steps

### 1. Configure Environment Variables

Create `.env.local` file in the project root:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Add your contract owner private key:

```bash
CONTRACT_OWNER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
```

⚠️ **Security Warning:** Never commit this file to git. It's already in `.gitignore`.

### 2. Verify Contract Addresses

Check that these are correct in `.env.local`:

```bash
NEXT_PUBLIC_SMILE_BADGE_NFT_ADDRESS=0x0A0Be3D3c76b301007E0Ab612b36a9E72bAEd4F3
NEXT_PUBLIC_DONATION_POOL_ADDRESS=0x7726637769da3CF89F0502bF124522B6f58e4aa5
NEXT_PUBLIC_CHAIN_ID=44787
```

### 3. Create Badge Images (Optional but Recommended)

Create these files for badge visuals:

- `/public/badges/bronze.png`
- `/public/badges/silver.png`
- `/public/badges/gold.png`
- `/public/badges/platinum.png`

Or update the metadata URL in `/src/app/api/badges/mint/route.ts` line 156.

### 4. Start the Development Server

```bash
npm run dev
```

Server will start on http://localhost:9002

## Testing Badge Minting

### Test 1: Wallet Donation (Crypto)

1. **Connect MetaMask**

   - Switch to Celo Alfajores testnet
   - Ensure you have test CELO

2. **Make a Donation**

   - Go to any project
   - Click "Donate"
   - Select "Wallet" payment method
   - Enter amount (e.g., 20 CELO = $10 USD)
   - Confirm transaction in MetaMask

3. **Verify Badge Minting**

   - Wait for transaction confirmation
   - You should see two toasts:
     - "Donation Confirmed! 🎉"
     - "Badge Earned! 🏅 You earned a Bronze badge"
   - Check browser console for badge minting logs

4. **Check Badge in Wallet**
   - Go to `/badges` page
   - Your badge should appear
   - Or check on Celoscan: https://alfajores.celoscan.io/address/YOUR_WALLET

### Test 2: Fiat Donation (Flutterwave)

1. **Make a Fiat Donation**

   - Go to any project
   - Click "Donate"
   - Select "Card" or "Mobile Money"
   - Enter amount: $50 USD (to get Silver badge)
   - Fill in test details:
     - Name: Test User
     - Email: test@example.com
     - Phone: +250780000000

2. **Complete Payment**

   - Use Flutterwave test credentials
   - Enter OTP: 123456

3. **Verify Badge**
   - After payment success, check for badge earned toast
   - Check browser console logs

### Test 3: Different Badge Tiers

Test each tier to verify the mapping:

| Donation Amount | Expected Badge | Contract Type      |
| --------------- | -------------- | ------------------ |
| $10 - $49       | Bronze         | FIRST_STEP         |
| $50 - $99       | Silver         | EDUCATION_CHAMPION |
| $100 - $249     | Gold           | GREEN_GUARDIAN     |
| $250+           | Platinum       | HEALTH_HERO        |

### Test 4: Below Threshold

- Donate less than $10
- Verify that NO badge is minted
- Donation should still succeed

## Debugging

### Check API Endpoint

Test the badge minting API directly:

```bash
curl -X POST http://localhost:9002/api/badges/mint \
  -H "Content-Type: application/json" \
  -d '{
    "recipientAddress": "0xYourWalletAddress",
    "donationAmount": "50.00",
    "projectId": 1,
    "projectName": "Clean Water Initiative",
    "transactionHash": "0x123..."
  }'
```

Expected response:

```json
{
  "success": true,
  "transactionHash": "0x...",
  "badgeType": 2,
  "tierName": "Silver",
  "tokenURI": "data:application/json;base64,..."
}
```

### Check Browser Console

Look for these logs:

- "Minting badge:" - When API is called
- "Badge minted successfully:" - On success
- "Badge minting failed:" - On error

### Check Server Logs

Terminal should show:

```
Minting badge: {
  recipient: '0x...',
  badgeType: 2,
  tierName: 'Silver',
  amount: '50.00',
  project: 'Clean Water Initiative'
}
Badge minted successfully: {
  txHash: '0x...',
  status: 'success'
}
```

### Common Errors

**"CONTRACT_OWNER_PRIVATE_KEY not set"**

- Add the private key to `.env.local`
- Restart the dev server

**"Badge already earned"**

- User already has a badge of this tier
- This is expected behavior (contract prevents duplicates)
- Try donating a different amount to get a different tier

**"Failed to mint badge"**

- Check that the private key is correct
- Verify it's the owner of SmileBadgeNFT contract
- Check Alfajores RPC is working
- Ensure wallet has test CELO for gas

**"Invalid recipient address"**

- For wallet donations, address should be available
- For fiat donations, we use email as fallback (this won't work for actual minting)

## Verification on Blockchain

### Method 1: Celoscan

1. Go to https://alfajores.celoscan.io/address/0x0A0Be3D3c76b301007E0Ab612b36a9E72bAEd4F3
2. Click "Token Transfers" tab
3. Look for recent mints to your address

### Method 2: Contract Read

1. Go to contract on Celoscan
2. Click "Read Contract"
3. Call `getBadgesByOwner(yourAddress)`
4. Should return array of token IDs

### Method 3: In App

1. Go to `/badges` page
2. Connect wallet
3. Should see badge count in header
4. Earned badges show in color, locked badges are grayed out

## Next Steps After Testing

1. **Create actual badge images** and update metadata URLs
2. **Store owner private key securely** (AWS Secrets Manager for production)
3. **Implement badge gallery enhancements** (metadata display, filters)
4. **Add social sharing** for badges
5. **Handle fiat payments without wallets** (claim flow)

## Troubleshooting Tips

- Badge minting runs in background and won't block donation
- Errors are logged but not shown to users
- Check both browser console AND server terminal
- Verify badge tier calculation in code if amounts don't match
- Test with different wallets to avoid duplicate badge errors

---

**Need Help?**

- Check docs/BADGE_MINTING_IMPLEMENTATION.md for full details
- Review PRD-Remaining-Features.md for feature requirements
- Look at SmileBadgeNFT.sol for contract code
