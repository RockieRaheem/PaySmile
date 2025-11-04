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
  // Celo Alfajores Testnet (Chain ID: 44787)
  celoAlfajores: {
    chainId: 44787,
    DonationPool:
      process.env.NEXT_PUBLIC_DONATION_POOL_ADDRESS ||
      "0x7726637769da3CF89F0502bF124522B6f58e4aa5",
    SmileBadgeNFT:
      process.env.NEXT_PUBLIC_SMILE_BADGE_NFT_ADDRESS ||
      "0x0A0Be3D3c76b301007E0Ab612b36a9E72bAEd4F3",
  },
  // Celo Sepolia Testnet (Chain ID: 11142220)
  celoSepolia: {
    chainId: 11142220,
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
    case 44787:
      return CONTRACTS.celoAlfajores;
    case 11142220:
      return CONTRACTS.celoSepolia;
    default:
      console.warn(`Unsupported chain ID: ${chainId}, using Alfajores`);
      return CONTRACTS.celoAlfajores; // Default to Alfajores testnet
  }
}
