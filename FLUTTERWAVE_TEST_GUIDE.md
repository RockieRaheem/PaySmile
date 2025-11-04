# Flutterwave Test Credentials & Instructions

## ✅ Working Test Credentials

### Public Key (Already in use)

```
FLWPUBK_TEST-aba29431664553b9abdd36a1c1532cd1-X
```

### Secret Key (Already in use)

```
FLWSECK_TEST-319c86860d595c1e14b7e58ce2130336-X
```

---

## 📱 Mobile Money Testing

### Test Phone Numbers for Mobile Money

#### For Rwanda (MTN/Airtel Rwanda)

- **Phone:** `+250780000000`
- **OTP:** `123456` (Any 6 digits work in test mode)

#### For Uganda (MTN/Airtel Uganda)

- **Phone:** `+256780000000`
- **OTP:** `123456` (Any 6 digits work in test mode)

#### For Ghana (MTN Ghana)

- **Phone:** `+233240000000`
- **OTP:** `123456` (Any 6 digits work in test mode)

### Important Notes for Mobile Money Testing

1. **Use Test Phone Numbers**: Always use the test phone numbers above
2. **OTP is Flexible**: In Flutterwave's test environment, any 6-digit code works (e.g., `123456`, `111111`, `000000`)
3. **Auto-Approval**: Test transactions may require manual approval in the Flutterwave dashboard
4. **Currency**: Must match the mobile money network (RWF for Rwanda, UGX for Uganda, GHS for Ghana)

---

## 💳 Card Testing

### Test Card Details

```
Card Number: 5531886652142950
CVV: 564
Expiry: 09/32
PIN: 3310
OTP: 12345
```

### Alternative Test Cards

```
Card Number: 4187427415564246
CVV: 828
Expiry: 09/32
```

---

## 🔧 How the Fixed System Works

### What Changed?

1. **Removed External Redirects**: No more captcha pages outside the app
2. **Inline Payment Modal**: Uses Flutterwave React component that stays in-app
3. **Works on Mobile & Desktop**: Seamless experience on all devices
4. **No iframe Issues**: Direct integration with Flutterwave's inline SDK

### Payment Flow

1. User fills donation form
2. Clicks "Pay with Mobile Money" or "Pay with Card"
3. Flutterwave modal opens **inside the app**
4. User completes payment in the modal
5. Modal closes and success screen shows
6. No external redirects, no captcha pages

---

## 🧪 Testing Instructions

### Test Mobile Money Donation

1. Open PaySmile
2. Click on a project to donate
3. Select **Mobile Money** payment method
4. Enter:
   - Amount: `1000` (minimum 100)
   - Currency: `RWF` or `UGX`
   - Name: `Test User`
   - Email: `test@example.com`
   - Phone: `+250780000000` (use test number)
5. Click "Pay with Mobile Money"
6. Flutterwave modal opens IN-APP
7. Follow the prompts (use any OTP like `123456`)
8. Payment succeeds or needs approval in dashboard

### Test Card Donation

1. Select **Card** payment method
2. Enter:
   - Card Number: `5531886652142950`
   - Expiry: `09/32`
   - CVV: `564`
3. Click "Pay with Card"
4. Complete the card authentication (PIN: `3310`, OTP: `12345`)
5. Success!

---

## ⚠️ Important Sandbox Behavior

### Why "Invalid OTP" Happened Before

- External redirect caused session loss
- Captcha verification failed outside app context
- Mobile browsers blocked the flow

### How It's Fixed Now

- Payment stays inside your app using React component
- No external redirects = no captcha issues
- Direct API integration with proper credentials

### Manual Approval May Be Needed

In Flutterwave's test environment, some transactions require manual approval:

1. Log into Flutterwave Dashboard
2. Go to "Transactions"
3. Find your test transaction
4. Click "Approve" to complete it

---

## 🚀 Production Checklist

Before going live:

1. Complete Flutterwave KYC verification
2. Replace TEST keys with LIVE keys
3. Update environment variables
4. Test with real small amounts first
5. Monitor webhook responses
6. Set up proper error logging

---

## 📞 Support

If you encounter issues:

- Check Flutterwave Dashboard for transaction status
- Verify keys are correct in `.env.local`
- Use test phone numbers provided above
- Any 6-digit OTP works in test mode
