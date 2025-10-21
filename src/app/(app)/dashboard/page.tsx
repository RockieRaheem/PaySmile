"use client";

import Image from "next/image";
import Link from "next/link";
import { Smile, UserCircle, CheckCircle, LogOut, Loader2 } from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useDonorStats, useProjects } from "@/hooks/use-contracts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NetworkChecker } from "@/components/NetworkChecker";

interface BlockchainProject {
  id: number;
  name: string;
  description: string;
  fundingGoal: bigint;
  currentFunding: bigint;
  isActive: boolean;
  isFunded: boolean;
  votesReceived: bigint;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="flex-1">
      <CardContent className="p-4">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold text-secondary">{value}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { totalDonations, isLoading: statsLoading } = useDonorStats(address);
  const { projects, isLoading: projectsLoading } = useProjects();
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address,
  });

  const [activeProjects, setActiveProjects] = useState<BlockchainProject[]>([]);
  const [fundedProjects, setFundedProjects] = useState<BlockchainProject[]>([]);

  // Split projects into active and funded
  useEffect(() => {
    if (projects) {
      const active = projects.filter((p) => p.isActive && !p.isFunded);
      const funded = projects.filter((p) => p.isFunded);
      setActiveProjects(active);
      setFundedProjects(funded);
    }
  }, [projects]);

  // Calculate stats from blockchain data
  const projectsSupported =
    projects?.filter((p) => Number(p.currentFunding) > 0).length || 0;

  const livesImpacted = projectsSupported * 50; // Estimate 50 lives per project
  const totalDonationsNum = totalDonations ? parseFloat(totalDonations) : 0;
  const roundupsMade = Math.floor(totalDonationsNum * 100); // Estimate roundups

  // Get project images
  const getProjectImage = (index: number) => {
    const images = [
      PlaceHolderImages.find((img) => img.id === "clean-water"),
      PlaceHolderImages.find((img) => img.id === "education"),
      PlaceHolderImages.find((img) => img.id === "tree-planting"),
    ];
    return images[index % images.length];
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold">Connect Your Wallet</h2>
            <p className="mt-2 text-muted-foreground">
              Please connect your wallet to view your donation dashboard.
            </p>
            <Button asChild className="mt-4">
              <Link href="/connect">Connect Wallet</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="bg-background text-foreground">
      <header className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-2">
          <Smile className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-secondary">PaySmile</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <UserCircle className="h-8 w-8" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="p-4 space-y-6">
        {/* Network checker - shows alert if on wrong network */}
        <NetworkChecker />

        <section>
          <Card className="bg-secondary text-secondary-foreground">
            <CardContent className="p-6">
              <p className="text-lg font-medium">Welcome back!</p>
              {statsLoading || balanceLoading ? (
                <div className="flex items-center gap-2 mt-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <p className="text-sm">Loading your stats...</p>
                </div>
              ) : (
                <>
                  <p className="mt-2 text-4xl font-bold tracking-tight">
                    {balance
                      ? parseFloat(formatEther(balance.value)).toFixed(4)
                      : "0.0000"}{" "}
                    {balance?.symbol || "ETH"}
                  </p>
                  <p className="text-sm">Your Wallet Balance</p>
                  <div className="mt-4 pt-4 border-t border-secondary-foreground/20">
                    <p className="text-2xl font-bold tracking-tight">
                      {totalDonationsNum.toFixed(4)} {balance?.symbol || "ETH"}
                    </p>
                    <p className="text-sm">Your Total Donations</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-[22px] font-bold leading-tight tracking-tight text-secondary mb-3">
            Your Impact
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Projects Supported" value={projectsSupported} />
            <StatCard label="Lives Impacted" value={livesImpacted} />
            <div className="col-span-2">
              <StatCard
                label="Round-ups Made"
                value={roundupsMade.toLocaleString()}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[22px] font-bold leading-tight tracking-tight text-secondary mb-3">
            Active Projects
          </h2>
          {projectsLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activeProjects.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No active projects at the moment. Check back soon!
              </CardContent>
            </Card>
          ) : (
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {activeProjects.map((project, index) => {
                  const image = getProjectImage(index);
                  const fundingGoal = parseFloat(
                    formatEther(project.fundingGoal)
                  );
                  const currentFunding = parseFloat(
                    formatEther(project.currentFunding)
                  );
                  const percentFunded =
                    fundingGoal > 0 ? (currentFunding / fundingGoal) * 100 : 0;

                  return (
                    <CarouselItem
                      key={project.id}
                      className="basis-4/5 pl-4 md:basis-1/3"
                    >
                      <Card className="overflow-hidden">
                        {image && (
                          <Image
                            src={image.imageUrl}
                            alt={image.description}
                            width={400}
                            height={225}
                            className="w-full h-32 object-cover"
                            data-ai-hint={image.imageHint}
                          />
                        )}
                        <CardContent className="p-4">
                          <p className="font-bold text-secondary">
                            {project.name}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Goal: {fundingGoal.toFixed(2)} CELO
                          </p>
                          <Progress
                            value={percentFunded}
                            className="mt-3 h-2.5"
                          />
                          <p className="mt-1 text-right text-xs text-muted-foreground">
                            {percentFunded.toFixed(1)}% Funded (
                            {currentFunding.toFixed(4)} CELO)
                          </p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>
          )}
        </section>

        <section>
          <h2 className="text-[22px] font-bold leading-tight tracking-tight text-secondary mb-3">
            Funded Projects
          </h2>
          {projectsLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : fundedProjects.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No projects have been fully funded yet. Be the first to
                contribute!
              </CardContent>
            </Card>
          ) : (
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {fundedProjects.map((project, index) => {
                  const image = getProjectImage(index);

                  return (
                    <CarouselItem
                      key={project.id}
                      className="basis-4/5 pl-4 md:basis-1/3"
                    >
                      <Card className="overflow-hidden">
                        {image && (
                          <Image
                            src={image.imageUrl}
                            alt={image.description}
                            width={400}
                            height={225}
                            className="w-full h-32 object-cover"
                            data-ai-hint={image.imageHint}
                          />
                        )}
                        <CardContent className="p-4">
                          <p className="font-bold text-secondary">
                            {project.name}
                          </p>
                          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            <CheckCircle className="h-4 w-4" />
                            Fully Funded!
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>
          )}
        </section>
      </main>
    </div>
  );
}
