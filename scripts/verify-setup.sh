#!/bin/bash

# PaySmile Setup Verification Script
# This script checks if all components are properly configured

echo "🔍 PaySmile Setup Verification"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for passed/failed checks
PASSED=0
FAILED=0

# Function to print success
success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

# Function to print error
error() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED++))
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "1️⃣  Checking Environment Files..."
echo "-----------------------------------"

# Check .env.local exists
if [ -f ".env.local" ]; then
    success ".env.local file exists"
    
    # Check required variables
    if grep -q "NEXT_PUBLIC_CHAIN_ID=31337" .env.local; then
        success "NEXT_PUBLIC_CHAIN_ID is set to 31337 (localhost)"
    else
        error "NEXT_PUBLIC_CHAIN_ID not set correctly"
    fi
    
    if grep -q "NEXT_PUBLIC_DONATION_POOL_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3" .env.local; then
        success "DonationPool address matches deployment"
    else
        error "DonationPool address doesn't match deployment"
    fi
    
    if grep -q "NEXT_PUBLIC_SMILE_BADGE_NFT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" .env.local; then
        success "SmileBadgeNFT address matches deployment"
    else
        error "SmileBadgeNFT address doesn't match deployment"
    fi
else
    error ".env.local file not found"
fi

echo ""
echo "2️⃣  Checking Deployment Files..."
echo "-----------------------------------"

# Check deployment file exists
if [ -f "deployments/localhost-deployment.json" ]; then
    success "Deployment file exists"
    
    # Extract addresses from deployment file
    POOL_ADDR=$(grep -o '"address": "0x[a-fA-F0-9]*"' deployments/localhost-deployment.json | head -1 | cut -d'"' -f4)
    NFT_ADDR=$(grep -o '"address": "0x[a-fA-F0-9]*"' deployments/localhost-deployment.json | tail -1 | cut -d'"' -f4)
    
    echo "   DonationPool: $POOL_ADDR"
    echo "   SmileBadgeNFT: $NFT_ADDR"
else
    error "Deployment file not found"
    warning "Run: npx hardhat run scripts/deploy.js --network localhost"
fi

echo ""
echo "3️⃣  Checking Hardhat Node..."
echo "-----------------------------------"

# Check if Hardhat node is running
if curl -s -X POST http://127.0.0.1:8545 \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' | grep -q "0x7a69"; then
    success "Hardhat node is running on http://127.0.0.1:8545"
    success "Chain ID: 31337 (0x7a69)"
else
    error "Hardhat node is not running"
    warning "Start with: npx hardhat node"
fi

echo ""
echo "4️⃣  Checking Next.js Dev Server..."
echo "-----------------------------------"

# Check if dev server is running
if curl -s http://localhost:9002 > /dev/null 2>&1; then
    success "Next.js dev server is running on http://localhost:9002"
else
    warning "Next.js dev server is not running"
    warning "Start with: npm run dev"
fi

echo ""
echo "5️⃣  Checking Smart Contracts..."
echo "-----------------------------------"

# Check contract files exist
if [ -f "contracts/DonationPool.sol" ]; then
    success "DonationPool.sol exists"
else
    error "DonationPool.sol not found"
fi

if [ -f "contracts/SmileBadgeNFT.sol" ]; then
    success "SmileBadgeNFT.sol exists"
else
    error "SmileBadgeNFT.sol not found"
fi

# Check if contracts are compiled
if [ -d "artifacts/contracts" ]; then
    success "Contracts are compiled"
else
    warning "Contracts not compiled. Run: npx hardhat compile"
fi

echo ""
echo "6️⃣  Checking Frontend Configuration..."
echo "-----------------------------------"

# Check key frontend files
if [ -f "src/hooks/use-contracts.ts" ]; then
    success "Custom hooks file exists"
else
    error "use-contracts.ts not found"
fi

if [ -f "src/components/NetworkChecker.tsx" ]; then
    success "NetworkChecker component exists"
else
    error "NetworkChecker.tsx not found"
fi

if [ -f "src/components/WagmiProvider.tsx" ]; then
    success "WagmiProvider exists"
else
    error "WagmiProvider.tsx not found"
fi

echo ""
echo "7️⃣  Checking Documentation..."
echo "-----------------------------------"

if [ -f "METAMASK_SETUP.md" ]; then
    success "MetaMask setup guide exists"
else
    warning "METAMASK_SETUP.md not found"
fi

if [ -f "docs/END_TO_END_TESTING.md" ]; then
    success "Testing guide exists"
else
    warning "Testing guide not found"
fi

if [ -f "docs/NETWORK_FIX.md" ]; then
    success "Network troubleshooting guide exists"
else
    warning "Network fix guide not found"
fi

echo ""
echo "================================"
echo "📊 Verification Summary"
echo "================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Your PaySmile setup is complete!${NC}"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Open MetaMask and add Hardhat Localhost network"
    echo "   2. Import test account: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    echo "   3. Switch MetaMask to Hardhat Localhost"
    echo "   4. Visit http://localhost:9002/dashboard"
    echo "   5. Follow docs/END_TO_END_TESTING.md for full testing"
    echo ""
    echo "📖 See METAMASK_SETUP.md for detailed MetaMask configuration"
else
    echo -e "${RED}⚠️  Some checks failed. Please review the errors above.${NC}"
    echo ""
    echo "Common fixes:"
    echo "   - Start Hardhat node: npx hardhat node"
    echo "   - Deploy contracts: npx hardhat run scripts/deploy.js --network localhost"
    echo "   - Start dev server: npm run dev"
    echo ""
fi

echo "================================"
