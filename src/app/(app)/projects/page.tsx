"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { projectCategories } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Loader2, Wallet } from "lucide-react";
import {
  useVoteForProject,
  useProject,
  useHasVoted,
} from "@/hooks/use-contracts";
import { getContractAddresses } from "@/lib/contracts";

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
  const [projects, setProjects] = useState<BlockchainProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch projects from blockchain
  useEffect(() => {
    const fetchProjects = async () => {
      if (!isConnected) {
        setIsLoading(false);
        return;
      }

      try {
        // For now, we'll hardcode fetching first 3 projects
        // In production, you'd fetch the project count first
        const projectData: BlockchainProject[] = [];

        for (let i = 0; i < 3; i++) {
          // Note: This is a placeholder - you'll need to implement proper fetching
          // using the useProject hook or a custom API route
          projectData.push({
            id: i,
            name: `Project ${i}`,
            description: "Loading...",
            fundingGoal: BigInt(0),
            currentFunding: BigInt(0),
            isActive: true,
            isFunded: false,
            votesReceived: BigInt(0),
            category: "Community",
          });
        }

        setProjects(projectData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [isConnected]);

  const filteredProjects = projects.filter((project) => {
    return activeCategory === "All" || project.category === activeCategory;
  });

  // Voting hook
  const { voteForProject, isPending, isConfirming, isSuccess } =
    useVoteForProject();

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
        title: "Vote Submitted!",
        description: "Your vote is being processed on the blockchain.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Vote Failed",
        description: error.message || "Failed to cast vote",
      });
    } finally {
      setVotingProjectId(null);
    }
  };

  // Show success toast when vote is confirmed
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Vote Confirmed!",
        description: "Your vote has been recorded on the blockchain.",
      });
    }
  }, [isSuccess, toast]);

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
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden bg-card shadow-sm">
            {project.image && (
              <div
                className="aspect-video w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${project.image.imageUrl})` }}
                data-alt={project.image.description}
              ></div>
            )}
            <CardContent className="space-y-3 p-4">
              <p className="text-lg font-bold">{project.title}</p>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
              <Progress
                value={(project.currentFunding / project.fundingGoal) * 100}
                className="h-2 rounded bg-primary/20"
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {new Intl.NumberFormat("en-US").format(
                    project.currentFunding
                  )}{" "}
                  / {new Intl.NumberFormat("en-US").format(project.fundingGoal)}{" "}
                  UGX
                </p>
                <Button
                  size="sm"
                  className="rounded-full px-6 font-bold"
                  onClick={() => handleVote(project.id)}
                  disabled={isPending && votingProjectId === project.id}
                >
                  {isPending && votingProjectId === project.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Vote"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}
