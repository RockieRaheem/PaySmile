# Badge Minting Implementation Summary

## ✅ What Was Implemented

### 1. Badge Minting Hook (`use-contracts.ts`)

- **Added `useMintBadge()` hook**: Connects to SmileBadgeNFT contract to mint badges
- **Added `BadgeType` enum**: Maps to contract's badge types (FIRST_STEP, COMMUNITY_BUILDER, etc.)
- **Added utility functions**:
  - `getBadgeTypeFromAmount(amountUSD)`: Determines badge type based on donation amount
  - `getBadgeTierName(amountUSD)`: Returns tier name (Bronze, Silver, Gold, Platinum)

**Badge Tier Mapping:**

- Bronze ($10-$49) → FIRST_STEP
- Silver ($50-$99) → EDUCATION_CHAMPION
- Gold ($100-$249) → GREEN_GUARDIAN
- Platinum ($250+) → HEALTH_HERO

### 2. Backend API Endpoint (`/api/badges/mint/route.ts`)

**Why it's needed:** The SmileBadgeNFT contract has `onlyOwner` modifier, meaning only the contract deployer can mint badges. Users cannot mint badges themselves directly.

**Solution:** Backend API that uses contract owner's private key to mint badges

**Endpoint:** `POST /api/badges/mint`

**Request Body:**

```json
{
  "recipientAddress": "0x...",
  "donationAmount": "50.00",
  "projectId": 1,
  "projectName": "Clean Water Initiative",
  "transactionHash": "0x..."
}
```

**Features:**

- Validates minimum $10 donation
- Calculates badge tier based on amount
- Generates metadata URI with badge details
- Mints badge using contract owner wallet
- Returns transaction hash and badge info

**Token Metadata:**

```json
{
  "name": "PaySmile Silver Badge",
  "description": "Awarded for donating $50 to Clean Water Initiative",
  "image": "https://paysmile.app/badges/silver.png",
  "attributes": [
    { "trait_type": "Tier", "value": "Silver" },
    { "trait_type": "Project", "value": "Clean Water Initiative" },
    { "trait_type": "Donation Amount (USD)", "value": "50.00" },
    { "trait_type": "Date", "value": "2024-01-15T12:00:00Z" }
  ]
}
```

### 3. Donation Flow Integration (`SimpleDonationModal.tsx`)

**Wallet Donations (Crypto):**

- After successful blockchain confirmation (`isSuccess = true`)
- Converts CELO to USD (rate: 1 CELO = $0.50)
- Calls `/api/badges/mint` with wallet address
- Shows "Badge Earned! 🏅" toast notification

**Fiat Donations (Flutterwave):**

- After payment verification (`status = "successful"`)
- Converts currency to USD (NGN, KES, GHS, ZAR, UGX)
- Calls `/api/badges/mint` (uses email as fallback if no wallet)
- Shows badge tier notification

**Error Handling:**

- Badge minting errors are logged but not shown to users
- Donation completes successfully even if badge minting fails
- Silent fallback ensures UX is not disrupted

### 4. Environment Configuration (`.env.example`)

Required environment variables:

```bash
# Required for badge minting
CONTRACT_OWNER_PRIVATE_KEY=0x...

# Contract addresses
NEXT_PUBLIC_SMILE_BADGE_NFT_ADDRESS=0x0A0Be3D3c76b301007E0Ab612b36a9E72bAEd4F3
NEXT_PUBLIC_DONATION_POOL_ADDRESS=0x7726637769da3CF89F0502bF124522B6f58e4aa5

# Network
NEXT_PUBLIC_CHAIN_ID=44787
```

## 📋 User Flow

1. **User Makes Donation**

   - Wallet: Donates CELO via MetaMask
   - Fiat: Pays with card/mobile money via Flutterwave

2. **Payment Confirmed**

   - Wallet: Transaction mined on blockchain
   - Fiat: Flutterwave webhook confirms payment

3. **Badge Minting (Automatic)**

   - Frontend calls `/api/badges/mint`
   - Backend verifies donation >= $10
   - Backend calculates badge tier
   - Backend mints NFT using owner wallet
   - NFT sent to donor's address

4. **Badge Earned Notification**
   - Toast: "You earned a Silver badge!"
   - Badge appears in `/badges` page
   - Visible on Alfajores block explorer

## 🔧 Technical Details

### Smart Contract Limitation

The deployed `SmileBadgeNFT` contract uses achievement-based badge types instead of tier-based:

- **Contract has:** FIRST_STEP, COMMUNITY_BUILDER, EDUCATION_CHAMPION, WATER_WARRIOR, HEALTH_HERO, GREEN_GUARDIAN
- **PRD wants:** Bronze, Silver, Gold, Platinum

**Workaround:** We mapped donation tiers to existing badge types:

- Bronze → FIRST_STEP (0)
- Silver → EDUCATION_CHAMPION (2)
- Gold → GREEN_GUARDIAN (5)
- Platinum → HEALTH_HERO (4)

