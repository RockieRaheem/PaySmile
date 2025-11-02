#!/bin/bash

# USSD Flow Testing Script
# Tests all menu navigation paths

BASE_URL="http://localhost:4000/test-ussd"
PHONE="+250788123456"

echo "🧪 PaySmile USSD Comprehensive Navigation Test"
echo "==============================================="
echo ""

# Test 1: Language Selection
echo "✓ TEST 1: Initial Language Selection"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"\"}" | head -5
echo ""
echo ""

# Test 2: English Main Menu
echo "✓ TEST 2: English Main Menu"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"1\"}" | head -7
echo ""
echo ""

# Test 3: View Projects
echo "✓ TEST 3: View Projects (from Main Menu)"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"1*2\"}" | head -20
echo ""
echo ""

# Test 4: Back from View Projects
echo "✓ TEST 4: Back from View Projects (Press 0)"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"1*2*0\"}" | head -7
echo ""
echo ""

# Test 5: My Impact
echo "✓ TEST 5: My Impact (from Main Menu)"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"1*3\"}" | head -12
echo ""
echo ""

# Test 6: Back from My Impact
echo "✓ TEST 6: Back from My Impact (Press 0)"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"1*3*0\"}" | head -7
echo ""
echo ""

# Test 7: Help
echo "✓ TEST 7: Help (from Main Menu)"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"1*4\"}" | head -15
echo ""
echo ""

# Test 8: Back from Help
echo "✓ TEST 8: Back from Help (Press 0)"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"1*4*0\"}" | head -7
echo ""
echo ""

# Test 9: Donate - Project Selection
echo "✓ TEST 9: Donate - Project Selection"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"1*1\"}" | head -12
echo ""
echo ""

# Test 10: Select Project 1
echo "✓ TEST 10: Select Water Project"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"1*1*1\"}" | head -12
echo ""
echo ""

# Test 11: Enter Amount
echo "✓ TEST 11: Enter Amount (500 RWF)"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"1*1*1*500\"}" | head -10
echo ""
echo ""

# Test 12: Back from Amount Entry
echo "✓ TEST 12: Back from Amount (Press 0)"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"1*1*1*500*0\"}" | head -12
echo ""
echo ""

# Test 13: Main Menu from anywhere (00)
echo "✓ TEST 13: Main Menu from deep navigation (Press 00)"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"1*1*1*500*00\"}" | head -7
echo ""
echo ""

# Test 14: Complete Donation Flow
echo "✓ TEST 14: Complete Donation (Confirm)"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"1*1*1*1000*1\"}" | head -15
echo ""
echo ""

# Test 15: Kiswahili Language
echo "✓ TEST 15: Kiswahili Language Selection"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"2\"}" | head -7
echo ""
echo ""

# Test 16: French Language
echo "✓ TEST 16: French Language Selection"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"3\"}" | head -7
echo ""
echo ""

# Test 17: Change Language from Main Menu
echo "✓ TEST 17: Change Language (Press 0 from Main Menu)"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$PHONE\", \"text\": \"1*0\"}" | head -5
echo ""
echo ""

echo "==============================================="
echo "✅ All Navigation Tests Complete!"
echo "==============================================="
