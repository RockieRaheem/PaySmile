# PaySmile USSD Server Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Register Africa's Talking Account

1. Go to https://account.africastalking.com/auth/register
2. Sign up with your email
3. Verify your email
4. Navigate to "Launch Sandbox"

### Step 2: Get Your Credentials

1. In the sandbox, go to "Settings" → "API Key"
2. Generate your API Key
3. Copy your username (usually "sandbox" for testing)

### Step 3: Configure Environment

```bash
cd server
cp .env.example .env
nano .env  # or use any text editor
```

Update these values:

```
AT_USERNAME=sandbox
AT_API_KEY=your_api_key_from_step_2
AT_SHORTCODE=*384*123#
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Start Server

```bash
npm run dev
```

You should see:

```
╔═══════════════════════════════════════════╗
║   PaySmile USSD Server 🇷🇼               ║
║   Running on port 4000                    ║
║   USSD Code: *384*123#                    ║
║   Environment: development                ║
╚═══════════════════════════════════════════╝
```

## 📱 Testing USSD

### Option 1: Local Test (Immediate)

```bash
# Test main menu
curl -X POST http://localhost:4000/test-ussd \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+250788123456", "text": ""}'

# Test donate flow
curl -X POST http://localhost:4000/test-ussd \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+250788123456", "text": "1"}'

# Test project selection
curl -X POST http://localhost:4000/test-ussd \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+250788123456", "text": "1*1"}'

# Test amount entry
curl -X POST http://localhost:4000/test-ussd \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+250788123456", "text": "1*1*500"}'

# Test confirmation
curl -X POST http://localhost:4000/test-ussd \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+250788123456", "text": "1*1*500*1"}'
```

### Option 2: Africa's Talking Simulator (Better)

1. Go to https://simulator.africastalking.com/ussd
2. Enter your callback URL: `https://your-server.com/ussd`
3. Enter USSD code: `*384*123#`
4. Enter phone number: `+250788123456`
5. Click "Dial USSD"
6. Interact with the menu!

### Option 3: Real Phone Testing (Best for Demo)

1. **Deploy server to public URL** (use ngrok for testing):

   ```bash
   # Install ngrok
   npm install -g ngrok

   # Start your server
   npm run dev

   # In another terminal, expose it
   ngrok http 4000
   ```

2. **Configure callback URL in Africa's Talking**:

   - Go to sandbox dashboard
   - Navigate to "USSD" → "Create Channel"
   - Enter your ngrok URL + `/ussd` (e.g., `https://abc123.ngrok.io/ussd`)
   - Get assigned USSD code (e.g., `*384*123#`)

3. **Test on real button phone**:
   - Use sandbox numbers: `+254711082XXX` or `+254731111XXX`
   - Dial the USSD code
   - Follow the menu!

## 🇷🇼 USSD Menu Flow

```
*384*123#
    │
    ├─ 1. Tanga Impano (Donate)
    │    ├─ 1. Clean Water - Kigali
    │    ├─ 2. School Desks - Musanze
    │    └─ 3. Solar Lights - Rubavu
    │         └─ Enter Amount (RWF) → Confirm → Success + SMS
    │
    ├─ 2. Reba Imishinga (View Projects)
    │    └─ Shows all projects with funding progress
    │
    ├─ 3. Ingaruka Zanjye (My Impact)
    │    └─ Shows personal donation stats
    │
    └─ 4. Ubufasha (Help)
         └─ Help information and contact
```

## 📊 API Endpoints

### POST /ussd

Main USSD callback endpoint (used by Africa's Talking)

**Request:**

```json
{
  "sessionId": "ATUid_abc123",
  "serviceCode": "*384*123#",
  "phoneNumber": "+250788123456",
  "text": "1*1*500"
}
```

**Response:**

```
CON Emeza Impano:
Umushinga: Clean Water - Kigali
Amafaranga: 500 RWF
1. Emeza (Confirm)
2. Hindura (Change)
0. Hagarika (Cancel)
```

### POST /test-ussd

Local testing endpoint

**Request:**

```bash
curl -X POST http://localhost:4000/test-ussd \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+250788123456", "text": "1"}'
```

### GET /api/projects

Get Rwanda projects list

**Response:**

```json
{
  "success": true,
  "projects": [
    {
      "id": 1,
      "name": "Clean Water - Kigali",
      "location": "Nyarugenge District",
      "goal": 2500,
      "raised": 450,
      "description": "Water filtration systems"
    }
  ]
}
```

### GET /health

Health check

**Response:**

```json
{
  "status": "online",
  "service": "PaySmile USSD Server",
  "activeSessions": 3,
  "timestamp": "2025-11-01T10:30:00.000Z"
}
```

## 🎥 Creating Demo Video

### Script for Recording:

1. **Show Nokia Phone**:
   - Film a real button phone (Nokia 3310, any old phone)
2. **Dial USSD Code**:
   - Type: `*384*123#`
   - Press call button
3. **Navigate Menu**:
   - Show main menu appearing
   - Press "1" for Donate
   - Press "1" for Water Project
   - Type amount: "500"
   - Press "1" to confirm
4. **Show SMS Receipt**:
   - Film SMS arriving with donation confirmation
5. **Show Dashboard**:
   - Open PaySmile web app
   - Show donation appearing in transaction history
   - Show NFT badge earned

### Tips for Good Demo:

- Use macro lens or zoom in on phone screen
- Good lighting
- Slow, deliberate button presses
- Add captions explaining each step
- Keep video under 60 seconds

## 🔧 Troubleshooting

### "Connection refused"

- Server not running. Run `npm run dev`

### "Invalid API Key"

- Check `.env` file has correct `AT_API_KEY`
- Regenerate key from Africa's Talking dashboard

### "USSD code not working on real phone"

- Deploy to public URL (use ngrok)
- Register callback URL in Africa's Talking
- Use sandbox test numbers

### "SMS not sending"

- Sandbox has limited SMS. Buy credits for production
- Check phone number format: `+250XXXXXXXXX`

## 🚀 Production Deployment

### Deploy to Railway/Render/Heroku:

1. **Create account** on deployment platform

2. **Deploy server**:

   ```bash
   # Railway
   railway init
   railway up

   # Or use Git deployment
   git add .
   git commit -m "Add USSD server"
   git push
   ```

3. **Set environment variables** in dashboard

4. **Update Africa's Talking callback URL** to production URL

5. **Test with real phone!**

## 📞 Support

For issues:

- Africa's Talking Docs: https://developers.africastalking.com/docs
- PaySmile: support@paysmile.rw
- GitHub: https://github.com/RockieRaheem/PaySmile

---

**You're now ready to test USSD on button phones! 🎉🇷🇼**
