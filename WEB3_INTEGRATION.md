# PaySmile - Web3 Integration Guide

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet

### Installation

```bash
npm install
```

### Running Locally with Smart Contracts

#### 1. Start Local Hardhat Node

In one terminal:

```bash
npx hardhat node
```

This will start a local Ethereum node at `http://127.0.0.1:8545` with 20 pre-funded test accounts.

#### 2. Deploy Contracts

In another terminal:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

This will:

- Deploy `DonationPool` contract
- Deploy `SmileBadgeNFT` contract
- Create 3 sample projects
- Save deployment info to `deployments/localhost-deployment.json`

#### 3. Configure Environment

The `.env.local` file should already be configured with localhost contract addresses:

```bash
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_DONATION_POOL_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_SMILE_BADGE_NFT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

#### 4. Start Next.js Dev Server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002)

#### 5. Connect MetaMask to Localhost

1. Open MetaMask
2. Click network dropdown → Add Network → Add a network manually
3. Enter:
   - **Network Name**: Hardhat Localhost
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH
4. Save and switch to this network

#### 6. Import Test Account

Import one of the Hardhat test accounts into MetaMask:

```
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

⚠️ **Never use this private key on mainnet!** This is a well-known test account.

---

## 📋 Smart Contracts

### DonationPool.sol

Main contract for managing donations and projects.

**Key Functions:**

- `donate()` - Accept general donations (payable)
- `donateToProject(uint256 projectId)` - Donate to specific project
- `voteForProject(uint256 projectId)` - Vote for a project
- `createProject(...)` - Create new project (owner only)
- `getProject(uint256 projectId)` - Get project details
- `getDonorTotal(address donor)` - Get donor's total contributions

**Deployed at:** `0x5FbDB2315678afecb367f032d93F642f64180aa3` (localhost)

### SmileBadgeNFT.sol

ERC-721 NFT contract for donor badges.

**Key Functions:**

- `mintBadge(address to, BadgeType badgeType, string tokenURI)` - Mint badge (owner only)
- `getBadgesByOwner(address owner)` - Get all badges for an address
- `hasBadge(address owner, BadgeType badgeType)` - Check if badge earned
- `totalSupply()` - Total badges minted

**Badge Types:**

- FIRST_STEP (0)
- COMMUNITY_BUILDER (1)
- EDUCATION_CHAMPION (2)
- WATER_WARRIOR (3)
- HEALTH_HERO (4)
- GREEN_GUARDIAN (5)

**Deployed at:** `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` (localhost)

---

## 🧪 Testing Locally

### Test Donation Flow

1. **Connect Wallet**: Navigate to `/connect` and connect MetaMask
2. **View Projects**: Go to `/projects` to see blockchain projects
3. **Vote**: Click "Vote" on a project (requires gas)
4. **Donate**: Use custom hooks to donate:

```typescript
import { useDonateToProject } from "@/hooks/use-contracts";

const { donateToProject, isPending } = useDonateToProject();

// Donate 0.01 ETH to project 0
await donateToProject(0, "0.01");
```

### Test Using Hardhat Console

```bash
npx hardhat console --network localhost
```

```javascript
const DonationPool = await ethers.getContractAt(
  "DonationPool",
  "0x5FbDB2315678afecb367f032d93F642f64180aa3"
);

// Check project count
await DonationPool.getProjectCount();

// Get project 0 details
await DonationPool.getProject(0);

// Donate 0.1 ETH to project 0
await DonationPool.donateToProject(0, { value: ethers.parseEther("0.1") });
```

---

## 🌍 Deploying to Celo Alfajores Testnet

### 1. Get Test CELO

