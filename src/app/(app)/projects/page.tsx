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
import { Loader2, Wallet, DollarSign, Heart } from "lucide-react";
import HeartButton from "@/components/ui/heart-button";
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
import Image from "next/image";
import { getProjectImage } from "@/lib/project-images";
import { FiatDonationModal } from "@/components/FiatDonationModal";

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
  const [votedProjects, setVotedProjects] = useState<Set<number>>(new Set());

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
    // Open the fiat donation modal - no wallet check needed
    // The modal handles both crypto and fiat options
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
        description: `Donating ${amount} CELO to ${selectedProject.name}`,
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

      // Mark project as voted
      setVotedProjects((prev) => new Set(prev).add(votingProjectId));

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
            Donate to Projects
          </h1>
          <div className="w-12" />
        </header>
        <main className="flex flex-1 items-center justify-center p-4">
          <Card className="max-w-md">
            <CardContent className="flex flex-col items-center gap-4 p-6">
              <Wallet className="h-12 w-12 text-muted-foreground" />
              <h2 className="text-xl font-bold">Connect Your Wallet</h2>
              <p className="text-center text-muted-foreground">
                Please connect your wallet to view and donate to projects.
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
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground overflow-x-hidden">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 pb-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-bold">
          Donate to Projects
        </h1>
        <Button variant="ghost" size="icon">
          <span className="material-symbols-outlined">search</span>
        </Button>
      </header>

      {/* Network checker - shows alert if on wrong network */}
      <div className="px-4 pt-2">
        <NetworkChecker />
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-thin">
        {projectCategories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "secondary"}
            size="sm"
            className="rounded-full bg-primary/20 text-foreground shrink-0 text-xs px-3"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto p-3 pb-24">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">
              No projects found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 w-full">
            {filteredProjects.map((project) => {
              const fundingProgress =
                project.fundingGoal > BigInt(0)
                  ? (Number(project.currentFunding) /
                      Number(project.fundingGoal)) *
                    100
                  : 0;

              const hasVoted = votedProjects.has(project.id);

              return (
                <Card
                  key={project.id}
                  className="overflow-hidden bg-card shadow-sm"
                >
                  <CardContent className="space-y-1.5 p-2">
                    {/* Image at top - reduced height 4:3 ratio */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-muted">
                      <Image
                        src={getProjectImage(
                          project.name,
                          project.category,
                          project.description
                        )}
                        alt={project.name}
                        fill
                        className="object-cover"
                        quality={100}
                        style={{ imageRendering: "crisp-edges" }}
                        unoptimized
                      />
                    </div>

                    {/* Header with title - readable size */}
                    <div>
                      <p className="text-xs font-bold leading-tight line-clamp-1">
                        {project.name}
                      </p>
                    </div>

                    {/* Progress bar and funding - more visible */}
                    <div className="space-y-1">
                      <Progress
                        value={fundingProgress}
                        className="h-1.5 rounded bg-green-100"
                      />
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                        <span>
                          {formatEther(project.currentFunding).slice(0, 4)} CELO
                        </span>
                        <span>{project.votesReceived.toString()} votes</span>
                      </div>
                    </div>

                    {/* Buttons - better size */}
                    <div className="flex gap-1.5 pt-0.5">
                      <Button
                        size="sm"
                        className="rounded-md px-2.5 py-1 h-6 text-[10px] flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
                        onClick={() => handleDonateClick(project)}
                        disabled={
                          (isDonating && donatingProjectId === project.id) ||
                          !project.isActive ||
                          project.isFunded
                        }
                      >
                        {isDonating && donatingProjectId === project.id ? (
                          <Loader2 className="h-2.5 w-2.5 animate-spin" />
                        ) : (
                          <>
                            <DollarSign className="h-3 w-3" />
                            <span>Donate</span>
                          </>
                        )}
                      </Button>

                      {/* Vote button with heart - green when voted */}
                      <Button
                        size="sm"
                        variant={hasVoted ? "default" : "outline"}
                        className={`rounded-md px-2 py-1 h-6 text-[10px] flex items-center gap-1 ${
                          hasVoted
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : ""
                        }`}
                        onClick={() => handleVote(project.id)}
                        disabled={
                          hasVoted ||
                          (isPending && votingProjectId === project.id) ||
                          !project.isActive
                        }
                      >
                        {isPending && votingProjectId === project.id ? (
                          <Loader2 className="h-2.5 w-2.5 animate-spin" />
                        ) : (
                          <>
                            <Heart
                              className={`h-[11px] w-[11px] ${
                                hasVoted ? "fill-current" : ""
                              }`}
                            />
                            <span>{hasVoted ? "Voted" : "Vote"}</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Donation Modal - Supports both Fiat and Crypto */}
      {selectedProject && (
        <FiatDonationModal
          projectId={selectedProject.id}
          projectName={selectedProject.name}
          isOpen={showDonateDialog}
          onClose={() => setShowDonateDialog(false)}
          onCryptoSwitch={() => {
            // Handle crypto payment with existing logic
            if (!isConnected) {
              toast({
                variant: "destructive",
                title: "Wallet Not Connected",
                description:
                  "Please connect your wallet to donate with crypto.",
              });
            }
          }}
        />
      )}
    </div>
  );
}
