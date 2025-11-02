/**
 * Contract addresses for different networks
 * Update these after deploying contracts
 */

export const CONTRACTS = {
  // Localhost (Hardhat node)
  localhost: {
    chainId: 31337,
    DonationPool: "",
    SmileBadgeNFT: "",
  },
  // Sepolia Testnet (Ethereum)
  sepolia: {
    chainId: 11155111,
    DonationPool: process.env.NEXT_PUBLIC_DONATION_POOL_ADDRESS || "",
    SmileBadgeNFT: process.env.NEXT_PUBLIC_SMILE_BADGE_NFT_ADDRESS || "",
  },
} as const;

/**
 * Get contract addresses for current network
 */
export function getContractAddresses(chainId: number) {
  switch (chainId) {
    case 31337:
      return CONTRACTS.localhost;
    case 11155111:
      return CONTRACTS.sepolia;
    default:
      console.warn(`Unsupported chain ID: ${chainId}, using localhost`);
      return CONTRACTS.localhost; // Default to localhost for development
  }
}
