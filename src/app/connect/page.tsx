"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ArrowLeft, Wallet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useEffect, useState } from "react";

const steps = [
  {
    icon: Smartphone,
    title: "Select your wallet below",
    description: "Choose TrustWallet, Valora, MetaMask, or any Celo wallet.",
  },
  {
    icon: Wallet,
    title: "Approve in your wallet app",
    description: "Your wallet will open automatically - just tap 'Connect'.",
  },
];

export default function ConnectWalletPage() {
  const router = useRouter();
  const { connectors, connect, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const [connecting, setConnecting] = useState(false);

  const valoraLogo = PlaceHolderImages.find((img) => img.id === "valora-logo");
  const celoLogo = PlaceHolderImages.find((img) => img.id === "celo-logo");

  const handleConnect = (connectorId: string) => {
    setConnecting(true);
    const connector = connectors.find((c) => c.id === connectorId);
    if (connector) {
      connect(
        { connector },
        {
          onSettled: () => setConnecting(false),
        }
      );
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      router.push("/setup");
    }
  }, [isConnected, address, router]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between p-4 pb-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-bold">
          Connect Your Wallet
        </h1>
        <Button variant="ghost" size="icon">
          <span className="material-symbols-outlined">help_outline</span>
        </Button>
      </header>
      <main className="flex flex-1 flex-col px-4 pt-4">
        <p className="pb-6 text-center text-muted-foreground">
          Choose your wallet to connect. It will open automatically in your
          wallet app.
        </p>

        {/* Wallet logos */}
        <div className="mb-8 flex items-center justify-center gap-6">
          {valoraLogo && (
            <Image
              src={valoraLogo.imageUrl}
              alt={valoraLogo.description}
              width={64}
              height={64}
              className="object-contain"
              data-ai-hint={valoraLogo.imageHint}
            />
          )}
          {celoLogo && (
            <Image
              src={celoLogo.imageUrl}
              alt={celoLogo.description}
              width={64}
              height={64}
              className="object-contain"
              data-ai-hint={celoLogo.imageHint}
            />
          )}
        </div>

        {/* How it works */}
        <div className="mb-6 space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex min-h-[72px] items-center gap-4 rounded-lg border bg-card p-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <step.icon className="h-6 w-6" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-medium">{step.title}</p>
                {step.description && (
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Wallet connection buttons */}
        <div className="mt-auto pb-6 space-y-3">
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              size="lg"
              variant={connector.id === "walletConnect" ? "default" : "outline"}
              className="h-14 w-full rounded-lg text-lg font-medium shadow-sm"
              onClick={() => handleConnect(connector.id)}
              disabled={connecting || isPending}
            >
              {connecting || isPending ? (
                <>
                  <span className="material-symbols-outlined animate-spin mr-2">
                    progress_activity
                  </span>
                  Connecting...
                </>
              ) : (
                <>
                  {connector.id === "walletConnect" && (
                    <span className="mr-2">📱</span>
                  )}
                  {connector.id === "injected" && (
                    <span className="material-symbols-outlined mr-2">
                      account_balance_wallet
                    </span>
                  )}
                  {connector.name}
                </>
              )}
            </Button>
          ))}

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: "20px" }}
            >
              security
            </span>
            <span>Opens natively in your wallet app</span>
          </div>

          <div className="mt-2 text-center">
            <Link href="#" className="text-sm font-medium text-primary">
              Don't have a wallet? Download one
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
