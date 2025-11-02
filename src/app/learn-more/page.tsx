import Link from "next/link";
import {
  ArrowLeft,
  Wallet,
  Coins,
  HeartHandshake,
  Vote,
  Award,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Wallet,
    title: "Wallet Connection",
    description: "Connect your wallet to monitor transactions seamlessly.",
  },
  {
    icon: Coins,
    title: "Transaction Round-Up",
    description:
      "Automatically round up your transactions to donate your spare change.",
  },
  {
    icon: HeartHandshake,
    title: "Smart Contract Donations",
    description:
      "All donations are handled securely and transparently through Ethereum smart contracts.",
  },
  {
    icon: Vote,
    title: "Vote on Projects",
    description:
      "Have a say in which community projects receive funding by casting your vote.",
  },
  {
    icon: Award,
    title: "NFT Reward Badges",
    description:
      "Receive unique NFT badges to recognize and celebrate your donation milestones.",
  },
  {
    icon: BarChart2,
    title: "Impact Dashboard",
    description:
      "Visualize your donation history and see the real-world impact of your contributions.",
  },
];

export default function LearnMorePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 pb-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-bold">
          How PaySmile Works
        </h1>
        <div className="w-12" />
      </header>

      <main className="flex-1 space-y-6 p-4">
        <div className="text-center">
          <p className="text-muted-foreground">
            PaySmile makes giving back easy and rewarding. Learn how your small
            change can create big smiles.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <div className="sticky bottom-0 bg-background p-4">
        <Button
          size="lg"
          className="h-14 w-full rounded-full text-lg font-bold"
          asChild
        >
          <Link href="/connect">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
