'use client';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCelo } from "@celo/react-celo";
import { ArrowLeft, HelpCircle, Download, MousePointerClick, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useEffect } from "react";

const steps = [
  {
    icon: Download,
    title: "Install Valora or Celo Wallet",
    description: "Download from the App Store or Google Play.",
  },
  {
    icon: MousePointerClick,
    title: "Tap 'Connect Wallet' below.",
    description: null,
  },
  {
    icon: CheckCircle2,
    title: "Approve the connection in your wallet app.",
    description: null,
  },
];

export default function ConnectWalletPage() {
  const { connect, address } = useCelo();
  const router = useRouter();

  const valoraLogo = PlaceHolderImages.find(img => img.id === 'valora-logo');
  const celoLogo = PlaceHolderImages.find(img => img.id === 'celo-logo');

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  useEffect(() => {
    if (address) {
      router.push('/setup');
    }
  }, [address, router]);


  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between p-4 pb-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-bold">Connect Your Wallet</h1>
        <Button variant="ghost" size="icon">
          <span className="material-symbols-outlined">help_outline</span>
        </Button>
      </header>
      <main className="flex flex-1 flex-col px-4 pt-4">
        <p className="pb-6 text-center text-muted-foreground">
          Connect your Valora or Celo wallet to enable automatic round-up donations.
        </p>
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
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex min-h-[72px] items-center gap-4 rounded-lg border bg-card p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <step.icon className="h-6 w-6" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-medium">{step.title}</p>
                {step.description && (
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto pb-6">
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>security</span>
            <span>Your connection is secure and private.</span>
          </div>
          <Button size="lg" className="h-14 w-full rounded-lg text-lg font-bold shadow-lg" onClick={handleConnect}>
            Connect Wallet
          </Button>
          <div className="mt-4 text-center">
            <Link href="#" className="text-sm font-medium text-primary">
              Having trouble? Get Help
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
