#!/bin/bash

# PaySmile Local Testing - Complete Guide
# Run this script and follow the instructions to test your app

clear
echo "🎉 PaySmile Local Testing Guide"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Check if services are running
echo -e "${BLUE}📋 Checking Current Status...${NC}"
echo ""

# Check Hardhat node
if curl -s -X POST http://127.0.0.1:8545 \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' | grep -q "0x7a69"; then
    echo -e "${GREEN}✅ Hardhat node is running${NC}"
    HARDHAT_RUNNING=true
else
    echo -e "${YELLOW}⚠️  Hardhat node is NOT running${NC}"
    HARDHAT_RUNNING=false
fi

# Check dev server
if curl -s http://localhost:9002 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Next.js dev server is running${NC}"
    DEV_SERVER_RUNNING=true
else
    echo -e "${YELLOW}⚠️  Next.js dev server is NOT running${NC}"
    DEV_SERVER_RUNNING=false
fi

echo ""
echo "=================================="
echo ""

# If services are not running, provide instructions
if [ "$HARDHAT_RUNNING" = false ] || [ "$DEV_SERVER_RUNNING" = false ]; then
    echo -e "${YELLOW}⚠️  Some services are not running. Let me help you start them!${NC}"
    echo ""
    
    if [ "$HARDHAT_RUNNING" = false ]; then
        echo -e "${CYAN}Starting Hardhat node in the background...${NC}"
        npx hardhat node > hardhat-node.log 2>&1 &
        HARDHAT_PID=$!
        echo "   PID: $HARDHAT_PID"
        echo "   Waiting 3 seconds for startup..."
        sleep 3
        echo -e "${GREEN}✅ Hardhat node started${NC}"
        echo ""
    fi
    
    if [ "$DEV_SERVER_RUNNING" = false ]; then
        echo -e "${CYAN}Starting Next.js dev server in the background...${NC}"
        npm run dev > dev-server.log 2>&1 &
        DEV_PID=$!
        echo "   PID: $DEV_PID"
        echo "   Waiting 5 seconds for startup..."
        sleep 5
        echo -e "${GREEN}✅ Dev server started${NC}"
        echo ""
    fi
    
    echo "=================================="
    echo ""
fi

# Display testing instructions
echo -e "${BOLD}🚀 READY FOR TESTING!${NC}"
echo ""
echo "Your PaySmile app is running and ready to test."
echo ""

echo -e "${BOLD}📍 CONTRACT ADDRESSES:${NC}"
echo "   DonationPool:  0x5FbDB2315678afecb367f032d93F642f64180aa3"
echo "   SmileBadgeNFT: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
echo ""

echo -e "${BOLD}🔑 TEST ACCOUNT:${NC}"
echo "   Address:     0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
echo "   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
echo "   Balance:     10,000 ETH"
echo ""

echo -e "${BOLD}🌐 METAMASK NETWORK SETTINGS:${NC}"
echo "   Network Name: Hardhat Localhost"
echo "   RPC URL:      http://127.0.0.1:8545"
echo "   Chain ID:     31337"
echo "   Currency:     ETH"
echo ""

echo "=================================="
echo ""
echo -e "${BOLD}${CYAN}📝 STEP-BY-STEP TESTING:${NC}"
echo ""

echo -e "${BOLD}Step 1: Configure MetaMask (First Time Only)${NC}"
echo "   1. Open MetaMask extension"
echo "   2. Click network dropdown → 'Add network'"
echo "   3. Enter the network settings above"
echo "   4. Click 'Import Account' → 'Private Key'"
echo "   5. Paste the private key above"
echo "   6. Switch to 'Hardhat Localhost' network"
echo ""
echo "   💡 Detailed guide: METAMASK_SETUP.md"
echo ""

echo -e "${BOLD}Step 2: Open the Application${NC}"
echo "   🌐 Open browser: ${CYAN}http://localhost:9002${NC}"
echo ""

