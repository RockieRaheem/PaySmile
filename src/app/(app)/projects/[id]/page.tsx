"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWallet } from "@/hooks/use-wallet";
import { formatEther } from "viem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Heart,
  Share2,
  Loader2,
  Calendar,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { getProjectImage } from "@/lib/project-images";
import { SimpleDonationModal } from "@/components/SimpleDonationModal";
import { getProjectDetailsByName } from "@/lib/data";
import {
  useProjects,
  useVoteForProject,
  useProjectDonations,
} from "@/hooks/use-contracts";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface Donation {
  donor: string;
  amount: bigint;
  timestamp: number;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { address, isConnected } = useWallet();

  const projectId = parseInt(params.id as string);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [votedProjects, setVotedProjects] = useState<Set<number>>(() => {
    if (typeof window !== "undefined" && address) {
      const cached = localStorage.getItem(`voted_projects_${address}`);
      if (cached) {
        try {
          return new Set(JSON.parse(cached));
        } catch {
          return new Set();
        }
      }
    }
    return new Set();
  });

  // Fetch all projects
  const { projects, isLoading, refetch } = useProjects();
  const project = projects.find((p) => p.id === projectId);

  // Fetch project donations
  const { donations, isLoading: donationsLoading } =
    useProjectDonations(projectId);

  // Voting
  const {
    voteForProject,
    isPending: isVoting,
    isSuccess: voteSuccess,
  } = useVoteForProject();

  // Update voted projects from localStorage when address changes
  useEffect(() => {
    if (!address) {
      setVotedProjects(new Set());
      return;
    }

    const cached = localStorage.getItem(`voted_projects_${address}`);
    if (cached) {
      try {
        setVotedProjects(new Set(JSON.parse(cached)));
      } catch {
        setVotedProjects(new Set());
      }
    }
  }, [address]);

  // Handle vote success
  useEffect(() => {
    if (voteSuccess && project) {
      toast({
        title: "Vote Confirmed! ✅",
        description: "Your vote has been recorded on the blockchain.",
      });

      const newVotedProjects = new Set(votedProjects).add(projectId);
      setVotedProjects(newVotedProjects);

      if (address) {
        localStorage.setItem(
          `voted_projects_${address}`,
          JSON.stringify(Array.from(newVotedProjects))
        );
      }

      refetch();
    }
  }, [voteSuccess, projectId, address, votedProjects, refetch, toast, project]);

  const handleVote = async () => {
    if (votedProjects.has(projectId)) {
      return;
    }

    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to vote.",
      });
      return;
    }

    try {
      await voteForProject(projectId);
      toast({
        title: "Vote Submitted! ⏳",
        description: "Your vote is being processed on the blockchain.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Vote Failed",
        description: error.message || "Failed to cast vote",
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: project?.name || "PaySmile Project",
      text: `Check out this project on PaySmile: ${project?.name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully! 📤",
          description: "Thanks for spreading the word!",
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied! 📋",
        description: "Project link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/projects")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fundingProgress =
    project.fundingGoal > BigInt(0)
      ? (Number(project.currentFunding) / Number(project.fundingGoal)) * 100
      : 0;

  const projectImageUrl = getProjectImage(
    project.name,
    project.category || "Education"
  );

  // Get project details by name (not ID) to ensure correct mapping
  const details = getProjectDetailsByName(project.name);

  const hasVoted = votedProjects.has(projectId);
  const donorsCount = donations.length;
  const totalRaised = formatEther(project.currentFunding);
  const goalAmount = formatEther(project.fundingGoal);

  return (
    <>
      <div className="bg-gradient-to-b from-background via-primary/5 to-background">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-primary/10">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold">Project Details</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="hover:bg-primary/10"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 space-y-4">
            {/* Project Image */}
            <Card className="overflow-hidden border-primary/20">
              <div className="relative w-full h-64 md:h-96">
                <Image
                  src={projectImageUrl}
                  alt={project.name}
                  fill
                  className="object-cover"
                  priority
                />
                {project.isFunded && (
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Funded
                  </div>
                )}
                {!project.isActive && !project.isFunded && (
                  <div className="absolute top-4 right-4 bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Inactive
                  </div>
                )}
              </div>
            </Card>

            {/* Project Title & Category */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-2xl md:text-3xl font-bold">
                  {project.name}
                </h2>
                {project.category && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary shrink-0"
                  >
                    {project.category}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              {/* Detailed Information */}
              {details && (
                <Card className="mt-4 border-primary/20">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">
                          info
                        </span>
                        Project Overview
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {details.fullDescription}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">
                          warning
                        </span>
                        Current Situation
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {details.situation}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Why This is Urgent
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {details.urgency}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        Expected Impact
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {details.impact}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Funding Stats */}
            <Card className="border-primary/20">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-2xl md:text-3xl font-bold text-primary break-words">
                      {Number(totalRaised) < 0.01
                        ? totalRaised
                        : Number(totalRaised).toFixed(2)}{" "}
                      CELO
                    </p>
                    <p className="text-sm text-muted-foreground">
                      raised of{" "}
                      {Number(goalAmount) < 0.01
                        ? goalAmount
                        : Number(goalAmount).toFixed(2)}{" "}
                      CELO goal
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold">
                      {fundingProgress.toFixed(0)}%
                    </p>
                    <p className="text-sm text-muted-foreground">funded</p>
                  </div>
                </div>

                <Progress value={fundingProgress} className="h-3" />

                <div className="grid grid-cols-3 gap-2 md:gap-4 pt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-primary">
                            <Users className="h-4 w-4 shrink-0" />
                            <p className="text-lg md:text-xl font-bold truncate">
                              {donorsCount}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Donors
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total number of donations</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-primary">
                            <Heart className="h-4 w-4 shrink-0" />
                            <p className="text-lg md:text-xl font-bold truncate">
                              {project.votesReceived.toString()}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">Votes</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Community votes received</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-primary">
                            <TrendingUp className="h-4 w-4 shrink-0" />
                            <p className="text-lg md:text-xl font-bold truncate">
                              ${(Number(totalRaised) * 0.5).toFixed(0)}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">USD</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Approximate USD value (1 CELO ≈ $0.50)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
                onClick={() => setShowDonateModal(true)}
                disabled={!project.isActive}
              >
                <DollarSign className="mr-2 h-5 w-5" />
                Donate Now
              </Button>

              <Button
                size="lg"
                variant={hasVoted ? "default" : "outline"}
                className={`w-full h-12 ${
                  hasVoted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : ""
                }`}
                onClick={handleVote}
                disabled={isVoting || !project.isActive}
              >
                {isVoting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Heart
                      className={`mr-2 h-5 w-5 ${
                        hasVoted ? "fill-current" : ""
                      }`}
                    />
                    {hasVoted ? "Voted" : "Vote"}
                  </>
                )}
              </Button>
            </div>

            {/* Recent Donations */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Recent Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {donationsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : donations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>
                      No donations yet. Be the first to support this project!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {donations
                      .filter((d) => d && d.donor && d.amount) // Filter out invalid donations
                      .slice(0, 5)
                      .map((donation, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-3 p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                              <Heart className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">
                                {donation.donor?.slice(0, 6) || "0x0000"}...
                                {donation.donor?.slice(-4) || "0000"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(
                                  donation.timestamp * 1000
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-primary text-sm">
                              {Number(formatEther(donation.amount)).toFixed(4)}{" "}
                              CELO
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ≈ $
                              {(
                                Number(formatEther(donation.amount)) * 0.5
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}

                    {donations.length > 5 && (
                      <p className="text-center text-sm text-muted-foreground pt-2">
                        +{donations.length - 5} more donations
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Impact Section */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Project Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Transparent Funding</p>
                    <p className="text-sm text-muted-foreground">
                      All donations are recorded on the blockchain for complete
                      transparency
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Direct Impact</p>
                    <p className="text-sm text-muted-foreground">
                      100% of your donation goes directly to the project
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">NFT Rewards</p>
                    <p className="text-sm text-muted-foreground">
                      Earn exclusive badges based on your donation amount
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Donation Modal */}
      {showDonateModal && project && (
        <SimpleDonationModal
          projectId={project.id}
          projectName={project.name}
          isOpen={showDonateModal}
          onClose={() => {
            setShowDonateModal(false);
            refetch();
          }}
        />
      )}
    </>
  );
}
