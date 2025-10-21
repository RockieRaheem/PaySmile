"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useSwitchChain,
} from "wagmi";
import { celoAlfajores } from "wagmi/chains";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Wallet,
  Settings,
  TrendingUp,
  Shield,
  Check,
  ChevronRight,
  Zap,
  Chrome,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SetupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const { switchChain } = useSwitchChain();

  const [showSettings, setShowSettings] = useState(false);
  const [monthlyLimit, setMonthlyLimit] = useState(5000);
  const [roundUpAmount, setRoundUpAmount] = useState("100");
  const [autoRoundUp, setAutoRoundUp] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [walletAcknowledged, setWalletAcknowledged] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const valoraLogo = PlaceHolderImages.find((img) => img.id === "valora-logo");
  const celoLogo = PlaceHolderImages.find((img) => img.id === "celo-logo");

  // Show settings section only after user acknowledges wallet connection
  useEffect(() => {
    if (isConnected && address && walletAcknowledged) {
      setShowSettings(true);
    }
  }, [isConnected, address, walletAcknowledged]);

  // Auto-switch to Celo Alfajores if connected to wrong network
  useEffect(() => {
    if (isConnected && chain && chain.id !== celoAlfajores.id) {
      // Automatically switch to Celo Alfajores
      switchChain?.({ chainId: celoAlfajores.id });
      toast({
        title: "Switching Network",
        description: "Switching to Celo Alfajores Testnet...",
      });
    }
  }, [isConnected, chain, switchChain, toast]);

  const handleConnect = async (connector: any) => {
    try {
      setConnectingId(connector.id);
      setHasInteracted(true); // Mark that user explicitly connected
      await connect({ connector });
      toast({
        title: "Wallet Connected! 🎉",
        description: `Connected to ${connector.name}`,
      });
      // Don't auto-proceed - let user review their connection
    } catch (err: any) {
      console.error("Connection error:", err);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: err?.message || "Failed to connect wallet.",
      });
      setConnectingId(null);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowSettings(false);
    setWalletAcknowledged(false);
    setHasInteracted(false);
    toast({
      title: "Wallet Disconnected",
      description: "You've been disconnected from your wallet.",
    });
  };

  const handleLimitChange = (amount: number) => {
    setMonthlyLimit((prev) => Math.max(0, prev + amount));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem(
        "donationSettings",
        JSON.stringify({ monthlyLimit, roundUpAmount, autoRoundUp })
      );
      setIsSaving(false);
      toast({
        title: "All Set! 🚀",
        description: "Your donation preferences have been saved.",
      });
      router.push("/dashboard");
    }, 1000);
  };

  const purchaseAmount = 9547;
  const roundupValue = parseInt(roundUpAmount, 10);
  const totalAmount = Math.ceil(purchaseAmount / roundupValue) * roundupValue;
  const donationAmount = totalAmount - purchaseAmount;

  const injectedConnector = connectors.find((c) => c.id === "injected");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-secondary/10 to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <span className="material-symbols-outlined">arrow_back</span>
          </Button>
          <h1 className="text-lg font-bold">Get Started</h1>
          {isConnected && (
            <Button variant="ghost" size="icon" onClick={handleDisconnect}>
              <LogOut className="h-5 w-5" />
            </Button>
          )}
          {!isConnected && <div className="w-10" />}
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6 pb-24">
        {/* Welcome Section */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            {!isConnected || !hasInteracted ? (
              <Wallet className="h-10 w-10 text-primary" />
            ) : showSettings ? (
              <Settings className="h-10 w-10 text-primary" />
            ) : (
              <Check className="h-10 w-10 text-green-500" />
            )}
          </div>
          <h2 className="mb-2 text-2xl font-bold">
            {!isConnected || !hasInteracted
              ? "Connect Your Wallet"
              : showSettings
              ? "Setup Your Donations"
              : "Wallet Connected! ✅"}
          </h2>
          <p className="text-muted-foreground">
            {!isConnected || !hasInteracted
              ? "Connect your wallet to start making donations"
              : showSettings
              ? "Configure your donation preferences below"
              : "Review your connection and continue"}
          </p>
        </div>

        {/* Wallet Connection Section */}
        {(!isConnected || !hasInteracted) && (
          <div className="space-y-4">
            {/* Benefits */}
            <div className="grid gap-3">
              {[
                {
                  icon: Shield,
                  title: "Secure & Private",
                  description: "Your keys stay with you",
                },
                {
                  icon: Zap,
                  title: "Instant Connection",
                  description: "Connect in seconds",
                },
                {
                  icon: TrendingUp,
                  title: "Track Impact",
                  description: "See your donation history",
                },
              ].map((benefit, index) => (
                <Card key={index} className="border-0 bg-card/50 backdrop-blur">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{benefit.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Wallet Logos */}
            <div className="flex items-center justify-center gap-4 py-4">
              {valoraLogo && (
                <div className="rounded-2xl bg-white p-3 shadow-md">
                  <Image
                    src={valoraLogo.imageUrl}
                    alt="Valora"
                    width={40}
                    height={40}
                    className="object-contain"
                    data-ai-hint={valoraLogo.imageHint}
                  />
                </div>
              )}
              {celoLogo && (
                <div className="rounded-2xl bg-white p-3 shadow-md">
                  <Image
                    src={celoLogo.imageUrl}
                    alt="Celo"
                    width={40}
                    height={40}
                    className="object-contain"
                    data-ai-hint={celoLogo.imageHint}
                  />
                </div>
              )}
            </div>

            {/* Connect Button */}
            {injectedConnector && (
              <Button
                size="lg"
                className="h-16 w-full rounded-xl text-lg font-semibold shadow-lg"
                onClick={() => handleConnect(injectedConnector)}
                disabled={connectingId === injectedConnector.id || isPending}
              >
                {connectingId === injectedConnector.id || isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin mr-3">
                      progress_activity
                    </span>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Chrome className="mr-3 h-6 w-6" />
                    Connect with MetaMask
                  </>
                )}
              </Button>
            )}

            {/* Help Text */}
            <div className="text-center">
              <p className="mb-2 text-sm text-muted-foreground">
                <Shield className="inline h-4 w-4 text-green-500" /> Secure
                connection
              </p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Don't have MetaMask? Download here →
              </a>
            </div>
          </div>
        )}

        {/* Wallet Info Section - Shows when connected AND user has interacted */}
        {isConnected && address && hasInteracted && !showSettings && (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Check className="h-5 w-5 text-green-500" />
                Wallet Connected Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Address</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Balance</span>
                <span className="font-semibold">
                  {balance
                    ? `${parseFloat(balance.formatted).toFixed(4)} ${
                        balance.symbol
                      }`
                    : "Loading..."}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Network</span>
                {chain?.id === celoAlfajores.id ? (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    ✓ Celo Alfajores
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => switchChain?.({ chainId: celoAlfajores.id })}
                    className="h-7 text-xs"
                  >
                    Switch to Celo Alfajores
                  </Button>
                )}
              </div>

              <Separator className="my-3" />

              {/* Continue Button */}
              <Button
                size="lg"
                className="w-full rounded-xl text-base font-semibold"
                onClick={() => setWalletAcknowledged(true)}
                disabled={chain?.id !== celoAlfajores.id}
              >
                {chain?.id === celoAlfajores.id ? (
                  <>
                    Continue to Setup
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  "Please switch to Celo Alfajores"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Settings Section - Only shows when connected */}
        {showSettings && (
          <>
            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Donation Settings</h3>
              </div>

              {/* Auto Round-Up Toggle */}
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="space-y-1">
                    <Label
                      htmlFor="auto-roundup"
                      className="text-base font-medium"
                    >
                      Enable Automatic Round-Ups
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Round up payments automatically
                    </p>
                  </div>
                  <Switch
                    id="auto-roundup"
                    checked={autoRoundUp}
                    onCheckedChange={setAutoRoundUp}
                  />
                </CardContent>
              </Card>

              {/* Round-Up Amount Selection */}
              <Card>
                <CardContent className="p-4">
                  <p className="mb-3 font-medium">Round up to the nearest...</p>
                  <RadioGroup
                    value={roundUpAmount}
                    onValueChange={setRoundUpAmount}
                    className="rounded-xl bg-muted/50 p-1"
                  >
                    <div className="flex justify-between gap-2">
                      {[10, 50, 100].map((amount) => (
                        <Label
                          key={amount}
                          htmlFor={`round-up-${amount}`}
                          className={`flex h-12 flex-1 cursor-pointer items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                            roundUpAmount === String(amount)
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <RadioGroupItem
                            id={`round-up-${amount}`}
                            value={String(amount)}
                            className="sr-only"
                          />
                          {amount === 100 ? "1 CELO" : `${amount} cents`}
                        </Label>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Monthly Limit */}
              <Card>
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <Label className="text-base font-medium">
                      Monthly Donation Limit
                    </Label>
                    <p className="text-lg font-bold text-primary">
                      {monthlyLimit.toLocaleString()} CELO
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {[-1000, -500, 500, 1000].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => handleLimitChange(amount)}
                        className="flex-1"
                      >
                        {amount > 0 ? "+" : ""}
                        {amount}
                      </Button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Maximum amount you'll donate per month
                  </p>
                </CardContent>
              </Card>

              {/* Example Calculation */}
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Purchase Amount
                    </span>
                    <span className="font-mono">{purchaseAmount} CELO</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rounded To</span>
                    <span className="font-mono">{totalAmount} CELO</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="font-semibold text-primary">
                      Your Donation
                    </span>
                    <span className="text-lg font-bold text-primary">
                      +{donationAmount} CELO
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>

      {/* Fixed Bottom Button */}
      {showSettings && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button
            size="lg"
            className="h-14 w-full rounded-xl text-lg font-semibold shadow-lg"
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined animate-spin mr-2">
                  progress_activity
                </span>
                Saving...
              </>
            ) : (
              <>
                Continue to Dashboard
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
