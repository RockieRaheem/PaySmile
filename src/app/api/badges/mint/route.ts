import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, publicActions } from "viem";
import { celoAlfajores } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { SMILE_BADGE_NFT_ABI } from "@/lib/abis/SmileBadgeNFT";

/**
 * POST /api/badges/mint
 * Mints a badge NFT to a donor after successful donation
 *
 * Request body:
 * - recipientAddress: Donor's wallet address
 * - donationAmount: Amount donated in USD
 * - projectId: ID of the project donated to
 * - projectName: Name of the project
 * - transactionHash: On-chain transaction hash (for verification)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      recipientAddress,
      donationAmount,
      projectId,
      projectName,
      transactionHash,
    } = body;

    // Validate input
    if (!recipientAddress || !donationAmount || !projectId || !projectName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate donation amount threshold ($10 minimum for badges)
    if (parseFloat(donationAmount) < 10) {
      return NextResponse.json(
        { error: "Donation amount must be at least $10 to receive a badge" },
        { status: 400 }
      );
    }

    // Get contract owner private key from environment
    const privateKey = process.env.CONTRACT_OWNER_PRIVATE_KEY;
    if (!privateKey) {
      console.error("CONTRACT_OWNER_PRIVATE_KEY not set in environment");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get SmileBadgeNFT contract address
    const contractAddress = process.env.NEXT_PUBLIC_SMILE_BADGE_NFT_ADDRESS;
    if (!contractAddress) {
      console.error("NEXT_PUBLIC_SMILE_BADGE_NFT_ADDRESS not set");
      return NextResponse.json(
        { error: "Contract address not configured" },
        { status: 500 }
      );
    }

    // Determine badge type based on donation amount
    const badgeType = getBadgeTypeFromAmount(parseFloat(donationAmount));
    const tierName = getBadgeTierName(parseFloat(donationAmount));

    // Create token URI (metadata for the NFT)
    const tokenURI = generateTokenURI(
      recipientAddress,
      projectName,
      donationAmount,
      tierName,
      projectId,
      transactionHash
    );

    // Create wallet client with owner's private key
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const client = createWalletClient({
      account,
      chain: celoAlfajores,
      transport: http(),
    }).extend(publicActions);

    console.log("Minting badge:", {
      recipient: recipientAddress,
      badgeType,
      tierName,
      amount: donationAmount,
      project: projectName,
    });

    // Mint the badge
    const hash = await client.writeContract({
      address: contractAddress as `0x${string}`,
      abi: SMILE_BADGE_NFT_ABI,
      functionName: "mintBadge",
      args: [recipientAddress as `0x${string}`, badgeType, tokenURI],
    });

    // Wait for transaction receipt
    const receipt = await client.waitForTransactionReceipt({ hash });

    console.log("Badge minted successfully:", {
      txHash: hash,
      status: receipt.status,
    });

    return NextResponse.json({
      success: true,
      transactionHash: hash,
      badgeType,
      tierName,
      tokenURI,
    });
  } catch (error: any) {
    console.error("Error minting badge:", error);

    // Check if badge already exists
    if (error.message?.includes("Badge already earned")) {
      return NextResponse.json(
        { error: "Badge already earned for this type" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to mint badge" },
      { status: 500 }
    );
  }
}

/**
 * Determine badge type based on donation amount
 * Matches the enum in SmileBadgeNFT contract
 */
function getBadgeTypeFromAmount(amountUSD: number): number {
  if (amountUSD >= 250) {
    return 4; // HEALTH_HERO (Platinum tier)
  } else if (amountUSD >= 100) {
    return 5; // GREEN_GUARDIAN (Gold tier)
  } else if (amountUSD >= 50) {
    return 2; // EDUCATION_CHAMPION (Silver tier)
  } else if (amountUSD >= 10) {
    return 0; // FIRST_STEP (Bronze tier)
  }
  return 0; // Default to FIRST_STEP
}

/**
 * Get badge tier name from amount
 */
function getBadgeTierName(amountUSD: number): string {
  if (amountUSD >= 250) return "Platinum";
  if (amountUSD >= 100) return "Gold";
  if (amountUSD >= 50) return "Silver";
  if (amountUSD >= 10) return "Bronze";
  return "Supporter";
}

/**
 * Generate metadata URI for the badge NFT
 * In production, this should be IPFS or hosted metadata
 * For now, we use data URIs with JSON metadata
 */
function generateTokenURI(
  recipient: string,
  projectName: string,
  amount: string,
  tier: string,
  projectId: number,
  transactionHash?: string
): string {
  const metadata = {
    name: `PaySmile ${tier} Badge`,
    description: `Awarded for donating $${amount} to ${projectName}`,
    image: `https://paysmile.app/badges/${tier.toLowerCase()}.png`, // TODO: Replace with actual badge images
    attributes: [
      {
        trait_type: "Tier",
        value: tier,
      },
      {
        trait_type: "Project",
        value: projectName,
      },
      {
        trait_type: "Project ID",
        value: projectId.toString(),
      },
      {
        trait_type: "Donation Amount (USD)",
        value: amount,
      },
      {
        trait_type: "Donor",
        value: recipient,
      },
      {
        trait_type: "Date",
        value: new Date().toISOString(),
      },
      ...(transactionHash
        ? [
            {
              trait_type: "Transaction",
              value: transactionHash,
            },
          ]
        : []),
    ],
  };

  // Convert to data URI
  const jsonString = JSON.stringify(metadata);
  const base64 = Buffer.from(jsonString).toString("base64");
  return `data:application/json;base64,${base64}`;
}
