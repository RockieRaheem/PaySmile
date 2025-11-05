/**
 * Badge image URLs and metadata
 * Using high-quality images from Google's Aida public storage
 */

export const BADGE_IMAGES = {
  BRONZE: {
    tier: "Bronze",
    name: "First Step",
    description: "Your first donation - every journey begins with courage!",
    minAmount: 10,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCHGw2BIvSx41HOA-q6257_Azda7DU1oTsA_0B0wjtt5sKECNopKXOzWCo_BYTk_phLG78rbprtwd-bP05Ql7I7zDwysn-HVLiba3oXVOX6c73DfAul5Z7ZjSULSWqwM0YTQys8GWMA1izkEg0lBYGhPyGSg5f_xxC0RBKgI9zLWLshGf9YDwNGem0LNF89VSE837XE0gwIYXXHkKcFGFVnYrmKSRqI9CqBSU5OBSmbSon-xTbj15XcS40QrsfNPYGbY8plpR_Z3P6H",
    color: "from-amber-400 to-yellow-600",
    glow: "shadow-[0_0_30px_rgba(251,191,36,0.5)]",
    emoji: "⭐",
  },
  SILVER: {
    tier: "Silver",
    name: "Community Builder",
    description: "Supporting multiple causes - you're building bridges!",
    minAmount: 50,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwFzE4jVvbANa5Nw1L_qJY0s1Ut50QMM5je92NAXIrFbbADTsWIBScO6W0I6L1ze-PQOqJIsPBvUzsB0vg1sJdCeL1A9WdU9MDYG1a11Q07Y-MhoLsXe7646YTBi_MP89wJw3oAL5TTfenthz_2zjpPvLwVRdo1etUzTmcUi9CC6wZWjouTTZFqvXc0T1bGB_QT6nMJqF7Fke62jm2HFsRiLz2t8c313AwB7LC0GTyNNynsz7pX9exc96dQtYmc4e56uECOHa-JgG4",
    color: "from-cyan-400 to-blue-600",
    glow: "shadow-[0_0_30px_rgba(34,211,238,0.5)]",
    emoji: "🌟",
  },
  GOLD: {
    tier: "Gold",
    name: "Impact Champion",
    description: "Major donations - you're changing lives at scale!",
    minAmount: 100,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC8CWrL9J68D4ept6PFontXnK-NaJWUsqoVQAFEalXikv2dQ_UaFbEs3IM1EIiFJcgzxeTbrA8b57DhTWpRL8E4TOqwGZLrYEnL0gvBlVSFzHCxZhCE7Vhfl9mWTJoYa9SsmMr1lzdifBjadF3f6LtoKZnwx18FEv9_Xfiub9d-ujm104VI8nO6vioJWxqTEDQTR1BLQ4EsAKw1b7EhdvoxnEcvqyMxK01z4HFzz-igA1fHiMEi7RkOcc5IcnrBM-qnH_hX9MCd9lbC",
    color: "from-purple-400 to-pink-600",
    glow: "shadow-[0_0_30px_rgba(192,132,252,0.5)]",
    emoji: "🏆",
  },
  PLATINUM: {
    tier: "Platinum",
    name: "PaySmile Legend",
    description: "Legendary generosity - you're a beacon of hope!",
    minAmount: 250,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDs5ynAt10MUjKUXhrE6cXVzirrUS_8-6EUNLXziLVsLWCODCUXW7xhKa68F2QngJj0vc5WODaah6cq6IDLDNDkcYz-Hhr31E6eAGEmVzpZrKTUqDp_DJwYaXw_DFgdemooq70tFZbnYPxHlb9vbfoOT_YZpbs3p0sBNKby6ufO5TZKWkOa_6ttCXtrb2hSwyMHle2C7QA_Vlw-gbYGhJsUhVmZRn_BYFp_t_F-B05Fy8OaVqeJROKscPe2itxXtwtzXQ4YY2JKoWuC",
    color: "from-orange-400 to-red-600",
    glow: "shadow-[0_0_40px_rgba(251,146,60,0.7)]",
    emoji: "💎",
  },
  DIAMOND: {
    tier: "Diamond",
    name: "Transformational Donor",
    description: "Extraordinary impact - you're rewriting futures!",
    minAmount: 500,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC_Kqp8xGFZJ0OQlYNFiZC8lZH-Q7sD3gAcw8N4R2hT6vUMN9L5wKmY1pQoJ8sV4hB3nF7xE2rL9mZ5tK1pW8dS6jU5hV3gN4mO2lP7rR6qK4wT8sM3bF9nX5cY",
    color: "from-indigo-400 via-purple-500 to-pink-600",
    glow: "shadow-[0_0_50px_rgba(139,92,246,0.8)]",
    emoji: "👑",
  },
};

/**
 * Get badge metadata based on donation amount
 */
export function getBadgeForAmount(amountUSD: number) {
  if (amountUSD >= 500) return BADGE_IMAGES.DIAMOND;
  if (amountUSD >= 250) return BADGE_IMAGES.PLATINUM;
  if (amountUSD >= 100) return BADGE_IMAGES.GOLD;
  if (amountUSD >= 50) return BADGE_IMAGES.SILVER;
  if (amountUSD >= 10) return BADGE_IMAGES.BRONZE;
  return null; // Below minimum threshold
}

/**
 * Get badge tier index for smart contract
 */
export function getBadgeTypeFromAmount(amountUSD: number): number {
  if (amountUSD >= 500) return 6; // DIAMOND
  if (amountUSD >= 250) return 4; // HEALTH_HERO (Platinum)
  if (amountUSD >= 100) return 5; // GREEN_GUARDIAN (Gold)
  if (amountUSD >= 50) return 2; // EDUCATION_CHAMPION (Silver)
  if (amountUSD >= 10) return 0; // FIRST_STEP (Bronze)
  return 0;
}

/**
 * Generate achievement messages for gamification
 */
export function getAchievementMessage(tier: string, projectName: string) {
  const messages = {
    Bronze: [
      "🎉 You earned your first badge!",
      `Every great journey starts with a single step. Welcome to the PaySmile community!`,
    ],
    Silver: [
      "🌟 Silver Badge Unlocked!",
      `You're building momentum! Your support for ${projectName} is making waves.`,
    ],
    Gold: [
      "🏆 Gold Champion Status Achieved!",
      `Wow! Your $100+ donation to ${projectName} is transforming lives. You're a true champion!`,
    ],
    Platinum: [
      "💎 Platinum Legend Status!",
      `Incredible! Your $250+ contribution is legendary. You're rewriting stories for entire communities!`,
    ],
    Diamond: [
      "👑 Diamond Tier - Elite Philanthropist!",
      `Extraordinary! Your $500+ donation places you among the elite. You're creating lasting change!`,
    ],
  };

  return messages[tier as keyof typeof messages] || messages.Bronze;
}

/**
 * Badge tier progression for UI
 */
export const BADGE_PROGRESSION = [
  { tier: "Bronze", amount: 10, progress: 0 },
  { tier: "Silver", amount: 50, progress: 20 },
  { tier: "Gold", amount: 100, progress: 40 },
  { tier: "Platinum", amount: 250, progress: 60 },
  { tier: "Diamond", amount: 500, progress: 100 },
];

/**
 * Get next badge tier for progression display
 */
export function getNextBadgeTier(currentAmountUSD: number) {
  for (const badge of BADGE_PROGRESSION) {
    if (currentAmountUSD < badge.amount) {
      return {
        ...badge,
        remaining: badge.amount - currentAmountUSD,
      };
    }
  }
  return null; // Already at max tier
}
