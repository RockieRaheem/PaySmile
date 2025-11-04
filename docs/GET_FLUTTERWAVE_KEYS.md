# 🔑 How to Get Your Flutterwave API Keys

## Problem

You're seeing "Failed to initialize payment" because the API keys in `.env.local` are placeholders, not your actual keys.

## Solution: Get Your Real API Keys

### Step 1: Login to Flutterwave Dashboard

Go to: https://app.flutterwave.com/dashboard

### Step 2: Navigate to Settings → API

1. Click on **Settings** (gear icon) in the left sidebar
2. Click on **API** or **API Keys**

### Step 3: Copy Your Keys

You'll see two keys:

**Public Key** (starts with `FLWPUBK_TEST-`)

```
Example: FLWPUBK_TEST-abc123def456ghi789jkl012mno345pqr-X
```

**Secret Key** (starts with `FLWSECK_TEST-`)

```
Example: FLWSECK_TEST-xyz789abc123def456ghi789jkl012mno-X
```

### Step 4: Update Your `.env.local` File

Replace the placeholder keys in `/home/anonymous-user/Desktop/PaySmile/.env.local`:

```env
# Replace these lines:
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-SANDBOXDEMOKEY-X
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-SANDBOXDEMOKEY-X

# With your actual keys:
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-actual-public-key-here-X
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your-actual-secret-key-here-X
```

**Keep the Encryption Key as is** - that one is correct!

### Step 5: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 6: Test Again

1. Go to http://localhost:9002/projects
2. Click "Donate" on any project
3. Select "Mobile Money / Card" tab
4. Fill in the form
5. Click "Donate"
6. You should now be redirected to Flutterwave's payment page!

---

## Screenshot Guide

Your Flutterwave dashboard should look like this:

```
Dashboard
├── Settings ⚙️
    ├── API Keys
        ├── 🔑 Public Key (FLWPUBK_TEST-...)  ← Copy this
        ├── 🔐 Secret Key (FLWSECK_TEST-...)  ← Copy this
        └── 🔒 Encryption Key (already have this)
```

---

## Verification

After updating the keys, you should see in the browser console:

```
✅ Initializing Flutterwave payment with payload
✅ Flutterwave response: success
```

Instead of:

```
❌ Flutterwave API error: Unauthorized
❌ Failed to initialize payment
```

---

## Still Having Issues?

### Issue 1: "Unauthorized" or "Invalid API Key"

- Double-check you copied the FULL key (they're long!)
- Make sure there are no extra spaces
- Ensure you're using TEST keys (FLWPUBK_TEST-...) not live keys

### Issue 2: Keys not found in dashboard

- Make sure your Flutterwave account is verified
- You might need to complete KYC first
- Contact Flutterwave support if keys don't appear

### Issue 3: Still getting 500 error

- Check terminal/console for specific error message
- Verify all three keys are set correctly
- Restart the dev server after changing .env.local

---

## Quick Copy Template

Open `.env.local` and update to:

```env
# Flutterwave Payment Gateway (Sandbox - for testing)
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
FLUTTERWAVE_SECRET_KEY=YOUR_SECRET_KEY_HERE
FLUTTERWAVE_ENCRYPTION_KEY=YfLKg/GYh9nVxn8IbAnsqUblCRDF0IEKoD65IDmU3MQ=
```

Replace `YOUR_PUBLIC_KEY_HERE` and `YOUR_SECRET_KEY_HERE` with the actual keys from your dashboard!

---

That's it! Once you have the correct keys, Mobile Money payments will work perfectly! 🎉
