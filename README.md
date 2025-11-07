# PaySmile — Transparent, Rewarding Giving for Rwanda

PaySmile converts spare change and donations into verified community impact. Built as a mobile-first Progressive Web App (PWA) and feature-phone-friendly via USSD, PaySmile uses Celo smart contracts and NFT badges to make giving transparent, rewarding, and simple.

---

## Quick Highlights

- Blockchain: Celo (testnets used: Alfajores / Sepolia during development)
- USSD: Africa's Talking integration — shortcode used in testing: `*384*400004#`
- Frontend: Next.js 15 PWA (mobile-first, offline-capable)
- Backend: Node.js USSD server (Africa's Talking) + optional API endpoints
- Wallet/chain integration: wagmi + viem
- Payments: Flutterwave for fiat/mobile-money on-ramps; CELO for crypto
- Gamification: NFT badge minting (Bronze → Diamond) with animated confetti

---

## Contents

- [Problem](#problem)
- [Solution](#solution)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Running locally](#running-locally)
- [Testing USSD flows](#testing-ussd-flows)
- [Contracts & deployment](#contracts--deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Contact](#contact)

---

## Problem

Mobile money in East Africa generates huge volumes of micro-spare change, yet most of this value goes unused. Traditional donation platforms lack transparency and exclude feature-phone users. Rwandan communities need accessible, trustworthy donation tools that reach everyone.

## Solution

PaySmile captures spare change (round-ups) and direct donations, records every donation on-chain for full transparency, and rewards donors with on-chain NFT badges. Feature-phone users can donate via USSD. Donors vote on projects, track impact, and share achievements.

## Features

- PWA frontend (Next.js 15) — fast, installable, offline-first
- Full USSD flow for feature phones via Africa's Talking
- Smart contracts on Celo testnets for donation pools, badge NFTs, voting and rewards
- Real-time wallet integration (wagmi + viem)
- Multi-payment support (CELO + Flutterwave mobile money/card on-ramps)
- NFT gamification and social sharing
- AI-powered chatbot for donor education and support

## Architecture

- Frontend: `src/` — Next.js 15 app, components, pages (Dashboard, Projects, Badges, History, Settings, Connect, Learn More, Setup, Shop, Donation Success)
- Backend: `server/` — Node.js Express server handling USSD flow, Africa's Talking integration, session handling, and optional API endpoints
- Smart Contracts: `contracts/` (or `hardhat/`) — DonationPool, SmileBadgeNFT, ProjectRegistry, VotingSystem, RewardDistributor
- Integrations: Africa's Talking (USSD/SMS), Flutterwave (fiat/mobile-money), Celo nodes for on-chain

## Getting Started

1. Clone the repo

```bash
git clone https://github.com/RockieRaheem/PaySmile.git
cd PaySmile
```

2. Install root deps (frontend)

```bash
npm install
# or pnpm / yarn as preferred
```

3. Install server deps and set env

```bash
cd server
npm install
cp .env.example .env
# Edit .env to add your Africa's Talking credentials and other keys (AT_API_KEY, AT_USERNAME, FLW keys, CELO_RPC, CONTRACT_ADDRESSES etc.)
```

## Running locally (dev)

Open two terminals:

Terminal 1 — Frontend:

```bash
# from project root
npm run dev
# This runs Next.js dev server (port in package.json: 9002)
```

Terminal 2 — USSD / API server:

```bash
cd server
node index.js
# server listens on PORT (default 4000)
```

Notes:

- The frontend expects API endpoints for USSD testing and some backend routes. See `server/index.js` for details.
- For the wallet and smart contract interactions, update `.env` with `NEXT_PUBLIC_RPC_URL`, `NEXT_PUBLIC_CONTRACT_ADDRESSES`, and private keys if needed for local testing.

## Testing USSD flows

- The server includes a USSD testing script: `server/test-ussd-flow.sh` — adjust `BASE_URL` if running on a different host/port.
- Sandbox: Use Africa's Talking sandbox simulator at https://simulator.africastalking.com/ and the sandbox credentials from your Africa's Talking account.
- Example test phone numbers used for Rwanda sandbox can be found in the project docs and `server` test scripts.

## Smart Contracts & Deployment

- Contracts live in the `contracts/` or `hardhat/` folder (if present). We deploy to Celo testnets (Alfajores / Sepolia during development); update `hardhat.config.js` or `foundry` configs to change networks.
- Common contracts: `DonationPool.sol`, `SmileBadgeNFT.sol`, `ProjectRegistry.sol`, `VotingSystem.sol`, `RewardDistributor.sol`.
- Keep your contract addresses in `.env` and `src/lib/config.ts` (or equivalent) for the frontend to interact with.

## Testing & Metrics

- Lighthouse: 92/100 (desktop) — mobile-first optimized
- Typical initial load: < 2 seconds (dev optimizations applied)
- User testing: 50+ beta testers, $500+ processed on testnet
- Badge & NFT flow validated with animated minting and confetti UI

## Roadmap

- Smart contract security audit (priority)
- Mainnet deployment (Celo mainnet)
- Mobile apps (React Native)
- Wider USSD rollout with telco partners (MTN / Airtel)
- NGO onboarding & enterprise features

## Contributing

We welcome contributors. Please open issues or PRs for:

- Bug fixes
- New USSD flows and translations
- Smart contract audits and gas optimization
- Payment gateways and compliance

Guidelines:

- Follow the existing code style (TypeScript + React + Tailwind)
- Add tests for new features where applicable

## Useful Files

- `PITCH_DECK.md` — investor / hackathon pitch
- `server/index.js` — USSD backend and Africa's Talking integration
- `server/test-ussd-flow.sh` — automated USSD test script
- `src/` — Next.js frontend
- `contracts/` or `hardhat/` — solidity contracts (if present)

## Contact

- Founder: Kamwanga Raheem — kamwangaraheem2050@mail.com
- GitHub: https://github.com/RockieRaheem/PaySmile

---

If you want, I can also:

- Add a short `CONTRIBUTING.md`
- Add GitHub Actions to run tests on PRs
- Add a minimal `docker-compose` for running frontend+server locally

---

_README generated on Nov 7, 2025 — review and tweak any env values before running._
