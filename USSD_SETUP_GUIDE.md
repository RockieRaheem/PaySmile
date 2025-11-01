# 🇺🇬 USSD Testing Guide for Uganda (MTN/Airtel)

## 📱 Your Phone Numbers

- **MTN**: 0769440497 (will be +256769440497 in Africa's Talking)
- **Airtel**: 0704057370 (will be +256704057370 in Africa's Talking)

## ⚡ Quick Setup (5 Steps)

### Step 1: Get Your API Key

1. Go to https://account.africastalking.com/
2. Login to your account
3. Click on **"Settings"** → **"API Key"**
4. Click **"Generate"** if you don't have one
5. **Copy the API Key**

### Step 2: Update .env File

Open `server/.env` and replace `YOUR_API_KEY_HERE` with your actual API key:

```bash
AT_API_KEY=atsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Start Your Server

```bash
cd server
npm start
```

### Step 4: Expose Server with Ngrok

**Option A: Install ngrok (Recommended)**

```bash
# Download ngrok
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar -xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/

# Or just run directly
./ngrok http 4000
```

**Option B: Use localtunnel (Alternative)**

```bash
npm install -g localtunnel
lt --port 4000
```

**Option C: Use Cloudflare Tunnel (Alternative)**

```bash
# Install cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared
./cloudflared tunnel --url http://localhost:4000
```

You'll get a URL like: `https://abc123.ngrok.io`

### Step 5: Configure USSD Channel in Africa's Talking

Go back to https://account.africastalking.com/ussd/channels

Fill in the form:

```
Service Code: *384#
Channel: 123
Callback URL: https://abc123.ngrok.io/ussd  ← YOUR NGROK URL + /ussd
```

Click **"Create Channel"**

## 🧪 Testing on Your Phone

### Method 1: Use Sandbox Test Numbers (Immediate)

Africa's Talking provides test numbers that work instantly:

- Add `+254711082XXX` or `+254733XXXXXX` as test numbers in sandbox
- Dial `*384*123#` from these numbers
- You'll see the PaySmile menu!

### Method 2: Use Your Real MTN/Airtel Numbers (After Approval)

1. **Add your numbers to sandbox whitelist:**

   - Go to Settings → Phone Numbers
   - Add: `+256769440497` (MTN)
   - Add: `+256704057370` (Airtel)

2. **Request approval:**

   - In sandbox, you need to request live access
   - Or use the simulator for now

3. **Dial from your phone:**
   ```
   *384*123#
   ```

### Method 3: Use USSD Simulator (Best for Demo)

1. Go to https://simulator.africastalking.com/ussd
2. Enter:
   - **Service Code**: `*384*123#`
   - **Callback URL**: `https://abc123.ngrok.io/ussd`
   - **Phone Number**: `+256769440497`
3. Click **"Dial"**
4. Interact with the menu!

## 📞 What You'll See

When you dial `*384*123#`:

```
╔════════════════════════════════════╗
║  Murakaza neza kuri PaySmile 🇷🇼  ║
║                                    ║
║  1. Tanga Impano (Donate)         ║
║  2. Reba Imishinga (View Projects)║
║  3. Ingaruka Zanjye (My Impact)   ║
║  4. Ubufasha (Help)               ║
╚════════════════════════════════════╝
```

**Press 1** to donate:

```
╔════════════════════════════════════╗
║  Hitamo Umushinga:                ║
║                                    ║
║  1. Clean Water - Kigali [18%]    ║
║  2. School Desks - Musanze [21%]  ║
║  3. Solar Lights - Rubavu [18%]   ║
║  0. Gusubira (Back)               ║
╚════════════════════════════════════╝
```

**Press 1** again (Water project):

```
╔════════════════════════════════════╗
║  Clean Water - Kigali             ║
║  Water filtration systems          ║
║                                    ║
║  Intego: 2,500 RWF                ║
║  Byakusanyijwe: 450 RWF           ║
║                                    ║
║  Injiza amafaranga (RWF):         ║
║  (Min: 100, Max: 10,000)          ║
╚════════════════════════════════════╝
```

**Type 500** (donate 500 RWF):

```
╔════════════════════════════════════╗
║  Emeza Impano:                    ║
║                                    ║
║  Umushinga: Clean Water - Kigali  ║
║  Amafaranga: 500 RWF              ║
║  Kuzuza: 500 RWF (+0 RWF)         ║
║                                    ║
║  1. Emeza Impano (Confirm)        ║
║  2. Hindura Amafaranga (Change)   ║
║  0. Hagarika (Cancel)             ║
╚════════════════════════════════════╝
```

**Press 1** to confirm:

```
╔════════════════════════════════════╗
║  ✅ Impano Yatanzwe Neza!         ║
║                                    ║
║  Umushinga: Clean Water - Kigali  ║
║  Amafaranga: 500 RWF              ║
║  TX Hash: 0xabc123...             ║
║                                    ║
║  🏆 Icyiciro: Bronze Badge        ║
║  📱 SMS receipt yoherejwe         ║
║                                    ║
║  Murakoze cyane! 💚               ║
╚════════════════════════════════════╝
```

**You'll receive an SMS:**

```
PaySmile Receipt: Donated 500 RWF to Clean Water - Kigali
(Nyarugenge District). TX: 0xabc123... Badge: Bronze.
Visit: paysmile.rw
```

## 🔧 Troubleshooting

### "Cannot access callback URL"

- Make sure ngrok is running
- Check the URL is correct (should end with `/ussd`)
- Test manually: `curl -X POST https://abc123.ngrok.io/ussd -d "text=&phoneNumber=%2B256769440497"`

### "Invalid API Key"

- Double-check your API key in `.env`
- Regenerate key from dashboard if needed
- Restart server after updating `.env`

### "Phone number not allowed"

- You're in **sandbox mode** - only test numbers work
- Use the USSD simulator instead
- Or request production access to use real numbers

### "USSD code not working on phone"

**For Ugandan Numbers (MTN/Airtel):**

- Sandbox only allows Kenyan test numbers (+254)
- **Use the USSD Simulator** (best option for now)
- **Or** request live/production access from Africa's Talking
- **Or** deploy to production environment

## 🎥 Recording Demo Video

Since real phone testing requires approval, use the simulator:

1. **Open simulator**: https://simulator.africastalking.com/ussd
2. **Screen record** your entire flow
3. **Show**:

   - Main menu appearing
   - Selecting donate
   - Choosing project
   - Entering amount
   - Confirmation
   - Success message

4. **Add voiceover**: "This is PaySmile, the first blockchain donation platform that works on ANY phone through USSD..."

## 🚀 Going Live (After Hackathon)

To test with your real MTN/Airtel numbers:

1. **Apply for production access** in Africa's Talking
2. **Deploy server** to Railway/Render/Heroku
3. **Update callback URL** to production URL
4. **Add your numbers** to approved list
5. **Test with real phones!**

## 📞 Quick Test Commands

**Test locally:**

```bash
# Main menu
curl -X POST http://localhost:4000/test-ussd \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+256769440497", "text": ""}'

# Donate flow
curl -X POST http://localhost:4000/test-ussd \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+256769440497", "text": "1*1*500*1"}'
```

**Test with ngrok:**

```bash
curl -X POST https://abc123.ngrok.io/test-ussd \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+256769440497", "text": ""}'
```

## ✅ Checklist

- [ ] Got API key from Africa's Talking
- [ ] Updated `.env` file with API key
- [ ] Started server (`npm start`)
- [ ] Installed and started ngrok
- [ ] Created USSD channel with ngrok URL
- [ ] Tested with simulator
- [ ] Recorded demo video
- [ ] Ready to submit! 🎉

---

**Need help?** Ask me to:

1. Run the ngrok setup
2. Test the USSD flow
3. Help record the demo video
