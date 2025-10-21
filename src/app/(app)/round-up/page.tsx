"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useDonate } from "@/hooks/use-contracts";
import { Loader2, TrendingUp, Heart, Calculator } from "lucide-react";
import { NetworkChecker } from "@/components/NetworkChecker";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function RoundUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { donate, isPending, isConfirming, isSuccess } = useDonate();

  const [paymentAmount, setPaymentAmount] = useState("");
  const [roundUpTo, setRoundUpTo] = useState("nearest_hundred");

  // Calculate round-up
  const calculateRoundUp = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0)
      return { original: 0, roundedUp: 0, donation: 0 };

    let roundedAmount = amount;

    switch (roundUpTo) {
      case "nearest_ten":
        roundedAmount = Math.ceil(amount / 10) * 10;
        break;
      case "nearest_hundred":
        roundedAmount = Math.ceil(amount / 100) * 100;
        break;
      case "nearest_thousand":
        roundedAmount = Math.ceil(amount / 1000) * 1000;
        break;
      case "nearest_whole":
        roundedAmount = Math.ceil(amount);
        break;
    }

    const donationAmount = roundedAmount - amount;

    return {
      original: amount,
      roundedUp: roundedAmount,
      donation: donationAmount,
    };
  };

  const { original, roundedUp, donation } = calculateRoundUp();

  const handleRoundUpDonate = async () => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to donate.",
      });
      return;
    }

    if (donation <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a payment amount to round up.",
      });
      return;
    }

    try {
      // Convert UGX to CELO (for demo purposes, using 1 UGX = 0.0001 CELO)
      const donationInCelo = (donation * 0.0001).toFixed(6);

      await donate(donationInCelo);

      toast({
        title: "Round-Up Donation Submitted! 🎉",
        description: `Donating ${donation.toFixed(
          0
        )} UGX (${donationInCelo} CELO) to community projects.`,
      });

      // Clear form after successful donation
      setTimeout(() => {
        if (isSuccess) {
          setPaymentAmount("");
          toast({
            title: "Donation Confirmed! ✅",
            description: "Your round-up has been added to the community pool!",
          });
        }
      }, 3000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Donation Failed",
        description: error.message || "Failed to process round-up donation",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Round-Up Donations</h1>
            <p className="text-sm text-muted-foreground">
              Turn spare change into big impact
            </p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Calculator className="mr-1 h-3 w-3" />
            Auto-Calculate
          </Badge>
        </div>
      </header>

      {/* Network checker */}
      <div className="px-4 pt-2">
        <NetworkChecker />
      </div>

      <main className="flex-1 space-y-6 overflow-y-auto p-4">
        {/* How It Works */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="h-5 w-5 text-primary" />
              How Round-Up Donations Work
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-bold text-primary">1.</span>
              <p>
                Enter your payment amount (e.g., buying airtime for 1,950 UGX)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-primary">2.</span>
              <p>
                We automatically round it up to the nearest hundred (2,000 UGX)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-primary">3.</span>
              <p>
                The difference (50 UGX) becomes your donation to community
                projects
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-primary">4.</span>
              <p className="font-semibold text-primary">
                Small change → Big smiles! 😊
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Simulator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Simulate Your Payment</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter the amount you're paying (in UGX)
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="payment">Payment Amount</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="payment"
                  type="number"
                  placeholder="e.g., 1,950"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="text-lg"
                />
                <span className="text-sm font-semibold text-muted-foreground">
                  UGX
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Common amounts: Airtime (1,000-5,000), Shopping (10,000-50,000)
              </p>
            </div>

            {/* Round-Up Options */}
            <div className="space-y-2">
              <Label>Round Up To</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "nearest_ten", label: "Nearest 10" },
                  { value: "nearest_hundred", label: "Nearest 100" },
                  { value: "nearest_thousand", label: "Nearest 1,000" },
                  { value: "nearest_whole", label: "Nearest Whole" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={roundUpTo === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRoundUpTo(option.value)}
                    className="text-xs"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Calculation Display */}
            {paymentAmount && donation > 0 && (
              <div className="space-y-3 rounded-lg bg-primary/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Your Payment
                  </span>
                  <span className="font-semibold">
                    {original.toLocaleString()} UGX
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Rounded To
                  </span>
                  <span className="font-semibold">
                    {roundedUp.toLocaleString()} UGX
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">
                    Your Donation
                  </span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {donation.toFixed(0)} UGX
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ≈ {(donation * 0.0001).toFixed(6)} CELO
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Donate Button */}
            <Button
              size="lg"
              className="w-full text-base font-semibold"
              onClick={handleRoundUpDonate}
              disabled={
                !paymentAmount || donation <= 0 || isPending || isConfirming
              }
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Round-Up...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-5 w-5" />
                  Donate{" "}
                  {donation > 0 ? `${donation.toFixed(0)} UGX` : "Round-Up"}
                </>
              )}
            </Button>

            {!isConnected && (
              <p className="text-center text-sm text-muted-foreground">
                Connect your wallet to make donations
              </p>
            )}
          </CardContent>
        </Card>

        {/* Impact Examples */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-green-700">
              <TrendingUp className="h-5 w-5" />
              Your Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-green-700">
            <p>
              <span className="font-bold">50 UGX/day</span> = 1,500 UGX/month →
              Helps build a water well
            </p>
            <p>
              <span className="font-bold">100 UGX/day</span> = 3,000 UGX/month →
              Provides school supplies
            </p>
            <p>
              <span className="font-bold">200 UGX/day</span> = 6,000 UGX/month →
              Plants 50 trees
            </p>
          </CardContent>
        </Card>

        {/* Quick Examples */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Try These Examples</Label>
          <div className="grid grid-cols-3 gap-2">
            {["1950", "4750", "12800"].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setPaymentAmount(amount)}
                className="text-xs"
              >
                {parseInt(amount).toLocaleString()} UGX
              </Button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
