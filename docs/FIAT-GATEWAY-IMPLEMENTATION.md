# Fiat Payment Gateway Integration for PaySmile

## 🎯 Objective

Allow users to donate using traditional currencies (USD, RWF, UGX, etc.) without needing crypto wallets or blockchain knowledge. The system handles crypto conversion automatically.

## 🏗️ Architecture Overview

### Flow Diagram

```
User → Fiat Payment → PaySmile Backend → Crypto Conversion → Smart Contract → Project Funding
  ↓
Mobile Money/Card → Flutterwave/MoMo API → Track in Database → Auto-convert to CELO → DonationPool SC
```

### Key Components

1. **Frontend: Dual Payment Options**

   - "Pay with Crypto" (existing MetaMask flow)
   - "Pay with Mobile Money / Card" (NEW - no wallet needed)

2. **Payment Processors**

   - **Flutterwave**: Pan-African payments (Mobile Money, Cards, Bank Transfer)
   - **MoMo API**: MTN Mobile Money, Orange Money
   - **Stripe**: International cards, Apple Pay, Google Pay

3. **Backend Service Pool**

   - Central wallet managed by PaySmile
   - Tracks fiat donations with project identifiers
   - Automatic crypto conversion and distribution
   - Transparent ledger for accountability

4. **Database Schema**

   ```sql
   donations {
     id: UUID
     donor_email: string
     donor_name: string
     amount: decimal
     currency: string (RWF, USD, UGX, etc.)
     project_id: number
     payment_method: string (mobile_money, card, crypto)
     payment_status: enum (pending, completed, failed)
     transaction_ref: string
     crypto_tx_hash: string (after conversion)
     created_at: timestamp
   }

   project_pool_balance {
     project_id: number
     pending_fiat: decimal (waiting conversion)
     converted_crypto: decimal (CELO)
     distributed_to_contract: decimal
     last_distribution: timestamp
   }
   ```

## 📋 Implementation Plan

### Phase 1: Payment Gateway Integration (Week 1-2)

#### Step 1.1: Choose Payment Provider

**Recommendation: Flutterwave (Best for Africa)**

**Why Flutterwave?**

- ✅ Supports Mobile Money (MTN, Airtel, Orange)
- ✅ Cards (Visa, Mastercard)
- ✅ Bank transfers
- ✅ Multi-currency (RWF, UGX, KES, USD, etc.)
- ✅ Lower fees for African transactions
- ✅ Easy integration with Node.js

**Alternatives:**

- **Paystack**: Good for Nigeria, Kenya, Ghana
- **Stripe**: Best for international cards, higher fees in Africa

#### Step 1.2: Backend API Routes

**File: `src/app/api/donations/fiat/route.ts`**

```typescript
// Initialize fiat donation
POST /api/donations/fiat
{
  amount: number,
  currency: "RWF" | "USD" | "UGX",
  projectId: number,
  donorEmail: string,
  donorName: string,
  paymentMethod: "mobile_money" | "card"
}

Response: {
  paymentUrl: string,  // Redirect user here
  transactionRef: string
}
```

**File: `src/app/api/donations/webhook/route.ts`**

```typescript
// Flutterwave webhook for payment confirmation
POST / api / donations / webhook;
// Automatically called when payment succeeds
// Updates database, triggers crypto conversion
```

**File: `src/app/api/donations/convert/route.ts`**

```typescript
// Batch conversion job (runs every hour or when threshold met)
POST / api / donations / convert;
// Converts accumulated fiat to CELO
// Distributes to smart contract per project
```

#### Step 1.3: Frontend Component

**File: `src/components/FiatDonationModal.tsx`**

```tsx
- Shows both payment options side-by-side
- "Pay with Wallet" → Existing MetaMask flow
- "Pay with Mobile Money/Card" → NEW flow
  - Amount input
  - Currency selector (RWF, USD, UGX)
  - Email for receipt
  - Payment method (Mobile Money, Card)
  - Submit → Redirect to Flutterwave
```

### Phase 2: Crypto Conversion Service (Week 2-3)

#### Option A: Use Crypto Exchange API

**Services:**

- **Binance API**: Convert fiat → CELO
- **Coinbase Commerce**: Accept fiat, receive crypto
- **Changelly**: Instant crypto conversion

#### Option B: Manual Conversion (Simpler Start)

