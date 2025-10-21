"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { formatEther, parseEther } from "viem";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { projectCategories } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Loader2, Wallet, Heart } from "lucide-react";
import {
  useVoteForProject,
  useProjects,
  useHasVoted,
  useDonateToProject,
} from "@/hooks/use-contracts";
import { getContractAddresses } from "@/lib/contracts";
import { NetworkChecker } from "@/components/NetworkChecker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Project data structure from blockchain
interface BlockchainProject {
  id: number;
  name: string;
  description: string;
  fundingGoal: bigint;
  currentFunding: bigint;
  isActive: boolean;
  isFunded: boolean;
  votesReceived: bigint;
  category?: string;
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const [votingProjectId, setVotingProjectId] = useState<number | null>(null);
  const [donatingProjectId, setDonatingProjectId] = useState<number | null>(
    null
  );
  const [donationAmount, setDonationAmount] = useState("");
  const [showDonateDialog, setShowDonateDialog] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<BlockchainProject | null>(null);

  // Fetch projects from blockchain using the hook
  const { projects, isLoading, refetch, updateProject } = useProjects();

  const filteredProjects = projects.filter((project) => {
    return activeCategory === "All" || project.category === activeCategory;
  });

  // Voting hook
  const { voteForProject, isPending, isConfirming, isSuccess } =
    useVoteForProject();

  // Donation hook
  const {
    donateToProject,
    isPending: isDonating,
    isConfirming: isDonateConfirming,
    isSuccess: isDonateSuccess,
  } = useDonateToProject();

  const handleVote = async (projectId: number) => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to vote.",
      });
      return;
    }

    setVotingProjectId(projectId);

    try {
      await voteForProject(projectId);
      toast({
        title: "Vote Submitted! ⏳",
        description: "Your vote is being processed on the blockchain.",
      });
      // Don't clear votingProjectId here - wait for confirmation
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Vote Failed",
        description: error.message || "Failed to cast vote",
      });
      setVotingProjectId(null);
    }
  };

  const handleDonateClick = (project: BlockchainProject) => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to donate.",
      });
      return;
    }
    setSelectedProject(project);
    setDonationAmount("");
    setShowDonateDialog(true);
  };

  const handleDonateSubmit = async () => {
    if (!selectedProject || !donationAmount) return;

    try {
      const amount = parseFloat(donationAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          variant: "destructive",
          title: "Invalid Amount",
          description: "Please enter a valid donation amount.",
        });
        return;
      }

      setDonatingProjectId(selectedProject.id);
      setShowDonateDialog(false);

      await donateToProject(selectedProject.id, amount.toString());

      toast({
        title: "Donation Submitted! ⏳",
        description: `Donating ${amount} ETH to ${selectedProject.name}`,
      });

      // Don't clear donatingProjectId or amount here - wait for confirmation
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Donation Failed",
        description: error.message || "Failed to process donation",
      });
      setDonatingProjectId(null);
      setDonationAmount("");
    }
  };

  // Show success toast when vote is confirmed
  useEffect(() => {
    if (isSuccess && votingProjectId !== null) {
      toast({
        title: "Vote Confirmed! ✅",
        description: "Your vote has been recorded on the blockchain.",
      });

      // Optimistically update the vote count immediately
      const project = projects.find((p) => p.id === votingProjectId);
      if (project) {
        updateProject(votingProjectId, {
          votesReceived: project.votesReceived + BigInt(1),
        });
      }

      // Clear the voting state
      setVotingProjectId(null);

      // Silently refetch in background to ensure accuracy
      setTimeout(() => refetch(), 500);
    }
  }, [isSuccess, votingProjectId, toast, refetch, updateProject, projects]);

  // Show success toast when donation is confirmed
  useEffect(() => {
    if (isDonateSuccess && donatingProjectId !== null) {
      toast({
        title: "Donation Confirmed! 🎉",
        description: "Your donation has been recorded on the blockchain.",
      });

      // Clear the donation state
      setDonatingProjectId(null);
      setDonationAmount("");

      // Silently refetch in background without showing loading state
      setTimeout(() => refetch(), 500);
    }
  }, [isDonateSuccess, donatingProjectId, toast, refetch]);
  if (!isConnected) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 pb-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
          </Button>
          <h1 className="flex-1 text-center text-lg font-bold">
            Vote for Projects
          </h1>
          <div className="w-12" />
        </header>
        <main className="flex flex-1 items-center justify-center p-4">
          <Card className="max-w-md">
            <CardContent className="flex flex-col items-center gap-4 p-6">
              <Wallet className="h-12 w-12 text-muted-foreground" />
              <h2 className="text-xl font-bold">Connect Your Wallet</h2>
              <p className="text-center text-muted-foreground">
                Please connect your Celo wallet to view and vote for projects.
              </p>
              <Button asChild className="w-full">
                <Link href="/connect">Connect Wallet</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">
          Loading projects from blockchain...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 pb-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-bold">
          Vote for Projects
        </h1>
        <Button variant="ghost" size="icon">
          <span className="material-symbols-outlined">search</span>
        </Button>
      </header>

      {/* Network checker - shows alert if on wrong network */}
      <div className="px-4 pt-2">
        <NetworkChecker />
      </div>

      <div className="flex gap-3 overflow-x-auto whitespace-nowrap px-4 py-2">
        {projectCategories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "secondary"}
            size="sm"
            className="rounded-full bg-primary/20 text-foreground"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <main className="flex-1 space-y-4 overflow-y-auto p-4">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">
              No projects found in this category.
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const fundingProgress =
              project.fundingGoal > BigInt(0)
                ? (Number(project.currentFunding) /
                    Number(project.fundingGoal)) *
                  100
                : 0;

            return (
              <Card
                key={project.id}
                className="overflow-hidden bg-card shadow-sm"
              >
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-bold">{project.name}</p>
                      {project.category && (
                        <span className="inline-block rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                          {project.category}
                        </span>
                      )}
                    </div>
                    {project.isFunded && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                        Funded ✓
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>

                  <div className="space-y-1">
                    <Progress
                      value={fundingProgress}
                      className="h-2 rounded bg-primary/20"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {formatEther(project.currentFunding)} CELO raised
                      </span>
                      <span>Goal: {formatEther(project.fundingGoal)} CELO</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <div className="text-sm text-muted-foreground">
                      {project.votesReceived.toString()} votes
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full px-4"
                        onClick={() => handleDonateClick(project)}
                        disabled={
                          (isDonating && donatingProjectId === project.id) ||
                          !project.isActive ||
                          project.isFunded
                        }
                      >
                        {isDonating && donatingProjectId === project.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Donating...
                          </>
                        ) : (
                          <>
                            <Heart className="mr-1 h-4 w-4" />
                            Donate
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-full px-6 font-bold"
                        onClick={() => handleVote(project.id)}
                        disabled={
                          (isPending && votingProjectId === project.id) ||
                          !project.isActive ||
                          project.isFunded
                        }
                      >
                        {isPending && votingProjectId === project.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Voting...
                          </>
                        ) : project.isFunded ? (
                          "Funded"
                        ) : !project.isActive ? (
                          "Closed"
                        ) : (
                          "Vote"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </main>

      {/* Donation Dialog */}
      <Dialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donate to {selectedProject?.name}</DialogTitle>
            <DialogDescription>
              Enter the amount you'd like to donate in ETH
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (ETH)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.1"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Minimum donation: 0.01 ETH
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDonateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDonateSubmit}
              disabled={!donationAmount || parseFloat(donationAmount) < 0.01}
            >
              Donate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