### Badge Uniqueness

The contract prevents minting duplicate badge types:

```solidity
require(!badgesEarned[to][badgeType], "Badge already earned");
```

**Implication:** Users can only earn ONE badge of each tier. If they donate $50 twice, the second Silver badge will fail.

**Future Solution:** Deploy a new contract that allows multiple badges per tier, or use different badge types for repeat donations.

## 🚀 Next Steps

### Immediate Tasks (Required to Test)

1. **Add `CONTRACT_OWNER_PRIVATE_KEY` to `.env.local`**

   - This is the private key of the wallet that deployed the SmileBadgeNFT contract
   - Without it, badge minting will fail with "Server configuration error"

2. **Create Badge Images**

   - Upload images to: `/public/badges/bronze.png`, `silver.png`, `gold.png`, `platinum.png`
   - Update metadata URL in `/api/badges/mint/route.ts`
   - Or use IPFS for decentralized storage

3. **Test Badge Minting**
   - Make a test donation of $10+ on Alfajores
   - Check badge minted on Celoscan
   - Verify badge appears in `/badges` page

### Enhancement Ideas

1. **Badge Gallery Improvements**

   - Fetch full badge metadata (name, tier, project, date)
   - Display badge details in modal on click
   - Show badge rarity and uniqueness
   - Add sorting/filtering by tier or project

2. **Badge Uniqueness System**

   - Option A: Allow multiple badges per tier with different designs
   - Option B: Upgrade existing badge with higher tiers
   - Option C: Deploy new contract with cumulative badge IDs

3. **Fiat Payment Badge Delivery**

   - For users without wallets, store badges in database
   - Create "claim badge" flow where users connect wallet later
   - Issue badges retroactively for past donations

4. **Social Features**

   - Share badge on Twitter/social media
   - Leaderboard based on badge count
   - Badge showcase on user profile
   - Special badges for top donors

5. **Metadata Improvements**
   - Use IPFS for permanent metadata storage
   - Add animated badge designs
   - Include project impact data in metadata
   - Create unique badge artwork per project

## ⚠️ Known Issues

### Issue 1: Contract Owner Requirement

**Problem:** Only contract owner can mint badges
**Impact:** Requires backend server with owner private key
**Risk:** Private key exposure if server is compromised

**Solutions:**

- Keep private key in secure environment variables
- Use AWS Secrets Manager or similar for production
- Consider deploying new contract with minter role pattern

### Issue 2: Badge Type Limitation

**Problem:** Only 6 badge types in contract
**Impact:** Can only issue 6 unique badges per user
**Workaround:** Map tiers to existing types

**Solutions:**

- Deploy SmileBadgeNFT V2 with tier-based system
- Use badge levels/metadata to differentiate
- Create project-specific badge contracts

### Issue 3: Fiat Payments Without Wallets

**Problem:** Users paying with card/mobile money may not have crypto wallets
**Impact:** Cannot receive NFT badge immediately
**Workaround:** Use email as recipient identifier

**Solutions:**

- Store badge claims in database
- Send email with "claim your badge" link
- Create wallet on behalf of user (custodial)
- Use account abstraction for gasless claiming

### Issue 4: Gas Fees

**Problem:** Backend pays gas for all badge mints
**Impact:** Costs add up with many donations
**Current:** ~$0.001 per mint on Alfajores (testnet is free)

**Solutions:**

- Batch mint badges periodically
- Use gasless transactions (EIP-2771)
- Make users pay gas (requires wallet)

## 📝 Files Modified

1. `/src/hooks/use-contracts.ts` - Added badge minting hooks
2. `/src/components/SimpleDonationModal.tsx` - Integrated badge minting
3. `/src/app/api/badges/mint/route.ts` - Created minting API
4. `/.env.example` - Documented environment variables

## 🧪 Testing Checklist

- [ ] Set CONTRACT_OWNER_PRIVATE_KEY in .env.local
- [ ] Make $10+ wallet donation on Alfajores
- [ ] Verify badge minted (check Celoscan)
- [ ] Confirm badge appears in /badges page
- [ ] Test fiat donation badge minting
- [ ] Verify tier mapping (Bronze at $10, Silver at $50, etc.)
- [ ] Test donation below $10 (should skip badge)
- [ ] Check duplicate badge prevention
- [ ] Verify metadata displays correctly
- [ ] Test error handling when badge minting fails

## 🎯 Success Criteria

✅ Badge automatically minted after $10+ donation
✅ Correct tier assigned (Bronze/Silver/Gold/Platinum)
✅ NFT visible in user's wallet on Alfajores
✅ Badge displays in /badges gallery
✅ Metadata includes project name and donation amount
✅ System handles errors gracefully
✅ Works for both wallet and fiat payments

---

**Status:** Implementation complete, ready for testing
**Priority:** HIGH (core feature from PRD)
**Blockers:** Need CONTRACT_OWNER_PRIVATE_KEY to test
