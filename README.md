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

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Git

### For Development

1. **Clone and Install**

   ```bash
   git clone <repository-url>
   cd PaySmile
   npm install
   ```

2. **Start Local Blockchain** (Terminal 1)

   ```bash
   npx hardhat node
   ```

   This starts a local Ethereum node on `http://127.0.0.1:8545` with 20 test accounts (10,000 ETH each).

3. **Deploy Smart Contracts** (Terminal 2)

   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

   ✅ **Contracts deployed:**

   - DonationPool: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
   - SmileBadgeNFT: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

4. **Verify Setup**

   ```bash
   ./scripts/verify-setup.sh
   ```

   This checks all configurations are correct.

5. **Start Next.js Development Server** (Terminal 3)

   ```bash
   npm run dev
   ```

   App runs on [http://localhost:9002](http://localhost:9002)

6. **Configure MetaMask** (One-time setup)

   See **[METAMASK_SETUP.md](./METAMASK_SETUP.md)** for detailed instructions.

   **Quick Steps:**

   - Add Hardhat Localhost network (Chain ID: 31337, RPC: http://127.0.0.1:8545)
   - Import test account: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - Switch to Hardhat Localhost network

7. **Test the Application**

   - Visit [http://localhost:9002](http://localhost:9002)
   - Connect MetaMask wallet
   - Explore dashboard and projects
   - Vote on projects
   - View donation stats

📖 **Detailed Guides:**

- [MetaMask Setup](./METAMASK_SETUP.md) - Wallet configuration
- [End-to-End Testing](./docs/END_TO_END_TESTING.md) - Complete testing guide
- [Network Troubleshooting](./docs/NETWORK_FIX.md) - Fix network issues

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

### Automated Verification

```bash
# Run setup verification script
./scripts/verify-setup.sh
```

This checks:

- ✅ Environment configuration (.env.local)
- ✅ Deployment files
- ✅ Hardhat node status
- ✅ Dev server status
- ✅ Smart contracts compilation
- ✅ Frontend components
- ✅ Documentation files

### Manual Testing

See **[docs/END_TO_END_TESTING.md](./docs/END_TO_END_TESTING.md)** for comprehensive testing guide.

**Quick Test Flow:**

1. Connect wallet → Dashboard → View stats
2. Navigate to Projects → Vote on a project
3. Test round-up calculator → Setup page
4. Switch networks → Verify NetworkChecker alerts

### Contract Interaction (Hardhat Console)

```bash
# Start Hardhat console
npx hardhat console --network localhost

# Donate to a project
const pool = await ethers.getContractAt('DonationPool', '0x5FbDB2315678afecb367f032d93F642f64180aa3');
await pool.donateToProject(0, {value: ethers.parseEther('1')});

# Check project details
const project = await pool.getProject(0);
console.log('Funding:', ethers.formatEther(project.currentFunding), 'ETH');

# Check donor stats
const [deployer] = await ethers.getSigners();
const stats = await pool.getDonorStats(deployer.address);
console.log('Total:', ethers.formatEther(stats.totalDonations), 'ETH');
```

### Test on Celo Alfajores Testnet

1. Get test CELO from [Celo Faucet](https://faucet.celo.org/alfajores)
2. Create `.env` file: `PRIVATE_KEY=<your_private_key>`
3. Deploy: `npx hardhat run scripts/deploy.js --network alfajores`
4. Update `.env.local`:
   ```env
   NEXT_PUBLIC_CHAIN_ID=44787
   NEXT_PUBLIC_DONATION_POOL_ADDRESS=<new_address>
   NEXT_PUBLIC_SMILE_BADGE_NFT_ADDRESS=<new_address>
   ```
5. Add Celo Alfajores network to MetaMask
6. Test on testnet

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
