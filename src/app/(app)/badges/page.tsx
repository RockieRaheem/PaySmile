"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Award, Trophy } from "lucide-react";
import { useContractAddresses } from "@/hooks/use-contracts";
import { SMILE_BADGE_NFT_ABI } from "@/lib/abis/SmileBadgeNFT";

const badgeInfo = [
  {
    name: "First Step",
    description: "For making your first donation.",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCHGw2BIvSx41HOA-q6257_Azda7DU1oTsA_0B0wjtt5sKECNopKXOzWCo_BYTk_phLG78rbprtwd-bP05Ql7I7zDwysn-HVLiba3oXVOX6c73DfAul5Z7ZjSULSWqwM0YTQys8GWMA1izkEg0lBYGhPyGSg5f_xxC0RBKgI9zLWLshGf9YDwNGem0LNF89VSE837XE0gwIYXXHkKcFGFVnYrmKSRqI9CqBSU5OBSmbSon-xTbj15XcS40QrsfNPYGbY8plpR_Z3P6H",
    alt: "Golden star badge with intricate patterns.",
    level: 1,
  },
  {
    name: "Community Builder",
    description: "Contributed to multiple community projects.",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwFzE4jVvbANa5Nw1L_qJY0s1Ut50QMM5je92NAXIrFbbADTsWIBScO6W0I6L1ze-PQOqJIsPBvUzsB0vg1sJdCeL1A9WdU9MDYG1a11Q07Y-MhoLsXe7646YTBi_MP89wJw3oAL5TTfenthz_2zjpPvLwVRdo1etUzTmcUi9CC6wZWjouTTZFqvXc0T1bGB_QT6nMJqF7Fke62jm2HFsRiLz2t8c313AwB7LC0GTyNNynsz7pX9exc96dQtYmc4e56uECOHa-JgG4",
    alt: "Badge showing a map with community pins.",
    level: 2,
  },
  {
    name: "Impact Champion",
    description: "Funded 5+ projects with your donations.",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC8CWrL9J68D4ept6PFontXnK-NaJWUsqoVQAFEalXikv2dQ_UaFbEs3IM1EIiFJcgzxeTbrA8b57DhTWpRL8E4TOqwGZLrYEnL0gvBlVSFzHCxZhCE7Vhfl9mWTJoYa9SsmMr1lzdifBjadF3f6LtoKZnwx18FEv9_Xfiub9d-ujm104VI8nO6vioJWxqTEDQTR1BLQ4EsAKw1b7EhdvoxnEcvqyMxK01z4HFzz-igA1fHiMEi7RkOcc5IcnrBM-qnH_hX9MCd9lbC",
    alt: "Badge with trophy and stars.",
    level: 3,
  },
  {
    name: "PaySmile Legend",
    description: "Elite donor with 10+ funded projects.",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDs5ynAt10MUjKUXhrE6cXVzirrUS_8-6EUNLXziLVsLWCODCUXW7xhKa68F2QngJj0vc5WODaah6cq6IDLDNDkcYz-Hhr31E6eAGEmVzpZrKTUqDp_DJwYaXw_DFgdemooq70tFZbnYPxHlb9vbfoOT_YZpbs3p0sBNKby6ufO5TZKWkOa_6ttCXtrb2hSwyMHle2C7QA_Vlw-gbYGhJsUhVmZRn_BYFp_t_F-B05Fy8OaVqeJROKscPe2itxXtwtzXQ4YY2JKoWuC",
    alt: "Legendary diamond badge with crown.",
    level: 4,
  },
];

export default function BadgesPage() {
  const { address, isConnected } = useAccount();
  const { SmileBadgeNFT } = useContractAddresses();
  const [userBadges, setUserBadges] = useState<number[]>([]);

  // Read badge balance from contract
  const { data: badgeBalance, isLoading } = useReadContract({
    address: SmileBadgeNFT as `0x${string}`,
    abi: SMILE_BADGE_NFT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const badgeCount = badgeBalance ? Number(badgeBalance) : 0;

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
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold">My Smile Badges</h1>
            <p className="text-sm text-muted-foreground">
              Your NFT achievements
            </p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Trophy className="mr-1 h-3 w-3" />
            {badgeCount} NFTs
          </Badge>
        </div>
      </header>

      <main className="flex-1 flex-col p-4 space-y-6">
        {/* Stats Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-5 w-5 text-primary" />
              Your Badge Collection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading badges...</span>
              </div>
            ) : !isConnected ? (
              <p className="text-sm text-muted-foreground">
                Connect your wallet to see your badges
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Badges Earned
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {badgeCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Available Badges
                  </span>
                  <span className="font-semibold">{badgeInfo.length}</span>
                </div>
                <div className="pt-2">
                  <div className="h-2.5 rounded-full bg-primary/20">
                    <div
                      className="h-2.5 rounded-full bg-primary transition-all"
                      style={{
                        width: `${(badgeCount / badgeInfo.length) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground text-right">
                    {Math.round((badgeCount / badgeInfo.length) * 100)}%
                    Complete
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Badges Grid */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">All Badges</h2>
          <div className="grid grid-cols-2 gap-4">
            {badgeInfo.map((badge, index) => {
              const isEarned = userBadges.includes(index);
              return (
                <Card
                  key={index}
                  className={`overflow-hidden transition-all ${
                    isEarned
                      ? "border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5"
                      : "opacity-50 grayscale"
                  }`}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="relative aspect-square">
                      <Image
                        src={badge.imgSrc}
                        alt={badge.alt}
                        fill
                        className="object-contain"
                      />
                      {isEarned && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground rounded-full p-1">
                          <Award className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{badge.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {badge.description}
                      </p>
                      {isEarned && (
                        <Badge
                          variant="secondary"
                          className="mt-2 text-xs bg-primary/20 text-primary"
                        >
                          Level {badge.level}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How to Earn More */}
        {badgeCount < badgeInfo.length && isConnected && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-green-700">
                How to Earn More Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-green-700">
              <p>• Make your first donation to unlock "First Step"</p>
              <p>• Support multiple projects to become a "Community Builder"</p>
              <p>• Reach milestones to earn higher-level badges</p>
              <p>• Each donation earns you blockchain-verified NFT badges!</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