Visit [Celo Faucet](https://faucet.celo.org/alfajores) and get test tokens.

### 2. Configure Private Key

Create `.env` file (not tracked in git):

```bash
PRIVATE_KEY=your_private_key_here
```

⚠️ **Never commit private keys to git!**

### 3. Deploy

```bash
npx hardhat run scripts/deploy.js --network alfajores
```

### 4. Update Environment

Update `.env.local`:

```bash
NEXT_PUBLIC_CHAIN_ID=44787
NEXT_PUBLIC_DONATION_POOL_ADDRESS=<deployed_address>
NEXT_PUBLIC_SMILE_BADGE_NFT_ADDRESS=<deployed_address>
```

### 5. Verify on Celoscan (Optional)

```bash
npx hardhat verify --network alfajores <CONTRACT_ADDRESS>
```

---

## 🔧 Custom Hooks

### useDonate()

Donate to general pool

```typescript
const { donate, isPending, isSuccess } = useDonate();
await donate("0.01"); // 0.01 CELO
```

### useDonateToProject()

Donate to specific project

```typescript
const { donateToProject } = useDonateToProject();
await donateToProject(projectId, "0.05");
```

### useVoteForProject()

Vote for a project

```typescript
const { voteForProject, isPending } = useVoteForProject();
await voteForProject(projectId);
```

### useProject(projectId)

Read project data

```typescript
const { project, isLoading } = useProject(0);
// project: { name, description, fundingGoal, currentFunding, ... }
```

### useDonorStats(address?)

Get donor's total donations

```typescript
const { totalDonations, isLoading } = useDonorStats();
// totalDonations: "0.15" (in CELO)
```

### useUserBadges(address?)

Get user's NFT badges

```typescript
const { badgeIds, badgeCount } = useUserBadges();
// badgeIds: [0n, 3n, 5n]
```

---

## 📁 Project Structure

```
PaySmile/
├── contracts/
│   ├── DonationPool.sol       # Main donation contract
│   └── SmileBadgeNFT.sol      # NFT badge contract
├── scripts/
│   └── deploy.js              # Deployment script
├── deployments/               # Deployment artifacts
│   └── localhost-deployment.json
├── src/
│   ├── lib/
│   │   ├── contracts.ts       # Contract addresses
│   │   └── abis/              # Contract ABIs
│   │       ├── DonationPool.ts
│   │       └── SmileBadgeNFT.ts
│   ├── hooks/
│   │   └── use-contracts.ts   # Custom React hooks
│   ├── components/
│   │   └── WagmiProvider.tsx  # Web3 provider setup
│   └── app/
│       ├── api/project/[id]/  # API route for projects
│       └── (app)/projects/    # Projects page
├── hardhat.config.js          # Hardhat configuration
└── .env.local                 # Environment variables
```

---

## 🐛 Troubleshooting

### "Wallet not connected" Error

- Ensure MetaMask is connected to the correct network (localhost chain ID 31337)
- Check that you've imported a test account

### "Transaction Failed" Error

- Ensure you have enough ETH for gas
- Check that the contract address is correct in `.env.local`
- Verify Hardhat node is running

### "Contract not deployed" Error

- Run the deployment script: `npx hardhat run scripts/deploy.js --network localhost`
- Check `.env.local` has correct contract addresses

### Projects Not Loading

- Ensure API route is working: `curl http://localhost:9002/api/project/0`
- Check browser console for errors
- Verify contract address is set

---

## 🎯 Next Steps for EthNile Submission

1. ✅ Smart contracts deployed and tested locally
2. ⏳ Deploy to Celo Alfajores testnet
3. ⏳ Update dashboard to use real blockchain data
4. ⏳ Test end-to-end donation + voting flow
5. ⏳ Record demo video showing:
   - Wallet connection
   - Project voting
   - Donation transaction
   - NFT badge (if implemented)
6. ⏳ Prepare submission materials

---

## 📚 Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Celo Documentation](https://docs.celo.org)
- [Wagmi Documentation](https://wagmi.sh)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Viem Documentation](https://viem.sh)

---

## 🤝 Contributing

This is a hackathon project for EthNile'25. For questions or issues, please check the project documentation or contact the team.

---

**Built with ❤️ for EthNile'25 Hackathon**
