import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { localhost } from "viem/chains";
import { DONATION_POOL_ABI } from "@/lib/abis/DonationPool";

const DONATION_POOL_ADDRESS = process.env
  .NEXT_PUBLIC_DONATION_POOL_ADDRESS as `0x${string}`;
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "31337");

// Configure the chain based on environment
const getChain = () => {
  if (CHAIN_ID === 31337) return localhost;
  // Add other chains as needed (Celo, Alfajores)
  return localhost;
};

// Create public client for reading blockchain data
const publicClient = createPublicClient({
  chain: getChain(),
  transport: http(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);

    if (isNaN(projectId) || projectId < 0) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    // Read project data from smart contract
    const data = await publicClient.readContract({
      address: DONATION_POOL_ADDRESS,
      abi: DONATION_POOL_ABI,
      functionName: "projects",
      args: [BigInt(projectId)],
    });

    // Parse the contract response
    const project = {
      id: projectId,
      name: data[0] as string,
      description: data[1] as string,
      recipient: data[2] as string,
      fundingGoal: (data[3] as bigint).toString(),
      currentFunding: (data[4] as bigint).toString(),
      isActive: data[5] as boolean,
      isFunded: data[6] as boolean,
      votesReceived: (data[7] as bigint).toString(),
      // Add category mapping based on project name or description
      category: categorizeProject(data[0] as string, data[1] as string),
    };

    return NextResponse.json(project);
  } catch (error: any) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to categorize projects based on name/description
function categorizeProject(name: string, description: string): string {
  const text = `${name} ${description}`.toLowerCase();

  if (
    text.includes("water") ||
    text.includes("borehole") ||
    text.includes("well")
  ) {
    return "Healthcare";
  }
  if (
    text.includes("school") ||
    text.includes("education") ||
    text.includes("book")
  ) {
    return "Education";
  }
  if (
    text.includes("tree") ||
    text.includes("environment") ||
    text.includes("green")
  ) {
    return "Environment";
  }
  if (
    text.includes("health") ||
    text.includes("clinic") ||
    text.includes("medical")
  ) {
    return "Healthcare";
  }

  return "Community";
}
