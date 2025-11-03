# 🤖 Setting Up the AI Chatbot with Google Gemini

Follow these simple steps to enable the AI-powered chatbot in PaySmile:

## Step 1: Get Your Free Gemini API Key

1. Visit **https://makersuite.google.com/app/apikey** (or https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the generated API key

## Step 2: Add API Key to Your Project

1. In the PaySmile root directory, create a file named `.env.local` (if it doesn't exist)
2. Add this line to the file:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the API key you copied in Step 1.

## Step 3: Restart Your Development Server

If your dev server is already running:

```bash
# Stop the server (Ctrl+C)
# Then restart it
npm run dev
```

## Step 4: Test the Chatbot

1. Open your browser to `http://localhost:3000`
2. Look for the sparkles icon (✨) in the bottom-right corner
3. Click it to open the chat
4. Ask a question like "What is blockchain?"
5. The AI should respond in real-time!

## 🎉 You're Done!

The chatbot is now fully functional and will provide intelligent responses to user questions about:

- Blockchain technology
- How to use PaySmile
- Cryptocurrency and CELO
- Wallet setup and security
- Smart contracts
- And much more!

## 🔧 Troubleshooting

### "I'm not properly configured yet" error

- Make sure `.env.local` exists in the root directory
- Check that `GEMINI_API_KEY=` line is present with your actual key
- Restart the dev server after adding the key

### "API key invalid" error

- Verify your API key is correct (copy it again from Google AI Studio)
- Make sure there are no extra spaces before or after the key
- Try generating a new API key

### Chatbot not appearing

- Clear your browser cache
- Check browser console for errors (F12)
- Make sure the `<AIChatButton />` is in `layout.tsx`

## 💡 Tips

- **Free Tier**: Gemini API has a generous free tier (60 requests per minute)
- **Testing**: You can test without an API key by adding mock responses
- **Production**: Add your production domain to API key restrictions for security

## 📚 Learn More

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Get API Key](https://makersuite.google.com/app/apikey)
- [Rate Limits & Pricing](https://ai.google.dev/pricing)

---

Need help? The chatbot setup is complete and ready to assist your users! 🚀
