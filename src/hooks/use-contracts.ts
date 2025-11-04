/**
 * Custom hooks for interacting with PaySmile smart contracts
 */

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { DONATION_POOL_ABI } from "@/lib/abis/DonationPool";
import { SMILE_BADGE_NFT_ABI } from "@/lib/abis/SmileBadgeNFT";
import { getContractAddresses } from "@/lib/contracts";
import { parseEther, formatEther } from "viem";
import { useEffect, useState, useCallback } from "react";

/**
 * Hook to get contract addresses for current chain
 */
export function useContractAddresses() {
  const { chainId } = useAccount();
  // Use chainId from env if not connected, otherwise use actual chainId
  const defaultChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "31337");
  return getContractAddresses(chainId || defaultChainId);
}

/**
 * Hook to donate to the general pool
 */
export function useDonate() {
  const { DonationPool } = useContractAddresses();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const donate = async (amountInCelo: string) => {
    return writeContract({
      address: DonationPool as `0x${string}`,
      abi: DONATION_POOL_ABI,
      functionName: "donate",
      value: parseEther(amountInCelo),
    });
  };

  return {
    donate,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook to donate to a specific project
 */
export function useDonateToProject() {
  const { DonationPool } = useContractAddresses();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const donateToProject = async (projectId: number, amountInCelo: string) => {
    return writeContract({
      address: DonationPool as `0x${string}`,
      abi: DONATION_POOL_ABI,
      functionName: "donateToProject",
      args: [BigInt(projectId)],
      value: parseEther(amountInCelo),
    });
  };

  return {
    donateToProject,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook to vote for a project
 */
export function useVoteForProject() {
  const { DonationPool } = useContractAddresses();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const voteForProject = async (projectId: number) => {
    return writeContract({
      address: DonationPool as `0x${string}`,
      abi: DONATION_POOL_ABI,
      functionName: "voteForProject",
      args: [BigInt(projectId)],
    });
  };

  return {
    voteForProject,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook to get project details
 */
export function useProject(projectId: number) {
  const { DonationPool } = useContractAddresses();

  const { data, isLoading, error, refetch } = useReadContract({
    address: DonationPool as `0x${string}`,
    abi: DONATION_POOL_ABI,
    functionName: "projects",
    args: [BigInt(projectId)],
  });

  const project = data
    ? {
        name: data[0] as string,
        description: data[1] as string,
        recipient: data[2] as string,
        fundingGoal: data[3] as bigint,
        currentFunding: data[4] as bigint,
        isActive: data[5] as boolean,
        isFunded: data[6] as boolean,
        votesReceived: data[7] as bigint,
      }
    : null;

  return {
    project,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get all projects
 */
export function useProjects() {
  const { DonationPool } = useContractAddresses();

  const { data: projectCount, refetch: refetchCount } = useReadContract({
    address: DonationPool as `0x${string}`,
    abi: DONATION_POOL_ABI,
    functionName: "getProjectCount",
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(
    async (silent = false) => {
      if (projectCount !== undefined && projectCount > 0) {
        // Only show loading state on initial load, not on refetch
        if (!silent) {
          setIsLoading(true);
        }
        const count = Number(projectCount);

        // Exclude duplicate projects (IDs 4 and 5)
        const duplicateProjectIds = [4, 5];
        const projectPromises = [];

        for (let i = 0; i < count; i++) {
          // Skip duplicate projects
          if (duplicateProjectIds.includes(i)) {
            continue;
          }

          // Fetch without cache-busting for better performance
          projectPromises.push(
            fetch(`/api/project/${i}`).then((res) => res.json())
          );
        }

        Promise.all(projectPromises)
          .then((fetchedProjects) => {
            // Convert string values back to bigints
            const parsedProjects = fetchedProjects.map((project) => ({
              ...project,
              fundingGoal: BigInt(project.fundingGoal || "0"),
              currentFunding: BigInt(project.currentFunding || "0"),
              votesReceived: BigInt(project.votesReceived || "0"),
            }));

            // Show blockchain projects only (excluding duplicates)
            setProjects(parsedProjects);
          })
          .finally(() => {
            if (!silent) {
              setIsLoading(false);
            }
          });
      } else {
        // No projects yet or still loading projectCount
        setProjects([]);
        setIsLoading(projectCount === undefined); // Only show loading if count is undefined (still fetching)
      }
    },
    [projectCount]
  );

  useEffect(() => {
    fetchProjects(false);
  }, [fetchProjects]);

  const refetch = useCallback(() => {
    // Silent refetch - don't show loading state
    fetchProjects(true);
  }, [fetchProjects]);

  // Function to update a single project optimistically
  const updateProject = useCallback(
    (projectId: number, updates: Partial<any>) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, ...updates } : p))
      );
    },
    []
  );

  return {
    projects,
    projectCount: projectCount ? Number(projectCount) : 0,
    isLoading,
    refetch,
    updateProject, // Export the optimistic update function
  };
}

/**
 * Hook to get donor's total donations
 */
export function useDonorStats(address?: string) {
  const { address: connectedAddress } = useAccount();
  const { DonationPool } = useContractAddresses();
  const donorAddress = address || connectedAddress;

  const {
    data: totalDonations,
    isLoading,
    refetch,
  } = useReadContract({
    address: DonationPool as `0x${string}`,
    abi: DONATION_POOL_ABI,
    functionName: "totalDonationsByDonor",
    args: donorAddress ? [donorAddress as `0x${string}`] : undefined,
  });

  return {
    totalDonations: totalDonations
      ? formatEther(totalDonations as bigint)
      : "0",
    totalDonationsWei: totalDonations as bigint,
    isLoading,
    refetch,
  };
}

/**
 * Hook to check if user has voted for a project
 */
export function useHasVoted(projectId: number) {
  const { address } = useAccount();
  const { DonationPool } = useContractAddresses();

  const { data: hasVoted, isLoading } = useReadContract({
    address: DonationPool as `0x${string}`,
    abi: DONATION_POOL_ABI,
    functionName: "hasVotedForProject",
    args: address ? [BigInt(projectId), address as `0x${string}`] : undefined,
  });

  return {
    hasVoted: hasVoted as boolean,
    isLoading,
  };
}

/**
 * Hook to get user's NFT badges
 */
export function useUserBadges(address?: string) {
  const { address: connectedAddress } = useAccount();
  const { SmileBadgeNFT } = useContractAddresses();
  const userAddress = address || connectedAddress;

  const { data: badgeIds, isLoading } = useReadContract({
    address: SmileBadgeNFT as `0x${string}`,
    abi: SMILE_BADGE_NFT_ABI,
    functionName: "getBadgesByOwner",
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
  });

  return {
    badgeIds: badgeIds as bigint[] | undefined,
    badgeCount: badgeIds ? (badgeIds as bigint[]).length : 0,
    isLoading,
  };
}

/**
 * Badge types from SmileBadgeNFT contract
 */
export enum BadgeType {
  FIRST_STEP = 0, // First donation
  COMMUNITY_BUILDER = 1, // Donated to all regions
  EDUCATION_CHAMPION = 2, // 3 education projects
  WATER_WARRIOR = 3, // Clean water project
  HEALTH_HERO = 4, // 5 health projects
  GREEN_GUARDIAN = 5, // Environmental project
}

/**
 * Hook to mint a badge NFT
 */
export function useMintBadge() {
  const { SmileBadgeNFT } = useContractAddresses();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mintBadge = async (
    recipientAddress: string,
    badgeType: BadgeType,
    tokenURI: string
  ) => {
    return writeContract({
      address: SmileBadgeNFT as `0x${string}`,
      abi: SMILE_BADGE_NFT_ABI,
      functionName: "mintBadge",
      args: [recipientAddress as `0x${string}`, badgeType, tokenURI],
    });
  };

  return {
    mintBadge,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Utility function to determine badge type based on donation amount (USD)
 * Maps donation tiers to badge types from the contract
 */
export function getBadgeTypeFromAmount(amountUSD: number): BadgeType {
  if (amountUSD >= 250) {
    return BadgeType.HEALTH_HERO; // Platinum tier -> HEALTH_HERO
  } else if (amountUSD >= 100) {
    return BadgeType.GREEN_GUARDIAN; // Gold tier -> GREEN_GUARDIAN
  } else if (amountUSD >= 50) {
    return BadgeType.EDUCATION_CHAMPION; // Silver tier -> EDUCATION_CHAMPION
  } else if (amountUSD >= 10) {
    return BadgeType.FIRST_STEP; // Bronze tier -> FIRST_STEP
  }
  return BadgeType.FIRST_STEP; // Default to FIRST_STEP for donations below $10
}

/**
 * Utility function to get badge tier name from amount
 */
export function getBadgeTierName(amountUSD: number): string {
  if (amountUSD >= 250) return "Platinum";
  if (amountUSD >= 100) return "Gold";
  if (amountUSD >= 50) return "Silver";
  if (amountUSD >= 10) return "Bronze";
  return "Supporter";
}
