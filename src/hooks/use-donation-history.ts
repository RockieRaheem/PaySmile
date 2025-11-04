/**
 * Custom hook to fetch and manage user's donation history
 * Reads donation events from DonationPool contract
 */

import { useEffect, useState, useCallback } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { formatEther } from "viem";
import { DONATION_POOL_ABI } from "@/lib/abis/DonationPool";
import { useContractAddresses } from "./use-contracts";
import {
  DonationEvent,
  DonationStats,
  DonationFilters,
  SortField,
  SortOrder,
} from "@/types/donation-history";
import { getBadgeTierName } from "./use-contracts";

// Approximate CELO to USD conversion rate (should be fetched from API in production)
const CELO_USD_RATE = 0.5;

export function useDonationHistory() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { DonationPool } = useContractAddresses();

  const [donations, setDonations] = useState<DonationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDonationHistory = useCallback(async () => {
    if (!address || !publicClient || !DonationPool) {
      setDonations([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch general pool donations (DonationReceived events)
      const generalDonationLogs = await publicClient.getLogs({
        address: DonationPool as `0x${string}`,
        event: {
          type: "event",
          name: "DonationReceived",
          inputs: [
            { type: "address", indexed: true, name: "donor" },
            { type: "uint256", indexed: false, name: "amount" },
            { type: "uint256", indexed: false, name: "timestamp" },
          ],
        },
        args: {
          donor: address,
        },
        fromBlock: BigInt(0),
        toBlock: "latest",
      });

      // Fetch project-specific donations (ProjectFunded events)
      const projectDonationLogs = await publicClient.getLogs({
        address: DonationPool as `0x${string}`,
        event: {
          type: "event",
          name: "ProjectFunded",
          inputs: [
            { type: "uint256", indexed: true, name: "projectId" },
            { type: "uint256", indexed: false, name: "amount" },
          ],
        },
        fromBlock: BigInt(0),
        toBlock: "latest",
      });

      // Get blocks to fetch timestamps
      const allLogs = [...generalDonationLogs, ...projectDonationLogs];
      const blocks = await Promise.all(
        allLogs.map((log) =>
          publicClient.getBlock({ blockNumber: log.blockNumber })
        )
      );

      // Process general donations
      const generalDonations: DonationEvent[] = await Promise.all(
        generalDonationLogs.map(async (log, index) => {
          const block = blocks.find((b) => b.number === log.blockNumber);
          const amountCelo = formatEther(log.args.amount as bigint);
          const amountUsd = (parseFloat(amountCelo) * CELO_USD_RATE).toFixed(2);

          return {
            id: `${log.transactionHash}-${log.logIndex}`,
            transactionHash: log.transactionHash!,
            blockNumber: log.blockNumber!,
            timestamp: new Date(Number(block?.timestamp || 0) * 1000),
            donor: address,
            projectId: null,
            projectName: "General Pool",
            amountCelo,
            amountUsd,
            badgeEarned:
              parseFloat(amountUsd) >= 10
                ? { tier: getBadgeTierName(parseFloat(amountUsd)) as any }
                : undefined,
            status: "confirmed" as const,
          };
        })
      );

      // Process project donations
      // Note: We need to filter for donations made by this user
      // ProjectFunded doesn't include donor address, so we check transaction sender
      const projectDonations: DonationEvent[] = [];

      for (const log of projectDonationLogs) {
        try {
          const transaction = await publicClient.getTransaction({
            hash: log.transactionHash!,
          });

          // Only include if transaction was sent by current user
          if (transaction.from.toLowerCase() === address.toLowerCase()) {
            const block = blocks.find((b) => b.number === log.blockNumber);
            const amountCelo = formatEther(log.args.amount as bigint);
            const amountUsd = (parseFloat(amountCelo) * CELO_USD_RATE).toFixed(
              2
            );
            const projectId = Number(log.args.projectId);

            // Fetch project name
            let projectName = `Project #${projectId}`;
            try {
              const projectData = (await publicClient.readContract({
                address: DonationPool as `0x${string}`,
                abi: DONATION_POOL_ABI,
                functionName: "getProject",
                args: [BigInt(projectId)],
              })) as any;

              if (projectData && projectData[0]) {
                projectName = projectData[0]; // First element is the name
              }
            } catch (e) {
              console.warn(`Failed to fetch project name for ID ${projectId}`);
            }

            projectDonations.push({
              id: `${log.transactionHash}-${log.logIndex}`,
              transactionHash: log.transactionHash!,
              blockNumber: log.blockNumber!,
              timestamp: new Date(Number(block?.timestamp || 0) * 1000),
              donor: address,
              projectId,
              projectName,
              amountCelo,
              amountUsd,
              badgeEarned:
                parseFloat(amountUsd) >= 10
                  ? { tier: getBadgeTierName(parseFloat(amountUsd)) as any }
                  : undefined,
              status: "confirmed" as const,
            });
          }
        } catch (e) {
          console.warn("Failed to process project donation log:", e);
        }
      }

      // Combine and sort by timestamp (newest first)
      const allDonations = [...generalDonations, ...projectDonations].sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );

      setDonations(allDonations);
    } catch (err) {
      console.error("Error fetching donation history:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [address, publicClient, DonationPool]);

  // Fetch on mount and when address changes
  useEffect(() => {
    fetchDonationHistory();
  }, [fetchDonationHistory]);

  return {
    donations,
    isLoading,
    error,
    refetch: fetchDonationHistory,
  };
}

/**
 * Hook to calculate donation statistics
 */
export function useDonationStats(donations: DonationEvent[]): DonationStats {
  const stats: DonationStats = {
    totalDonations: donations.length,
    totalAmountCelo: "0",
    totalAmountUsd: "0",
    badgesEarned: 0,
    projectsSupported: 0,
  };

  if (donations.length === 0) return stats;

  // Calculate totals
  const totalCelo = donations.reduce(
    (sum, d) => sum + parseFloat(d.amountCelo),
    0
  );
  const totalUsd = donations.reduce(
    (sum, d) => sum + parseFloat(d.amountUsd),
    0
  );

  stats.totalAmountCelo = totalCelo.toFixed(4);
  stats.totalAmountUsd = totalUsd.toFixed(2);

  // Count badges earned
  stats.badgesEarned = donations.filter((d) => d.badgeEarned).length;

  // Count unique projects
  const uniqueProjects = new Set(
    donations.filter((d) => d.projectId !== null).map((d) => d.projectId)
  );
  stats.projectsSupported = uniqueProjects.size;

  // First and last donation dates
  const sortedByDate = [...donations].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
  stats.firstDonationDate = sortedByDate[0]?.timestamp;
  stats.lastDonationDate = sortedByDate[sortedByDate.length - 1]?.timestamp;

  return stats;
}

/**
 * Hook to filter and sort donations
 */
export function useFilteredDonations(
  donations: DonationEvent[],
  filters: DonationFilters,
  sortField: SortField,
  sortOrder: SortOrder
) {
  const [filtered, setFiltered] = useState<DonationEvent[]>([]);

  useEffect(() => {
    let result = [...donations];

    // Apply filters
    if (filters.projectId !== undefined) {
      result = result.filter((d) => d.projectId === filters.projectId);
    }

    if (filters.dateFrom) {
      result = result.filter((d) => d.timestamp >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      result = result.filter((d) => d.timestamp <= filters.dateTo!);
    }

    if (filters.minAmount !== undefined) {
      result = result.filter(
        (d) => parseFloat(d.amountUsd) >= filters.minAmount!
      );
    }

    if (filters.maxAmount !== undefined) {
      result = result.filter(
        (d) => parseFloat(d.amountUsd) <= filters.maxAmount!
      );
    }

    if (filters.badgeTier) {
      result = result.filter((d) => d.badgeEarned?.tier === filters.badgeTier);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "date":
          comparison = a.timestamp.getTime() - b.timestamp.getTime();
          break;
        case "amount":
          comparison = parseFloat(a.amountUsd) - parseFloat(b.amountUsd);
          break;
        case "project":
          comparison = a.projectName.localeCompare(b.projectName);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFiltered(result);
  }, [donations, filters, sortField, sortOrder]);

  return filtered;
}

/**
 * Utility to export donations to CSV
 */
export function exportDonationsToCSV(donations: DonationEvent[]) {
  const headers = [
    "Date",
    "Project",
    "Amount (CELO)",
    "Amount (USD)",
    "Badge Earned",
    "Transaction Hash",
  ];

  const rows = donations.map((d) => [
    d.timestamp.toLocaleString(),
    d.projectName,
    d.amountCelo,
    d.amountUsd,
    d.badgeEarned?.tier || "None",
    d.transactionHash,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `paysmile-donations-${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