1. Accumulate fiat donations in bank account
2. Weekly/monthly: Manually buy CELO on exchange
3. Distribute to smart contract per project allocation
4. Update database with transaction hashes

**Recommendation:** Start with Option B for MVP, automate later

### Phase 3: Database & Tracking (Week 3)

#### Setup Firestore Collections

**Collection: `fiat_donations`**

```javascript
{
  id: "auto-generated",
  donorEmail: "user@example.com",
  donorName: "John Doe",
  amount: 10000,  // 10,000 RWF
  currency: "RWF",
  projectId: 1,
  projectName: "Clean Water Access",
  paymentMethod: "mobile_money",
  paymentProvider: "flutterwave",
  transactionRef: "FLW-123456",
  paymentStatus: "completed",
  cryptoTxHash: null,  // Filled after conversion
  cryptoAmount: null,
  conversionRate: null,
  createdAt: Timestamp,
  convertedAt: null,
  distributedAt: null
}
```

**Collection: `project_pools`**

```javascript
{
  projectId: 1,
  pendingFiatRWF: 50000,  // 50k RWF waiting conversion
  pendingFiatUSD: 100,
  convertedCELO: 25.5,  // Converted but not yet distributed
  distributedCELO: 120.3,  // Already sent to smart contract
  lastConversion: Timestamp,
  lastDistribution: Timestamp
}
```

### Phase 4: Smart Contract Updates (Week 4)

**Update DonationPool.sol**

```solidity
// Add function for PaySmile admin to batch donate on behalf of fiat donors
function batchDonateOnBehalf(
    uint256[] memory projectIds,
    uint256[] memory amounts,
    address[] memory donors,
    string[] memory txRefs
) external payable onlyOwner {
    require(msg.value == sum(amounts), "Incorrect total");

    for (uint i = 0; i < projectIds.length; i++) {
        // Record donation with original donor info
        _recordDonation(projectIds[i], amounts[i], donors[i], txRefs[i]);
    }
}
```

## 💳 Payment Provider Setup

### Flutterwave Integration

#### 1. Create Account

- Sign up: https://flutterwave.com/
- Get API keys (Test & Live)
- Add webhook URL

#### 2. Install SDK

```bash
npm install flutterwave-node-v3
```

#### 3. Environment Variables

```env
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxx
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TEST-xxx
FLUTTERWAVE_WEBHOOK_SECRET=your-webhook-secret

PAYSMILE_WALLET_ADDRESS=0x... # Central collection wallet
PAYSMILE_WALLET_PRIVATE_KEY=xxx # For auto-conversion
```

#### 4. Sample Code

```typescript
// Initialize payment
const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(PUBLIC_KEY, SECRET_KEY);

const payload = {
  tx_ref: `PAYSMILE-${Date.now()}`,
  amount: amount,
  currency: currency,
  redirect_url: "https://paysmile.app/donation-success",
  customer: {
    email: donorEmail,
    name: donorName,
  },
  customizations: {
    title: `Donation to ${projectName}`,
    description: "PaySmile Charitable Donation",
  },
};

const response = await flw.Charge.card(payload);
// Redirect user to response.meta.authorization.redirect
```

## 🔐 Security Considerations

1. **Webhook Verification**

   - Verify Flutterwave signature on webhooks
   - Prevent replay attacks

2. **Database Security**

   - Hash sensitive donor info
   - Encrypt payment credentials
   - Regular backups

3. **Wallet Security**

   - Use hardware wallet for central pool
   - Multi-sig wallet (3-of-5 approval)
   - Regular audits

4. **Compliance**
   - KYC/AML for large donations
   - Tax receipts for donors
   - Transparent reporting

## 📊 User Experience Flow

### Scenario: User wants to donate 10,000 RWF

1. **User visits project page**

   - Sees "Donate" button

2. **Clicks Donate → Modal opens**

   - Two tabs: "Crypto Wallet" | "Mobile Money/Card"
   - User selects "Mobile Money/Card"

3. **Fills donation form**

   - Amount: 10,000 RWF
   - Email: user@example.com
   - Name: John Doe
   - Payment: MTN Mobile Money

4. **Clicks "Donate Now"**

   - Backend creates donation record
   - Redirects to Flutterwave payment page

