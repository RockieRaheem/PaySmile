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
import { useEffect, useState } from "react";

/**
 * Hook to get contract addresses for current chain
 */
export function useContractAddresses() {
  const { chainId } = useAccount();
  return getContractAddresses(chainId || 44787); // Default to Alfajores
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
    functionName: "getProject",
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

  const { data: projectCount } = useReadContract({
    address: DonationPool as `0x${string}`,
    abi: DONATION_POOL_ABI,
    functionName: "getProjectCount",
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (projectCount !== undefined) {
      const count = Number(projectCount);
      const projectPromises = [];

      for (let i = 0; i < count; i++) {
        projectPromises.push(
          fetch(`/api/project/${i}`).then((res) => res.json())
        );
      }

      Promise.all(projectPromises)
        .then(setProjects)
        .finally(() => setIsLoading(false));
    }
  }, [projectCount]);

  return {
    projects,
    projectCount: projectCount ? Number(projectCount) : 0,
    isLoading,
  };
}

/**
 * Hook to get donor's total donations
 */
export function useDonorStats(address?: string) {
  const { address: connectedAddress } = useAccount();
  const { DonationPool } = useContractAddresses();
  const donorAddress = address || connectedAddress;

  const { data: totalDonations, isLoading } = useReadContract({
    address: DonationPool as `0x${string}`,
    abi: DONATION_POOL_ABI,
    functionName: "getDonorTotal",
    args: donorAddress ? [donorAddress as `0x${string}`] : undefined,
  });

  return {
    totalDonations: totalDonations
      ? formatEther(totalDonations as bigint)
      : "0",
    totalDonationsWei: totalDonations as bigint,
    isLoading,
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
