"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Award, Trophy, Lock, Sparkles, Star } from "lucide-react";
import { useContractAddresses } from "@/hooks/use-contracts";
import { SMILE_BADGE_NFT_ABI } from "@/lib/abis/SmileBadgeNFT";

const badgeInfo = [
  {
    name: "First Step",
    description: "First donation",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCHGw2BIvSx41HOA-q6257_Azda7DU1oTsA_0B0wjtt5sKECNopKXOzWCo_BYTk_phLG78rbprtwd-bP05Ql7I7zDwysn-HVLiba3oXVOX6c73DfAul5Z7ZjSULSWqwM0YTQys8GWMA1izkEg0lBYGhPyGSg5f_xxC0RBKgI9zLWLshGf9YDwNGem0LNF89VSE837XE0gwIYXXHkKcFGFVnYrmKSRqI9CqBSU5OBSmbSon-xTbj15XcS40QrsfNPYGbY8plpR_Z3P6H",
    alt: "Golden star badge",
    level: 1,
    gradient: "from-yellow-400/20 to-amber-500/20",
  },
  {
    name: "Community Builder",
    description: "Multiple projects",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwFzE4jVvbANa5Nw1L_qJY0s1Ut50QMM5je92NAXIrFbbADTsWIBScO6W0I6L1ze-PQOqJIsPBvUzsB0vg1sJdCeL1A9WdU9MDYG1a11Q07Y-MhoLsXe7646YTBi_MP89wJw3oAL5TTfenthz_2zjpPvLwVRdo1etUzTmcUi9CC6wZWjouTTZFqvXc0T1bGB_QT6nMJqF7Fke62jm2HFsRiLz2t8c313AwB7LC0GTyNNynsz7pX9exc96dQtYmc4e56uECOHa-JgG4",
    alt: "Community badge",
    level: 2,
    gradient: "from-blue-400/20 to-cyan-500/20",
  },
  {
    name: "Impact Champion",
    description: "5+ projects funded",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC8CWrL9J68D4ept6PFontXnK-NaJWUsqoVQAFEalXikv2dQ_UaFbEs3IM1EIiFJcgzxeTbrA8b57DhTWpRL8E4TOqwGZLrYEnL0gvBlVSFzHCxZhCE7Vhfl9mWTJoYa9SsmMr1lzdifBjadF3f6LtoKZnwx18FEv9_Xfiub9d-ujm104VI8nO6vioJWxqTEDQTR1BLQ4EsAKw1b7EhdvoxnEcvqyMxK01z4HFzz-igA1fHiMEi7RkOcc5IcnrBM-qnH_hX9MCd9lbC",
    alt: "Trophy badge",
    level: 3,
    gradient: "from-purple-400/20 to-pink-500/20",
  },
  {
    name: "PaySmile Legend",
    description: "10+ projects funded",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDs5ynAt10MUjKUXhrE6cXVzirrUS_8-6EUNLXziLVsLWCODCUXW7xhKa68F2QngJj0vc5WODaah6cq6IDLDNDkcYz-Hhr31E6eAGEmVzpZrKTUqDp_DJwYaXw_DFgdemooq70tFZbnYPxHlb9vbfoOT_YZpbs3p0sBNKby6ufO5TZKWkOa_6ttCXtrb2hSwyMHle2C7QA_Vlw-gbYGhJsUhVmZRn_BYFp_t_F-B05Fy8OaVqeJROKscPe2itxXtwtzXQ4YY2JKoWuC",
    alt: "Legendary diamond badge",
    level: 4,
    gradient: "from-orange-400/20 to-red-500/20",
  },
];

