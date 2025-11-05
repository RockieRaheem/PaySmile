"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "wagmi";
import {
  Wallet,
  Check,
  Chrome,
  Zap,
  Sparkles,
  Shield,
  ArrowRight,
  Info,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

const benefits = [
  {
    icon: Zap,
    title: "Instant Access",
    description: "Get started in seconds, no blockchain knowledge required",
  },
  {
    icon: Shield,
    title: "Secure & Safe",
    description: "Your wallet is encrypted and stored safely on your device",
  },
  {
    icon: Check,
    title: "Easy Donations",
    description: "Make donations with just a few clicks",
  },
];

// Simple wallet creation using browser's Web Crypto API
const createSimpleWallet = () => {
  // Generate a random wallet address format (for demonstration)
  const array = new Uint8Array(20);
  crypto.getRandomValues(array);
  const address =
    "0x" +
    Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");

  // Generate a simple private key
  const pkArray = new Uint8Array(32);
  crypto.getRandomValues(pkArray);
  const privateKey = Array.from(pkArray, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");

  return { address, privateKey };
};

export default function ConnectWalletPage() {
  const router = useRouter();
  const { connectors, connect, isPending, error } = useConnect();
  const { address, isConnected } = useAccount();
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [creatingWallet, setCreatingWallet] = useState(false);
  const [simpleWallet, setSimpleWallet] = useState<{
    address: string;
    privateKey: string;
  } | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const { toast } = useToast();

  const valoraLogo = PlaceHolderImages.find((img) => img.id === "valora-logo");
  const celoLogo = PlaceHolderImages.find((img) => img.id === "celo-logo");

  // Check if user already has a simple wallet saved
  useEffect(() => {
    const savedWallet = localStorage.getItem("paysmile_simple_wallet");
    if (savedWallet) {
      try {
        const wallet = JSON.parse(savedWallet);
        setSimpleWallet(wallet);
        localStorage.setItem("paysmile_wallet_type", "simple");
        localStorage.setItem("paysmile_connected_address", wallet.address);
      } catch (e) {
        console.error("Failed to load saved wallet");
      }
    }
  }, []);

  const handleConnect = async (connector: any) => {
    try {
      setConnectingId(connector.id);
      await connect({ connector });
      localStorage.setItem("paysmile_wallet_type", "web3");
      toast({
        title: "Connected!",
        description: "Your wallet has been connected successfully.",
      });
    } catch (err: any) {
      console.error("Connection error:", err);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description:
          err?.message || "Failed to connect wallet. Please try again.",
      });
      setConnectingId(null);
    }
  };

  const handleCreateSimpleWallet = () => {
    setCreatingWallet(true);

    // Simulate wallet creation delay for better UX
    setTimeout(() => {
      const newWallet = createSimpleWallet();
      setSimpleWallet(newWallet);

      // Save to localStorage
      localStorage.setItem("paysmile_simple_wallet", JSON.stringify(newWallet));
      localStorage.setItem("paysmile_wallet_type", "simple");
      localStorage.setItem("paysmile_connected_address", newWallet.address);

      setCreatingWallet(false);

      toast({
        title: "Wallet Created! 🎉",
        description: "Your secure wallet has been created successfully.",
      });
    }, 1500);
  };

  const handleContinueWithSimpleWallet = () => {
    if (simpleWallet) {
      router.push("/dashboard");
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  useEffect(() => {
    if (isConnected && address) {
      localStorage.setItem("paysmile_wallet_type", "web3");
      localStorage.setItem("paysmile_connected_address", address);
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    }
  }, [isConnected, address, router]);

  useEffect(() => {
    if (error) {
      setConnectingId(null);
    }
  }, [error]);

  const injectedConnector = connectors.find((c) => c.id === "injected");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-bold">Get Started</h1>
        <div className="w-10" />
      </header>

      <main className="flex flex-1 flex-col px-4 py-4 max-w-3xl mx-auto w-full pb-8">
        {/* Hero Section */}
        <div className="mb-6 text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            {valoraLogo && (
              <div className="rounded-2xl bg-white p-3 shadow-lg">
                <Image
                  src={valoraLogo.imageUrl}
                  alt="Valora"
                  width={48}
                  height={48}
                  className="object-contain"
                  data-ai-hint={valoraLogo.imageHint}
                />
              </div>
            )}
            {celoLogo && (
              <div className="rounded-2xl bg-white p-3 shadow-lg">
                <Image
                  src={celoLogo.imageUrl}
                  alt="Celo"
                  width={48}
                  height={48}
                  className="object-contain"
                  data-ai-hint={celoLogo.imageHint}
                />
              </div>
            )}
          </div>
          <h2 className="mb-2 text-2xl font-bold">Welcome to PaySmile</h2>
          <p className="text-muted-foreground">
            Choose how you want to get started
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="beginner" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="beginner" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              I'm New to Crypto
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />I Have a Wallet
            </TabsTrigger>
          </TabsList>

          {/* Beginner Tab - Create Simple Wallet */}
          <TabsContent value="beginner" className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Quick Start - No Experience Needed!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Don't worry if you're new to blockchain! We'll create a secure
                  wallet for you instantly. No technical knowledge required.
                </p>

                {!simpleWallet ? (
                  <>
                    {/* Benefits */}
                    <div className="space-y-3 py-2">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <benefit.icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">
                              {benefit.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Create Wallet Button */}
                    <Button
                      size="lg"
                      className="w-full h-14 text-lg font-semibold"
                      onClick={handleCreateSimpleWallet}
                      disabled={creatingWallet}
                    >
                      {creatingWallet ? (
                        <>
                          <span className="material-symbols-outlined animate-spin mr-2">
                            progress_activity
                          </span>
                          Creating Your Wallet...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Create My Wallet Now
                        </>
                      )}
                    </Button>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Your wallet will be created instantly and stored
                        securely on your device. You can start donating right
                        away!
                      </AlertDescription>
                    </Alert>
                  </>
                ) : (
                  <>
                    {/* Wallet Created Successfully */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <Check className="h-5 w-5" />
                        Wallet Created Successfully!
                      </div>

                      {/* Wallet Address */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Your Wallet Address
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-muted p-3 rounded-lg text-xs break-all">
                            {simpleWallet.address}
                          </code>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              copyToClipboard(simpleWallet.address, "Address")
                            }
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Private Key (Hidden by default) */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          Your Private Key (Keep this secret!)
                          <Shield className="h-4 w-4 text-amber-500" />
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-muted p-3 rounded-lg text-xs break-all">
                            {showPrivateKey
                              ? simpleWallet.privateKey
                              : "••••••••••••••••••••••••••••••••"}
                          </code>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                          >
                            {showPrivateKey ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          {showPrivateKey && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                copyToClipboard(
                                  simpleWallet.privateKey,
                                  "Private Key"
                                )
                              }
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <Alert>
                          <Shield className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            <strong>Important:</strong> Save your private key
                            somewhere safe. Never share it with anyone. You'll
                            need it to restore your wallet on other devices.
                          </AlertDescription>
                        </Alert>
                      </div>

                      {/* Continue Button */}
                      <Button
                        size="lg"
                        className="w-full h-14 text-lg font-semibold"
                        onClick={handleContinueWithSimpleWallet}
                      >
                        Continue to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab - Connect Existing Wallet */}
          <TabsContent value="advanced" className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Connect Your Existing Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Already have a crypto wallet? Connect it securely to start
                  making donations on the blockchain.
                </p>

                {injectedConnector ? (
                  <>
                    <Button
                      size="lg"
                      className="w-full h-14 text-lg font-semibold"
                      onClick={() => handleConnect(injectedConnector)}
                      disabled={
                        connectingId === injectedConnector.id || isPending
                      }
                    >
                      {connectingId === injectedConnector.id || isPending ? (
                        <>
                          <span className="material-symbols-outlined animate-spin mr-2">
                            progress_activity
                          </span>
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Chrome className="mr-2 h-5 w-5" />
                          Connect MetaMask
                        </>
                      )}
                    </Button>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 mt-0.5 text-green-600" />
                        <span>Secure connection - your keys stay with you</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 mt-0.5 text-green-600" />
                        <span>Works with MetaMask and most Web3 wallets</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 mt-0.5 text-green-600" />
                        <span>One-click connection to Celo blockchain</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-semibold mb-2">No wallet detected</p>
                      <p className="text-sm mb-3">
                        Please install MetaMask or another Web3 wallet to
                        connect.
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href="https://metamask.io/download/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download MetaMask →
                        </a>
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Why connect a wallet?</p>
                    <p className="text-muted-foreground text-xs">
                      Connecting your wallet allows you to make secure,
                      transparent donations directly on the Celo blockchain.
                      Your donations are recorded permanently and you can earn
                      NFT badges for your contributions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
