"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Filter,
  TrendingUp,
  Calendar,
  Award,
  ExternalLink,
  Loader2,
  Search,
  X,
  DollarSign,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  useDonationHistory,
  useDonationStats,
  useFilteredDonations,
  exportDonationsToCSV,
} from "@/hooks/use-donation-history";
import {
  DonationFilters,
  SortField,
  SortOrder,
} from "@/types/donation-history";

export default function HistoryPage() {
  const { address, isConnected } = useAccount();
  const { donations, isLoading, error, refetch } = useDonationHistory();
  const stats = useDonationStats(donations);

  // Filter and sort state
  const [filters, setFilters] = useState<DonationFilters>({});
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDonations = useFilteredDonations(
    donations,
    filters,
    sortField,
    sortOrder
  );

  // Apply search filter
  const searchedDonations = searchQuery
    ? filteredDonations.filter(
        (d) =>
          d.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.transactionHash.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredDonations;

  const handleExport = () => {
    exportDonationsToCSV(searchedDonations);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setSortField("date");
    setSortOrder("desc");
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const getBadgeColor = (tier?: string) => {
    switch (tier) {
      case "Bronze":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Silver":
        return "bg-slate-100 text-slate-800 border-slate-300";
      case "Gold":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Platinum":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-b from-background via-primary/5 to-background min-h-[calc(100vh-6rem)]">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-primary/10 p-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="flex-1 text-center text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Donation History
          </h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md w-full border-primary/20">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Connect Your Wallet</h2>
              <p className="text-muted-foreground">
                Connect your wallet to view your donation history
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="flex-1 text-center text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Donation History
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExport}
            disabled={searchedDonations.length === 0}
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="px-4 pb-3 space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects or transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter & Sort</SheetTitle>
                  <SheetDescription>
                    Customize your donation history view
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Sort Options */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Sort By</label>
                    <Select
                      value={sortField}
                      onValueChange={(value) =>
                        setSortField(value as SortField)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="amount">Amount</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={sortOrder}
                      onValueChange={(value) =>
                        setSortOrder(value as SortOrder)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Descending</SelectItem>
                        <SelectItem value="asc">Ascending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Amount Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Amount (USD)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minAmount || ""}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            minAmount: e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxAmount || ""}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            maxAmount: e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          })
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Badge Tier Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Badge Tier</label>
                    <Select
                      value={filters.badgeTier || "all"}
                      onValueChange={(value) =>
                        setFilters({
                          ...filters,
                          badgeTier:
                            value === "all" ? undefined : (value as any),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Tiers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tiers</SelectItem>
                        <SelectItem value="Bronze">Bronze</SelectItem>
                        <SelectItem value="Silver">Silver</SelectItem>
                        <SelectItem value="Gold">Gold</SelectItem>
                        <SelectItem value="Platinum">Platinum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleClearFilters}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters Display */}
          {(filters.minAmount ||
            filters.maxAmount ||
            filters.badgeTier ||
            searchQuery) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground">Active:</span>
              {filters.minAmount && (
                <Badge variant="secondary" className="text-xs">
                  Min: ${filters.minAmount}
                </Badge>
              )}
              {filters.maxAmount && (
                <Badge variant="secondary" className="text-xs">
                  Max: ${filters.maxAmount}
                </Badge>
              )}
              {filters.badgeTier && (
                <Badge variant="secondary" className="text-xs">
                  {filters.badgeTier}
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  Search: {searchQuery}
                </Badge>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4">
        {/* Statistics Cards */}
        {!isLoading && donations.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-primary/20">
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-medium">Total Donated</span>
                </div>
                <p className="text-2xl font-bold text-primary">
                  ${stats.totalAmountUsd}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stats.totalAmountCelo} CELO
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span className="text-xs font-medium">Badges Earned</span>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {stats.badgesEarned}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stats.projectsSupported} projects
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading your donation history...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-6 text-center space-y-2">
              <p className="font-medium text-destructive">
                Failed to load donation history
              </p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
              <Button variant="outline" size="sm" onClick={refetch}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && donations.length === 0 && (
          <Card className="border-primary/20">
            <CardContent className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No Donations Yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Start making a difference by donating to projects you care
                  about
                </p>
              </div>
              <Button asChild>
                <Link href="/projects">Browse Projects</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* No Results from Filters */}
        {!isLoading &&
          donations.length > 0 &&
          searchedDonations.length === 0 && (
            <Card className="border-primary/20">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No Results Found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                </div>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

        {/* Donation List */}
        {!isLoading && searchedDonations.length > 0 && (
          <>
            <div className="flex items-center justify-between px-1">
              <p className="text-sm text-muted-foreground">
                {searchedDonations.length} donation
                {searchedDonations.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-3">
              {searchedDonations.map((donation) => (
                <Card
                  key={donation.id}
                  className="border-primary/20 hover:border-primary/40 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      {/* Left: Project Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center shrink-0">
                            <Target className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm leading-tight mb-1 truncate">
                              {donation.projectName}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(donation.timestamp)}
                            </p>
                          </div>
                        </div>

                        {/* Badge Earned */}
                        {donation.badgeEarned && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${getBadgeColor(
                              donation.badgeEarned.tier
                            )}`}
                          >
                            <Award className="h-3 w-3 mr-1" />
                            {donation.badgeEarned.tier} Badge
                          </Badge>
                        )}

                        {/* Transaction Hash */}
                        <a
                          href={`https://alfajores.celoscan.io/tx/${donation.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mt-2"
                        >
                          {truncateHash(donation.transactionHash)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>

                      {/* Right: Amount */}
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-primary">
                          ${donation.amountUsd}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {parseFloat(donation.amountCelo).toFixed(4)} CELO
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