5. **User completes payment**

   - Enters phone number
   - Receives MTN prompt
   - Approves payment

6. **Payment confirmed**

   - Webhook updates database
   - User redirected to success page
   - Email receipt sent

7. **Behind the scenes (hourly job)**

   - System accumulates fiat donations
   - Converts to CELO weekly
   - Distributes to project smart contract
   - Updates blockchain records
   - User can see their donation on-chain

8. **User dashboard shows**
   - "Your 10,000 RWF donation is being processed"
   - "Converted to 5.2 CELO" (after conversion)
   - "Distributed to Clean Water Project" (after on-chain)
   - Transaction hash link

## 💰 Fee Structure

### Flutterwave Fees (Rwanda)

- Mobile Money: 1.4% + 25 RWF
- Cards: 3.8%
- Bank Transfer: 1.4%

### PaySmile Fee Options

**Option 1: Transparent (Recommended)**

- Show user: "Donate 10,000 RWF (350 RWF payment fee)"
- User pays: 10,350 RWF
- Project receives: 10,000 RWF worth of CELO

**Option 2: Absorb Costs**

- User donates: 10,000 RWF
- PaySmile covers: 350 RWF fee
- Project receives: 10,000 RWF worth of CELO
- (Better UX, costs PaySmile)

## 📈 Benefits

### For Users

✅ No wallet needed
✅ No blockchain knowledge required
✅ Use familiar payment methods
✅ Mobile Money widely available in Africa
✅ Instant payment confirmation
✅ Email receipts

### For Projects

✅ Access to non-crypto donors (90% of population)
✅ Higher donation volume
✅ Still benefit from blockchain transparency
✅ Automatic conversion handled

### For PaySmile

✅ Lower barrier to entry
✅ Broader market reach
✅ Still on-chain for transparency
✅ Competitive advantage

## 🚀 MVP Implementation (2 weeks)

### Week 1: Frontend & Flutterwave

- [ ] Create Flutterwave account
- [ ] Add payment modal component
- [ ] Integrate Flutterwave checkout
- [ ] Test with test credentials

### Week 2: Backend & Database

- [ ] Create donation API routes
- [ ] Setup Firestore collections
- [ ] Implement webhook handler
- [ ] Create admin dashboard for conversions

### Week 3: Testing & Launch

- [ ] Test full flow with real money (small amounts)
- [ ] Setup monitoring and alerts
- [ ] Document process for team
- [ ] Soft launch with one project

## 📱 Mobile Money Providers Supported

### Rwanda

- MTN Mobile Money
- Airtel Money
- Bank cards

### Uganda

- MTN Mobile Money
- Airtel Money

### Kenya

- M-Pesa
- Airtel Money

### International

- Visa, Mastercard
- PayPal (via Flutterwave)

## 🔄 Conversion Strategy

### Automated Approach (Future)

```typescript
// Cron job runs daily at 2 AM
async function convertAndDistribute() {
  // 1. Get all pending fiat donations
  const pending = await getPendingDonations();

  // 2. Group by project
  const byProject = groupByProject(pending);

  // 3. Convert fiat to CELO (via Binance API)
  const celoAmounts = await convertToCELO(byProject);

  // 4. Distribute to smart contract
  await batchDonateOnBehalf(byProject, celoAmounts);

  // 5. Update database with tx hashes
  await updateDonationRecords(txHashes);

  // 6. Send confirmation emails
  await sendDonorEmails(pending);
}
```

### Manual Approach (MVP)

1. Weekly: Export fiat donations from database
2. Buy CELO manually on Binance/Coinbase
3. Use admin interface to batch donate
4. Update database with transaction hashes

## ✅ Success Metrics

- **Adoption Rate**: % of fiat vs crypto donations
- **Conversion Time**: Hours from fiat payment to on-chain
- **Failed Payments**: Should be <2%
- **User Satisfaction**: NPS score >50
- **Volume**: 10x increase in donation volume

## 🎓 Next Steps

1. **Review this plan** and decide on payment provider
2. **Create Flutterwave account** (or preferred provider)
3. **Implement frontend** modal with dual payment options
4. **Build backend** API routes for fiat donations
5. **Test thoroughly** with small amounts
6. **Launch gradually** with beta users

---

**This implementation removes ALL blockchain barriers while maintaining transparency through eventual on-chain recording!** 🎉
