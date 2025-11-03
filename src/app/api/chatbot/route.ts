import { NextRequest, NextResponse } from "next/server";

// Knowledge base for PaySmile-specific questions
const PAYSMILE_KNOWLEDGE = {
  blockchain: `Blockchain is a digital ledger technology that records transactions across multiple computers. Think of it like a shared notebook that everyone can see but no one can erase or change past entries. This makes it perfect for tracking donations because everyone can verify where money goes!

In PaySmile, we use blockchain to ensure:
- Full transparency of all donations
- Permanent records that can't be altered
- Direct transfers with no intermediaries
- Lower transaction fees`,

  celo: `CELO is the cryptocurrency we use on PaySmile. It's the native token of the Celo blockchain, which focuses on mobile-first financial tools and making crypto accessible to everyone.

Key benefits of CELO:
- Low transaction fees (usually just cents)
- Fast transactions (confirmed in seconds)
- Environmentally friendly (uses proof-of-stake)
- Mobile-optimized for easy use`,

  donate: `Donating on PaySmile is easy! Here's how:

1. **Connect your wallet** - Click "Connect Wallet" and choose MetaMask or WalletConnect
2. **Browse projects** - Explore projects on the Projects page
3. **Choose amount** - Enter how much you want to donate (in CELO)
4. **Confirm** - Review the transaction and click confirm in your wallet
5. **Get your badge** - Receive an NFT badge as proof of your contribution!

Your donation goes directly to the project's smart contract, ensuring transparency.`,

  nft: `NFT badges are special digital collectibles you receive when you donate! They serve as:

- **Proof of donation** - Permanent record on the blockchain
- **Recognition** - Shows your support for causes
- **Tiers** - Different levels based on donation amount:
  * Bronze: $10 - $49
  * Silver: $50 - $99
  * Gold: $100 - $249
  * Platinum: $250+

Your badges are stored in your wallet and displayed in the Badges section.`,

  security: `Your donations on PaySmile are very secure because:

1. **Smart contracts** - Code that automatically executes without human intervention
2. **Blockchain verification** - Every transaction is verified by the network
3. **Non-custodial** - You control your funds via your wallet
4. **Transparent** - All transactions are publicly viewable
5. **Audited code** - Our contracts are tested and reviewed

Remember to:
- Never share your private keys or seed phrase
- Always verify transaction details before confirming
- Use official PaySmile website only`,

  smartContract: `Smart contracts are self-executing programs on the blockchain. Think of them as digital vending machines - you put money in, and they automatically give you what you paid for, following pre-programmed rules.

On PaySmile:
- The **DonationPool** contract manages all donations
- Automatically records who donated and how much
- Triggers NFT badge minting when you donate
- Ensures funds go to the right project
- No one (not even us) can alter these rules!`,

  wallet: `A crypto wallet is like a digital bank account for cryptocurrencies. We recommend MetaMask for PaySmile.

**Setting up MetaMask:**
1. Install MetaMask browser extension
2. Create a new wallet and save your seed phrase (VERY IMPORTANT!)
3. Add Celo Sepolia network to MetaMask
4. Get some CELO for transactions
5. Connect to PaySmile

Your wallet gives you full control - we never have access to your funds.`,

  gas: `Gas fees are small payments made to process transactions on the blockchain - like a postal fee for sending your donation.

On Celo (which PaySmile uses):
- Gas fees are typically just a few cents
- Much cheaper than Ethereum
- Paid in CELO
- Shown before you confirm any transaction

The fee goes to network validators who process and secure your transaction.`,
};

// Generate AI-like response based on the question
function generateResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Blockchain basics
  if (
    lowerMessage.includes("blockchain") ||
    lowerMessage.includes("what is blockchain") ||
    lowerMessage.includes("explain blockchain")
  ) {
    return PAYSMILE_KNOWLEDGE.blockchain;
  }

  // CELO cryptocurrency
  if (
    lowerMessage.includes("celo") ||
    lowerMessage.includes("cryptocurrency") ||
    lowerMessage.includes("crypto")
  ) {
    return PAYSMILE_KNOWLEDGE.celo;
  }

  // How to donate
  if (
    lowerMessage.includes("how") &&
    (lowerMessage.includes("donate") || lowerMessage.includes("donation"))
  ) {
    return PAYSMILE_KNOWLEDGE.donate;
  }

  if (lowerMessage.includes("donate") || lowerMessage.includes("donation")) {
    return "To donate, connect your wallet, choose a project, enter an amount, and confirm the transaction. You'll receive an NFT badge as proof! Want me to walk you through the process?";
  }

  // NFT badges
  if (
    lowerMessage.includes("nft") ||
    lowerMessage.includes("badge") ||
    lowerMessage.includes("reward")
  ) {
    return PAYSMILE_KNOWLEDGE.nft;
  }

  // Security
  if (
    lowerMessage.includes("safe") ||
    lowerMessage.includes("secure") ||
    lowerMessage.includes("security") ||
    lowerMessage.includes("trust")
  ) {
    return PAYSMILE_KNOWLEDGE.security;
  }

  // Smart contracts
  if (
    lowerMessage.includes("smart contract") ||
    lowerMessage.includes("contract")
  ) {
    return PAYSMILE_KNOWLEDGE.smartContract;
  }

  // Wallet
  if (
    lowerMessage.includes("wallet") ||
    lowerMessage.includes("metamask") ||
    lowerMessage.includes("connect")
  ) {
    return PAYSMILE_KNOWLEDGE.wallet;
  }

  // Gas fees
  if (
    lowerMessage.includes("gas") ||
    lowerMessage.includes("fee") ||
    lowerMessage.includes("cost")
  ) {
    return PAYSMILE_KNOWLEDGE.gas;
  }

  // Projects
  if (lowerMessage.includes("project")) {
    return "Projects on PaySmile are fundraising campaigns for various causes like emergency food relief, clean water, education, and healthcare. Each project has a goal amount and deadline. You can browse all active projects on the Projects page and donate directly to the ones you care about!";
  }

  // Transparency
  if (
    lowerMessage.includes("transparent") ||
    lowerMessage.includes("transparency") ||
    lowerMessage.includes("track")
  ) {
    return "PaySmile ensures complete transparency through blockchain technology. Every donation is recorded on the blockchain and can be verified by anyone. You can see exactly how much has been raised for each project, who donated (wallet addresses), and when. This creates trust and accountability!";
  }

  // Getting started
  if (
    lowerMessage.includes("start") ||
    lowerMessage.includes("begin") ||
    lowerMessage.includes("first time")
  ) {
    return "Welcome to PaySmile! Here's how to get started:\n\n1. Install MetaMask wallet (if you don't have one)\n2. Connect your wallet to PaySmile\n3. Browse projects and find a cause you care about\n4. Make your first donation\n5. Receive your first NFT badge!\n\nNeed help with any of these steps?";
  }

  // Default response
  return `That's a great question! While I'm still learning, I can help you with:

- Understanding blockchain and how it works
- How to donate on PaySmile
- What NFT badges are and how to earn them
- Security and safety of your donations
- Smart contracts and transparency
- Setting up your wallet
- Gas fees and transaction costs

What would you like to know more about?`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Generate response (in production, this would call OpenAI/Gemini API)
    const response = generateResponse(message);

    return NextResponse.json({
      response,
      suggestions: [
        "Tell me more",
        "How do I get started?",
        "Is it safe?",
        "What's next?",
      ],
    });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
