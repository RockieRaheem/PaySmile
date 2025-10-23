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
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useDonorStats, useProjects } from "@/hooks/use-contracts";
import { getProjectImage } from "@/lib/project-images";
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
  const {
    totalDonations,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useDonorStats(address);
  const {
    projects,
    isLoading: projectsLoading,
    refetch: refetchProjects,
  } = useProjects();
  const {
    data: balance,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useBalance({
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
    <div className="bg-background text-foreground overflow-x-hidden w-full">
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
                    {balance?.symbol || "CELO"}
                  </p>
                  <p className="text-sm">Your Wallet Balance</p>
                  <div className="mt-4 pt-4 border-t border-secondary-foreground/20">
                    <p className="text-2xl font-bold tracking-tight">
                      {totalDonationsNum.toFixed(4)} {balance?.symbol || "CELO"}
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[22px] font-bold leading-tight tracking-tight text-secondary">
              Top Projects
            </h2>
            <Button variant="link" size="sm" asChild className="text-primary">
              <Link href="/projects">View All</Link>
            </Button>
          </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full">
              {activeProjects
                .sort(
                  (a, b) => Number(b.votesReceived) - Number(a.votesReceived)
                )
                .slice(0, 4)
                .map((project) => {
                  const fundingGoal = parseFloat(
                    formatEther(project.fundingGoal)
                  );
                  const currentFunding = parseFloat(
                    formatEther(project.currentFunding)
                  );
                  const percentFunded =
                    fundingGoal > 0 ? (currentFunding / fundingGoal) * 100 : 0;
                  const projectImageUrl = getProjectImage(
                    project.name,
                    undefined,
                    project.description
                  );
                  const votes = Number(project.votesReceived);

                  return (
                    <Link key={project.id} href="/projects">
                      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                        <div className="relative w-full h-16">
                          <Image
                            src={projectImageUrl}
                            alt={project.name}
                            fill
                            sizes="(max-width: 640px) 50vw, 25vw"
                            className="object-cover"
                          />
                          <div className="absolute top-0.5 right-0.5 bg-primary/90 text-primary-foreground text-[8px] font-bold px-1 py-0.5 rounded-full">
                            {votes} votes
                          </div>
                        </div>
                        <CardContent className="p-2 space-y-1">
                          <p className="font-bold text-xs text-secondary line-clamp-1">
                            {project.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                          <div className="space-y-1 pt-0.5">
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>Goal: {fundingGoal.toFixed(2)} CELO</span>
                              <span>{currentFunding.toFixed(2)} CELO</span>
                            </div>
                            <Progress
                              value={percentFunded}
                              className="h-1.5 bg-green-100"
                            />
                            <p className="text-[10px] text-muted-foreground">
                              {percentFunded.toFixed(1)}% funded
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[22px] font-bold leading-tight tracking-tight text-secondary">
              Recently Funded
            </h2>
            <Button variant="link" size="sm" asChild className="text-primary">
              <Link href="/projects">View All</Link>
            </Button>
          </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full">
              {fundedProjects.slice(0, 4).map((project) => {
                const fundingGoal = parseFloat(
                  formatEther(project.fundingGoal)
                );
                const currentFunding = parseFloat(
                  formatEther(project.currentFunding)
                );
                const projectImageUrl = getProjectImage(
                  project.name,
                  undefined,
                  project.description
                );

                return (
                  <Link key={project.id} href="/projects">
                    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                      <div className="relative w-full h-16">
                        <Image
                          src={projectImageUrl}
                          alt={project.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover"
                        />
                        <div className="absolute top-0.5 right-0.5 bg-primary text-primary-foreground text-[8px] font-bold px-1 py-0.5 rounded-full flex items-center gap-0.5">
                          <CheckCircle className="h-2 w-2" />
                          Funded
                        </div>
                      </div>
                      <CardContent className="p-2 space-y-1">
                        <p className="font-bold text-xs text-secondary line-clamp-1">
                          {project.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                        <div className="space-y-1 pt-0.5">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">
                              Raised:
                            </span>
                            <span className="text-primary font-bold">
                              {currentFunding.toFixed(2)} CELO
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                            <CheckCircle className="h-2.5 w-2.5 text-primary" />
                            <span className="text-[10px] text-primary font-semibold">
                              Goal Achieved!
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
