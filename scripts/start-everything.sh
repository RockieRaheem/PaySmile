#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    🚀 Starting PaySmile Local Development Environment${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

# Start Hardhat node in background
echo -e "${YELLOW}📦 Starting Hardhat blockchain...${NC}"
npx hardhat node > /tmp/hardhat.log 2>&1 &
HARDHAT_PID=$!
echo -e "${GREEN}✅ Hardhat node started (PID: $HARDHAT_PID)${NC}"

# Wait for Hardhat to be ready
echo -e "${YELLOW}⏳ Waiting for blockchain to be ready...${NC}"
sleep 5

# Deploy contracts
echo -e "\n${YELLOW}📝 Deploying smart contracts...${NC}"
npx hardhat run scripts/deploy.js --network localhost

# Start Next.js dev server in background
echo -e "\n${YELLOW}🌐 Starting Next.js development server...${NC}"
npm run dev > /tmp/nextjs.log 2>&1 &
NEXTJS_PID=$!
echo -e "${GREEN}✅ Next.js server started (PID: $NEXTJS_PID)${NC}"

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ All services started successfully!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "\n${YELLOW}📍 Access your app at:${NC} http://localhost:9002"
echo -e "${YELLOW}🔗 Blockchain RPC:${NC} http://127.0.0.1:8545"
echo -e "\n${YELLOW}📋 Process IDs:${NC}"
echo -e "   Hardhat: $HARDHAT_PID"
echo -e "   Next.js: $NEXTJS_PID"
echo -e "\n${YELLOW}💡 To stop services:${NC}"
echo -e "   kill $HARDHAT_PID $NEXTJS_PID"
echo -e "\n${YELLOW}📊 View logs:${NC}"
echo -e "   Hardhat: tail -f /tmp/hardhat.log"
echo -e "   Next.js: tail -f /tmp/nextjs.log"
echo -e "\n${GREEN}Press Ctrl+C to continue...${NC}\n"

# Keep script running
tail -f /dev/null