echo -e "${BOLD}Step 3: Connect Wallet${NC}"
echo "   1. Click 'Connect Wallet' button"
echo "   2. Select MetaMask"
echo "   3. Approve connection"
echo "   ✅ You should be redirected to dashboard"
echo ""

echo -e "${BOLD}Step 4: View Dashboard${NC}"
echo "   🌐 URL: ${CYAN}http://localhost:9002/dashboard${NC}"
echo "   ✅ Should show:"
echo "      - Your address (0xf39F...2266)"
echo "      - Total Donations: 0 ETH"
echo "      - 3 Active Projects"
echo "      - No 'Wrong Network' alerts"
echo ""

echo -e "${BOLD}Step 5: View Projects${NC}"
echo "   🌐 URL: ${CYAN}http://localhost:9002/projects${NC}"
echo "   ✅ Should show 3 projects:"
echo "      - Clean Water for Kampala (100 ETH goal)"
echo "      - School Supplies Drive (50 ETH goal)"
echo "      - Tree Planting Initiative (75 ETH goal)"
echo ""

echo -e "${BOLD}Step 6: Vote on a Project${NC}"
echo "   1. Click 'Vote' button on any project"
echo "   2. Approve transaction in MetaMask"
echo "   3. Wait 1-2 seconds"
echo "   ✅ Vote count should increase"
echo "   ✅ Button should show 'Voted ✓'"
echo ""

echo -e "${BOLD}Step 7: Test Donation (Optional)${NC}"
echo "   Run in another terminal:"
echo "   ${CYAN}npx hardhat console --network localhost${NC}"
echo ""
echo "   Then execute:"
echo "   ${CYAN}const pool = await ethers.getContractAt('DonationPool', '0x5FbDB2315678afecb367f032d93F642f64180aa3');${NC}"
echo "   ${CYAN}await pool.donateToProject(0, {value: ethers.parseEther('1')});${NC}"
echo ""
echo "   Refresh dashboard:"
echo "   ✅ Total Donations should show 1 ETH"
echo "   ✅ Project progress bar should update"
echo ""

echo "=================================="
echo ""
echo -e "${BOLD}📚 HELPFUL RESOURCES:${NC}"
echo ""
echo "   📖 Quick Reference:     QUICK_REFERENCE.md"
echo "   📖 MetaMask Setup:      METAMASK_SETUP.md"
echo "   📖 Full Testing Guide:  docs/END_TO_END_TESTING.md"
echo "   📖 Troubleshooting:     docs/NETWORK_FIX.md"
echo "   📖 Deployment Summary:  docs/DEPLOYMENT_COMPLETE.md"
echo ""

echo "=================================="
echo ""
echo -e "${BOLD}🐛 COMMON ISSUES:${NC}"
echo ""
echo "   ${YELLOW}Red 'Wrong Network' alert?${NC}"
echo "   → Click 'Switch to Hardhat Localhost' button"
echo ""
echo "   ${YELLOW}Connection refused errors?${NC}"
echo "   → Run: npx hardhat node"
echo ""
echo "   ${YELLOW}Projects not loading?${NC}"
echo "   → Re-deploy: npx hardhat run scripts/deploy.js --network localhost"
echo ""
echo "   ${YELLOW}Transaction fails?${NC}"
echo "   → Check MetaMask is on Chain ID 31337"
echo ""

echo "=================================="
echo ""
echo -e "${GREEN}${BOLD}✨ Ready to test! Open http://localhost:9002 in your browser${NC}"
echo ""

# Ask if user wants to open browser
read -p "Open browser now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Opening browser..."
    if command -v xdg-open > /dev/null; then
        xdg-open http://localhost:9002
    elif command -v open > /dev/null; then
        open http://localhost:9002
    else
        echo "Please manually open: http://localhost:9002"
    fi
fi

echo ""
echo -e "${GREEN}Happy Testing! 🎉${NC}"
echo ""
