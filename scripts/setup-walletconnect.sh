#!/bin/bash

# WalletConnect Setup Script for PaySmile
# This script helps you set up native wallet connections

echo "🎉 PaySmile - WalletConnect Setup"
echo "=================================="
echo ""

echo "📱 Native wallet connections are now enabled!"
echo ""
echo "Your wallet apps (TrustWallet, Valora, MetaMask) will now open"
echo "NATIVELY in the system instead of browser tabs."
echo ""

echo "⚠️  IMPORTANT: You need a WalletConnect Project ID"
echo ""
echo "Don't worry - it's FREE and takes 2 minutes!"
echo ""

echo "📝 Steps to get your Project ID:"
echo ""
echo "1. Go to: https://cloud.walletconnect.com"
echo "2. Click 'Sign Up' (use GitHub or email)"
echo "3. Create a new project:"
echo "   - Name: PaySmile"
echo "   - Description: Round up donations for African communities"
echo "4. Copy your Project ID (looks like: 1a2b3c4d5e6f...)"
echo ""

echo "5. Update .env.local:"
echo "   Replace 'demo-project-id-replace-me' with your real ID"
echo ""

echo "🔍 Current .env.local status:"
if grep -q "demo-project-id-replace-me" .env.local; then
  echo "   ⚠️  Still using demo ID - please update!"
  echo ""
  echo "   Run this to edit:"
  echo "   nano .env.local"
else
  echo "   ✅ Project ID configured!"
fi

echo ""
echo "🧪 Test it:"
echo "   npm run dev"
echo "   Open http://localhost:9002/connect"
echo "   Click 'WalletConnect' button"
echo "   Your wallet app should open automatically!"
echo ""

echo "📚 Full guide: docs/WALLET_CONNECTION_GUIDE.md"
echo ""
echo "✨ Benefits of native wallet connections:"
echo "   ✅ No browser tabs opening"
echo "   ✅ Better mobile UX (90% of Africa uses mobile)"
echo "   ✅ Faster, smoother connection"
echo "   ✅ Works with TrustWallet, Valora, MetaMask, etc."
echo "   ✅ QR codes for desktop users"
echo ""

echo "🚀 Ready to test? Press Enter to open WalletConnect setup..."
read -p ""

# Try to open browser
if command -v xdg-open &> /dev/null; then
  xdg-open "https://cloud.walletconnect.com" 2>/dev/null
elif command -v open &> /dev/null; then
  open "https://cloud.walletconnect.com" 2>/dev/null
else
  echo "Please manually open: https://cloud.walletconnect.com"
fi

echo ""
echo "After you get your Project ID:"
echo "1. Open .env.local"
echo "2. Replace 'demo-project-id-replace-me' with your ID"
echo "3. Restart the dev server: npm run dev"
echo ""
echo "✅ Done! Your wallet connections are now native! 🎉"
