"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "wagmi";
import { Wallet, Check, Chrome, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  {
    icon: Zap,
    title: "Instant Connection",
    description: "Connect in seconds with MetaMask or your favorite wallet",
  },
  {
    icon: Wallet,
    title: "Secure & Private",
    description: "Your keys, your crypto. We never store your private data.",
  },
  {
    icon: Check,
    title: "Easy to Use",
    description: "Simple one-click connection - no complicated setup needed",
  },
];

export default function ConnectWalletPage() {
  const router = useRouter();
  const { connectors, connect, isPending, error } = useConnect();
  const { address, isConnected } = useAccount();
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const { toast } = useToast();

  const valoraLogo = PlaceHolderImages.find((img) => img.id === "valora-logo");
  const celoLogo = PlaceHolderImages.find((img) => img.id === "celo-logo");

  const handleConnect = async (connector: any) => {
    try {
      setConnectingId(connector.id);
      await connect({ connector });
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

  useEffect(() => {
    if (isConnected && address) {
      setTimeout(() => {
        router.push("/setup");
      }, 500);
    }
  }, [isConnected, address, router]);

  useEffect(() => {
    if (error) {
      setConnectingId(null);
    }
  }, [error]);

  // Only show MetaMask/Injected connector
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
        <h1 className="flex-1 text-center text-lg font-bold">Connect Wallet</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <main className="flex flex-1 flex-col px-6 py-4">
        {/* Hero Section */}
        <div className="mb-8 text-center">
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
          <h2 className="mb-2 text-2xl font-bold">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Connect with MetaMask to start making donations
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="mb-8 space-y-3">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="flex items-center gap-4 border-0 bg-card/50 p-4 backdrop-blur-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{benefit.title}</p>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Connection Button */}
        <div className="mt-auto space-y-4 pb-6">
          {injectedConnector ? (
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
                  Connecting to MetaMask...
                </>
              ) : (
                <>
                  <Chrome className="mr-3 h-6 w-6" />
                  Connect with MetaMask
                </>
              )}
            </Button>
          ) : (
            <Card className="border-dashed p-4 text-center">
              <p className="text-sm text-muted-foreground">
                MetaMask not detected. Please install MetaMask browser
                extension.
              </p>
            </Card>
          )}

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="material-symbols-outlined text-green-500">
              verified_user
            </span>
            <span>Secure connection • Your keys stay with you</span>
          </div>

          {/* Help Link */}
          <div className="text-center">
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
      </main>
    </div>
  );
}
