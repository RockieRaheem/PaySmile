"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Award, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateDonorNFT } from "@/ai/flows/generate-donor-nft";

export default function SettingsPage() {
  const [nftImage, setNftImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClaimBadge = async () => {
    setIsLoading(true);
    setNftImage(null);
    try {
      const result = await generateDonorNFT({
        donationAmount: 500,
        projectName: "Test Project",
        donorName: "Valued Donor",
      });
      if (result.nftDataUri) {
        setNftImage(result.nftDataUri);
        toast({
          title: "Badge Claimed!",
          description: "Your test NFT badge has been generated.",
        });
      }
    } catch (error) {
      console.error("Error generating NFT:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not generate the test badge.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 pb-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-bold">Settings</h1>
        <div className="w-12" />
      </header>
      <main className="flex-1 p-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User profile settings will be here.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="text-primary"/>
                My Smile Badges (NFTs)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p>Generating your badge...</p>
                </div>
              )}
              {nftImage && (
                <div className="flex flex-col items-center">
                  <Image
                    src={nftImage}
                    alt="Generated NFT Badge"
                    width={256}
                    height={256}
                    className="mb-4 rounded-lg border"
                  />
                   <p className="mb-4 text-center text-sm text-muted-foreground">Here is your newly minted Smile Badge! In a real app, this would be saved to your account.</p>
                </div>
              )}
              <Button onClick={handleClaimBadge} disabled={isLoading} className="w-full">
                {isLoading ? "Claiming..." : nftImage ? "Claim Another Test Badge" : "Claim a Test Badge"}
              </Button>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notification settings will be here.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
