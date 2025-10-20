/**
 * Contract addresses for different networks
 * Update these after deploying contracts
 */

export const CONTRACTS = {
  // Celo Alfajores Testnet
  alfajores: {
    chainId: 44787,
    DonationPool: process.env.NEXT_PUBLIC_DONATION_POOL_ADDRESS || '',
    SmileBadgeNFT: process.env.NEXT_PUBLIC_SMILE_BADGE_NFT_ADDRESS || '',
  },
  // Celo Mainnet (for production)
  celo: {
    chainId: 42220,
    DonationPool: '',
    SmileBadgeNFT: '',
  },
} as const;

/**
 * Get contract addresses for current network
 */
export function getContractAddresses(chainId: number) {
  switch (chainId) {
    case 44787:
      return CONTRACTS.alfajores;
    case 42220:
      return CONTRACTS.celo;
    default:
      console.warn(`Unsupported chain ID: ${chainId}`);
      return CONTRACTS.alfajores; // Default to testnet
  }
}
