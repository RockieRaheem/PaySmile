import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, publicActions } from "viem";
import { celoAlfajores } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { SMILE_BADGE_NFT_ABI } from "@/lib/abis/SmileBadgeNFT";
import {
  getBadgeForAmount,
  getBadgeTypeFromAmount,
  getAchievementMessage,
} from "@/lib/badge-images";

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
    const badgeMetadata = getBadgeForAmount(parseFloat(donationAmount));

    if (!badgeMetadata) {
      return NextResponse.json(
        { error: "Donation amount must be at least $10 to receive a badge" },
        { status: 400 }
      );
    }

    const badgeType = getBadgeTypeFromAmount(parseFloat(donationAmount));
    const [achievementTitle, achievementMessage] = getAchievementMessage(
      badgeMetadata.tier,
      projectName
    );

    // Create token URI (metadata for the NFT)
    const tokenURI = generateTokenURI(
      recipientAddress,
      projectName,
      donationAmount,
      badgeMetadata,
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
      tier: badgeMetadata.tier,
      amount: donationAmount,
      project: projectName,
    });

    // Mint the badge with gas estimation
    const hash = await client.writeContract({
      address: contractAddress as `0x${string}`,
      abi: SMILE_BADGE_NFT_ABI,
      functionName: "mintBadge",
      args: [recipientAddress as `0x${string}`, badgeType, tokenURI],
      gas: BigInt(500000), // Set reasonable gas limit for minting
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
      tier: badgeMetadata.tier,
      badgeName: badgeMetadata.name,
      badgeImage: badgeMetadata.image,
      achievementTitle,
      achievementMessage,
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
 * Generate metadata URI for the badge NFT
 * Uses actual badge images and rich metadata
 */
function generateTokenURI(
  recipient: string,
  projectName: string,
  amount: string,
  badgeMetadata: any,
  projectId: number,
  transactionHash?: string
): string {
  const metadata = {
    name: `PaySmile ${badgeMetadata.name}`,
    description: `${badgeMetadata.description}\n\nAwarded for donating $${amount} to ${projectName}`,
    image: badgeMetadata.image,
    external_url: `https://paysmile.app/badges/${recipient}`,
    attributes: [
      {
        trait_type: "Tier",
        value: badgeMetadata.tier,
      },
      {
        trait_type: "Badge Name",
        value: badgeMetadata.name,
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
        display_type: "number",
        value: parseFloat(amount),
      },
      {
        trait_type: "Minimum Amount",
        display_type: "number",
        value: badgeMetadata.minAmount,
      },
      {
        trait_type: "Donor",
        value: recipient,
      },
      {
        trait_type: "Date",
        display_type: "date",
        value: Math.floor(Date.now() / 1000),
      },
      {
        trait_type: "Achievement",
        value: badgeMetadata.emoji,
      },
      ...(transactionHash
        ? [
            {
              trait_type: "Transaction Hash",
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
