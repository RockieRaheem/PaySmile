#!/bin/bash
# PaySmile Sepolia Deployment Script
# Run this after funding your wallet with Sepolia ETH

echo "🚀 PaySmile Sepolia Deployment"
echo "================================"
echo ""

# Check if wallet is funded
echo "📋 Step 1: Checking wallet balance..."
npx hardhat run scripts/verify-sepolia-setup.js --network sepolia
echo ""

read -p "⚠️  Does your wallet have Sepolia ETH? (y/n): " has_funds

if [ "$has_funds" != "y" ]; then
    echo ""
    echo "❌ Please fund your wallet first!"
    echo "   Address: 0x96a634eFff3C5c84cEa0520DF60BA5c296c6596c"
    echo ""
    echo "   Faucet options:"
    echo "   - https://sepoliafaucet.com/"
    echo "   - https://faucet.sepolia.dev/"
    echo "   - https://www.alchemy.com/faucets/ethereum-sepolia"
    echo ""
    exit 1
fi

echo ""
echo "📋 Step 2: Deploying contracts to Sepolia..."
npx hardhat run scripts/deploy.js --network sepolia

echo ""
echo "📋 Step 3: Update .env.local with the deployed contract addresses above"
echo ""
echo "📋 Step 4: Optionally add Rwanda projects to the contract:"
echo "   npx hardhat run scripts/add-rwanda-projects.js --network sepolia"
echo ""
echo "✅ Deployment complete!"
