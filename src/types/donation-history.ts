/**
 * Type definitions for donation history
 */

export interface DonationEvent {
  id: string; // Unique identifier (tx hash + log index)
  transactionHash: string;
  blockNumber: bigint;
  timestamp: Date;
  donor: string;
  projectId: number | null; // null for general pool donations
  projectName: string;
  amountCelo: string; // Amount in CELO
  amountUsd: string; // Approximate USD value
  badgeEarned?: BadgeInfo;
  status: "confirmed" | "pending" | "failed";
}

export interface BadgeInfo {
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  tokenId?: string;
  imageUrl?: string;
}

export interface DonationStats {
  totalDonations: number;
  totalAmountCelo: string;
  totalAmountUsd: string;
  badgesEarned: number;
  firstDonationDate?: Date;
  lastDonationDate?: Date;
  projectsSupported: number;
}

export interface DonationFilters {
  projectId?: number;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  badgeTier?: BadgeInfo["tier"];
}

export type SortField = "date" | "amount" | "project";
export type SortOrder = "asc" | "desc";
