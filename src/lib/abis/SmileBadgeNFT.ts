/**
 * SmileBadgeNFT Contract ABI
 * Generated from SmileBadgeNFT.sol
 */

export const SMILE_BADGE_NFT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum SmileBadgeNFT.BadgeType",
        name: "badgeType",
        type: "uint8",
      },
    ],
    name: "BadgeMinted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "enum SmileBadgeNFT.BadgeType",
        name: "badgeType",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "tokenURI",
        type: "string",
      },
    ],
    name: "mintBadge",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "getBadgesByOwner",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "enum SmileBadgeNFT.BadgeType",
        name: "badgeType",
        type: "uint8",
      },
    ],
    name: "hasBadge",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getBadgeType",
    outputs: [
      {
        internalType: "enum SmileBadgeNFT.BadgeType",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Badge type enum for TypeScript
export enum BadgeType {
  FIRST_STEP = 0,
  COMMUNITY_BUILDER = 1,
  EDUCATION_CHAMPION = 2,
  WATER_WARRIOR = 3,
  HEALTH_HERO = 4,
  GREEN_GUARDIAN = 5,
}

export const BADGE_METADATA = {
  [BadgeType.FIRST_STEP]: {
    name: "First Step",
    description: "For making your first donation.",
  },
  [BadgeType.COMMUNITY_BUILDER]: {
    name: "Community Builder",
    description: "Contributed to a project in all regions of Uganda.",
  },
  [BadgeType.EDUCATION_CHAMPION]: {
    name: "Education Champion",
    description: "Funded 3 education-focused projects.",
  },
  [BadgeType.WATER_WARRIOR]: {
    name: "Water Warrior",
    description: "Supported a clean water initiative.",
  },
  [BadgeType.HEALTH_HERO]: {
    name: "Health Hero",
    description: "Donated to 5 health projects.",
  },
  [BadgeType.GREEN_GUARDIAN]: {
    name: "Green Guardian",
    description: "Funded an environmental project.",
  },
} as const;