export default function BadgesPage() {
  const { address, isConnected } = useAccount();
  const { SmileBadgeNFT } = useContractAddresses();
  const [userBadges, setUserBadges] = useState<number[]>([]);

  // Read badges from contract
  const { data: badgeBalance, isLoading } = useReadContract({
    address: SmileBadgeNFT as `0x${string}`,
    abi: SMILE_BADGE_NFT_ABI,
    functionName: "getBadgesByOwner",
    args: address ? [address] : undefined,
  });

  const badgeCount = badgeBalance
    ? (badgeBalance as readonly bigint[]).length
    : 0;

  // Simulate earned badges based on balance (for demo)
  useEffect(() => {
    if (badgeCount > 0) {
      const earned = [];
      for (let i = 0; i < Math.min(badgeCount, badgeInfo.length); i++) {
        earned.push(i);
      }
      setUserBadges(earned);
    }
  }, [badgeCount]);

  return (
    <div className="w-full bg-gradient-to-b from-background via-primary/5 to-background text-foreground overflow-x-hidden">
      {/* Minimal Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Smile Badges
            </h1>
          </div>
          {isConnected && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">
                {badgeCount}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 p-4 space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Not Connected State */}
        {!isConnected && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative">
              <Award className="h-20 w-20 text-primary/20" />
              <Sparkles className="h-8 w-8 text-primary absolute -top-2 -right-2 animate-pulse" />
            </div>
            <p className="text-muted-foreground text-center max-w-xs">
              Connect wallet to view your achievement badges
            </p>
          </div>
        )}

        {/* Badges Grid */}
        {isConnected && !isLoading && (
          <>
            {/* Progress Ring - Compact */}
            <div className="flex flex-col items-center py-4 space-y-2">
              <div className="relative">
                <svg className="h-24 w-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-primary/10"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 40 * (1 - badgeCount / badgeInfo.length)
                    }`}
                    className="text-primary transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {badgeCount}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    of {badgeInfo.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: badgeInfo.length }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < badgeCount
                        ? "text-primary fill-primary"
                        : "text-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Badges Grid - Compact & Clear */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {badgeInfo.map((badge, index) => {
                const isEarned = userBadges.includes(index);
                return (
                  <Card
                    key={index}
                    className={`relative overflow-hidden border transition-all duration-300 ${
                      isEarned
                        ? `border-primary/40 bg-gradient-to-br ${badge.gradient} shadow-md hover:shadow-lg`
                        : "border-muted/30 bg-muted/5"
                    }`}
                  >
                    {/* Shimmer effect for earned badges */}
                    {isEarned && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
                    )}

                    <CardContent className="p-1.5 space-y-1">
                      {/* Badge Image - Smaller */}
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-background/50 to-muted/10">
                        <Image
                          src={badge.imgSrc}
                          alt={badge.alt}
                          fill
                          className={`object-contain p-1.5 transition-all duration-300 ${
                            isEarned
                              ? "scale-100 opacity-100"
                              : "scale-95 opacity-30 grayscale"
                          }`}
                        />

                        {/* Simple lock for locked badges */}
                        {!isEarned && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/20">
                            <div className="p-1 rounded-full bg-background/80 backdrop-blur-sm">
                              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          </div>
                        )}

                        {/* Level badge - Top right */}
                        {isEarned && (
                          <div className="absolute top-0.5 right-0.5">
                            <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold shadow-md">
                              <Star className="h-1.5 w-1.5 fill-current" />
                              {badge.level}
                            </div>
                          </div>
                        )}

                        {/* Checkmark - Top left */}
                        {isEarned && (
                          <div className="absolute top-0.5 left-0.5">
                            <div className="p-0.5 rounded-full bg-green-500 shadow-md">
                              <Award className="h-2 w-2 text-white" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Badge Info - Compact */}
                      <div className="text-center space-y-0">
                        <h3
                          className={`font-semibold text-[10px] leading-tight ${
                            isEarned
                              ? "text-foreground"
                              : "text-muted-foreground/60"
                          }`}
                        >
                          {badge.name}
                        </h3>
                        <p
                          className={`text-[8px] leading-tight ${
                            isEarned
                              ? "text-muted-foreground/80"
                              : "text-muted-foreground/40"
                          }`}
                        >
                          {badge.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Achievement Message */}
            {badgeCount === badgeInfo.length && (
              <Card className="border-primary bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20">
                <CardContent className="p-4 text-center space-y-2">
                  <div className="flex justify-center">
                    <Trophy className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="font-bold text-primary text-lg">
                    Collection Complete! 🎉
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You've earned all available badges!
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
