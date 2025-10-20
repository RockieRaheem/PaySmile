# PaySmile 😊

**"Small Payments, Big Smiles."**

A blockchain-based mobile application built on **Celo** that enables Ugandans to automatically donate small change ("round-ups") from everyday mobile payments toward verified community projects.

## 🌟 Project Overview

PaySmile transforms micro-donations into macro-impact by allowing users to round up their daily transactions and contribute to community projects like clean water initiatives, education support, and environmental conservation.

### Key Features

- 💰 **Round-Up Donations**: Automatically round up transactions to donate spare change
- 🗳️ **Community Voting**: Vote on which projects receive funding
- 🏆 **NFT Badges**: Earn recognition for your contributions
- 📊 **Impact Dashboard**: Track your donations and see real-world impact
- 🔗 **Blockchain Transparency**: All transactions visible on-chain
- 📱 **Mobile-First**: Optimized for Celo's mobile-first ecosystem

## 🚀 Quick Start

### For Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Local Blockchain** (in one terminal)
   ```bash
   npx hardhat node
   ```

3. **Deploy Smart Contracts** (in another terminal)
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

4. **Start Next.js Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   - Visit [http://localhost:9002](http://localhost:9002)
   - Connect MetaMask to localhost (Chain ID: 31337)
   - Import test account to interact with contracts

📖 **Full Web3 Integration Guide**: See [WEB3_INTEGRATION.md](./WEB3_INTEGRATION.md)

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Blockchain**: Celo, Solidity ^0.8.20
- **Web3 Libraries**: Wagmi, Viem
- **Smart Contracts**: OpenZeppelin, Hardhat
- **Backend**: Firebase (Firestore)
- **AI**: Google GenAI (NFT generation)

## 📋 Smart Contracts

### DonationPool
Manages donations, projects, and voting
- Address (localhost): `0x5FbDB2315678afecb367f032d93F642f64180aa3`

### SmileBadgeNFT  
ERC-721 NFT badges for donors
- Address (localhost): `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

## 🎯 Hackathon: EthNile'25

**Track**: Celo - Mobile-First for Africa

**Problem Solved**:
- Lack of trust in donation systems
- No transparent way to support local development
- Small contributions often ignored
- Communities struggle with funding verification

**Our Solution**:
- Blockchain transparency for every donation
- Community governance through voting
- Gamification with NFT badges
- Mobile-first design for widespread adoption

## 📂 Project Structure

```
PaySmile/
├── contracts/          # Solidity smart contracts
├── scripts/            # Deployment and utility scripts
├── src/
│   ├── app/           # Next.js app pages
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks for contracts
│   ├── lib/           # Utilities, ABIs, contract addresses
│   └── firebase/      # Firebase configuration
├── hardhat.config.js  # Hardhat configuration
└── .env.local         # Environment variables (contract addresses)
```

## 🧪 Testing

### Test Locally

```bash
# Run Hardhat tests (when available)
npx hardhat test

# Use Hardhat console
npx hardhat console --network localhost

# Check deployment
npx hardhat run scripts/deploy.js --network localhost
```

### Test on Alfajores Testnet

1. Get test CELO from [Celo Faucet](https://faucet.celo.org/alfajores)
2. Add `PRIVATE_KEY` to `.env`
3. Deploy: `npx hardhat run scripts/deploy.js --network alfajores`
4. Update `.env.local` with testnet contract addresses

## 🌍 Deployment

### Celo Alfajores Testnet
- **Chain ID**: 44787
- **RPC**: https://alfajores-forno.celo-testnet.org
- **Explorer**: https://alfajores.celoscan.io

### Celo Mainnet  
- **Chain ID**: 42220
- **RPC**: https://forno.celo.org
- **Explorer**: https://celoscan.io

## 🔐 Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_DONATION_POOL_ADDRESS=<contract_address>
NEXT_PUBLIC_SMILE_BADGE_NFT_ADDRESS=<contract_address>
```

For deployment, create `.env`:
```env
PRIVATE_KEY=<your_private_key>
CELOSCAN_API_KEY=<optional_for_verification>
```

## 🤝 Contributing

This is a hackathon project for EthNile'25. 

## 📄 License

MIT License

---

**Built for EthNile'25 Hackathon** 🇺🇬

