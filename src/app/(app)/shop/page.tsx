"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import {
  ShoppingCart,
  Heart,
  Star,
  Plus,
  Minus,
  Sparkles,
  ArrowLeft,
  Check,
  Search,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useDonateToProject, useProjects } from "@/hooks/use-contracts";
import { NetworkChecker } from "@/components/NetworkChecker";
import Image from "next/image";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { parseEther } from "viem";

interface Product {
  id: number;
  name: string;
  price: number; // in UGX
  image: string;
  description: string;
  category: string;
  rating: number;
  inStock: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: "Wireless Earbuds",
    price: 45000,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
    description: "Premium sound quality with noise cancellation",
    category: "Electronics",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 120000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    description: "Track your fitness and stay connected",
    category: "Electronics",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 3,
    name: "Phone Case",
    price: 8500,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
    description: "Protect your phone in style",
    category: "Accessories",
    rating: 4.2,
    inStock: true,
  },
  {
    id: 4,
    name: "Portable Charger",
    price: 25000,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    description: "Never run out of battery again",
    category: "Electronics",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 5,
    name: "Backpack",
    price: 35000,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    description: "Stylish and spacious for daily use",
    category: "Fashion",
    rating: 4.4,
    inStock: true,
  },
  {
    id: 6,
    name: "Water Bottle",
    price: 12000,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    description: "Stay hydrated on the go",
    category: "Lifestyle",
    rating: 4.7,
    inStock: true,
  },
];

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

export default function ShopPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [roundUpEnabled, setRoundUpEnabled] = useState(true);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch projects from blockchain
  const { projects, isLoading: projectsLoading } = useProjects();
  const activeProjects = projects.filter((p) => p.isActive && !p.isFunded);

  // Donation hook
  const {
    donateToProject,
    isPending: isDonating,
    isConfirming: isDonateConfirming,
    isSuccess: isDonateSuccess,
  } = useDonateToProject();

  const calculateRoundUp = (amount: number) => {
    // Smart round-up algorithm that suggests affordable donations based on amount

    if (amount < 1000) {
      // Small amounts: round to nearest 100
      const rounded = Math.ceil(amount / 100) * 100;
      return rounded - amount;
    } else if (amount < 5000) {
      // 1K-5K: round to nearest 500
      const rounded = Math.ceil(amount / 500) * 500;
      return rounded - amount;
    } else if (amount < 10000) {
      // 5K-10K: round to nearest 1000
      const rounded = Math.ceil(amount / 1000) * 1000;
      return rounded - amount;
    } else if (amount < 50000) {
      // 10K-50K: suggest 500-2000 donation (round to nearest 500)
      // For amounts like 19000, suggest 20000 (1000 donation)
      // For amounts like 15000, suggest 15500 (500 donation)
      const baseRound = Math.ceil(amount / 500) * 500;
      const donation = baseRound - amount;

      // If donation would be too large (>2000), reduce to 500-1000
      if (donation > 2000) {
        const thousands = Math.floor(amount / 1000);
        const remainder = amount % 1000;
        if (remainder === 0) {
          return 500; // Even thousands get 500 donation
        } else if (remainder <= 500) {
          return 500 - remainder; // Round to next 500
        } else {
          return 1000 - remainder; // Round to next 1000
        }
      }

      return donation;
    } else if (amount < 100000) {
      // 50K-100K: suggest 1000-5000 donation
      const thousands = Math.floor(amount / 1000);
      const remainder = amount % 1000;

      if (remainder === 0) {
        return 1000; // Even thousands get 1000 donation
      } else if (remainder <= 500) {
        return 500 - remainder; // Round to previous 500 + 500
      } else {
        return 1000 - remainder; // Round to next 1000
      }
    } else {
      // 100K+: suggest 2000-10000 donation (round to nearest 5000)
      const baseRound = Math.ceil(amount / 5000) * 5000;
      const donation = baseRound - amount;

      // Cap large donations at 10000
      return Math.min(donation, 10000);
    }
  };

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setCustomAmount(""); // Reset to empty so it uses base calculation
    setIsEditingAmount(false);
    setShowCheckout(true);
    setSelectedProject(activeProjects.length > 0 ? activeProjects[0].id : null);
  };

  // Handle donation success with useEffect to avoid setState in render
  useEffect(() => {
    if (isDonateSuccess && showCheckout) {
      toast({
        title: "Donation Confirmed! 💚",
        description: "Your round-up donation is now on the blockchain",
      });

      // Close dialog and reset state after successful donation
      setShowCheckout(false);
      setSelectedProduct(null);
      setCustomAmount("");
      setQuantity(1);
      setSelectedProject(null);
    }
  }, [isDonateSuccess, showCheckout, toast]);
  const handleCheckout = async () => {
    if (!selectedProduct) return;

    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to complete purchase.",
      });
      return;
    }

    try {
      // In a real app, this would process payment through payment gateway
      // For demo, we'll just process the donation if round-up is enabled

      if (roundUpEnabled && selectedProject !== null && roundUpAmount > 0) {
        // Convert UGX to CELO (demo rate: 1000 UGX = 0.001 CELO)
        const donationInCelo = (roundUpAmount / 1000000).toFixed(6);

        // Show waiting toast
        toast({
          title: "Waiting for Confirmation... ⏳",
          description: "Please approve the transaction in your wallet",
        });

        // This will trigger MetaMask and wait for user approval
        await donateToProject(selectedProject, donationInCelo);

        // Don't close immediately - let the success effect handle it
      } else {
        // Simulate successful purchase without donation
        toast({
          title: "Purchase Successful! 🎉",
          description: `Total: ${totalAmount.toLocaleString()} UGX`,
        });

        // Close after delay for non-donation purchases
        setTimeout(() => {
          setShowCheckout(false);
          setSelectedProduct(null);
          setQuantity(1);
          setCustomAmount("");
        }, 2000);
      }
    } catch (error: any) {
      // Check if user rejected the transaction
      if (
        error.message?.includes("User rejected") ||
        error.message?.includes("denied")
      ) {
        toast({
          variant: "destructive",
          title: "Transaction Cancelled",
          description: "You rejected the transaction in your wallet",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Purchase Failed",
          description: error.message || "Failed to process payment",
        });
      }
    }
  };

  // Calculate total using custom amount if set, otherwise use product price * quantity
  const baseAmount = selectedProduct ? selectedProduct.price * quantity : 0;
  const totalAmount = selectedProduct
    ? customAmount && customAmount !== "" // If custom amount is set
      ? parseFloat(customAmount) || 0 // Use custom amount
      : baseAmount // Otherwise use base amount
    : 0;
  const roundUpAmount = calculateRoundUp(totalAmount);
  const finalAmount = totalAmount + (roundUpEnabled ? roundUpAmount : 0);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">Shop</h1>
            <p className="text-xs text-muted-foreground">
              Round up purchases to donate
            </p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <ShoppingCart className="mr-1 h-3 w-3" />
            PaySmile
          </Badge>
        </div>
      </header>

      {/* Network Checker */}
      <div className="px-4 pt-2">
        <NetworkChecker />
      </div>

      <main className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* Search and Filter Section */}
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-accent"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
            {["All", "Electronics", "Accessories", "Fashion", "Lifestyle"].map(
              (category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                >
                  {category}
                </Button>
              )
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              {
                products.filter((product) => {
                  const matchesSearch =
                    product.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    product.description
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase());
                  const matchesCategory =
                    selectedCategory === "All" ||
                    product.category === selectedCategory;
                  return matchesSearch && matchesCategory;
                }).length
              }{" "}
              products found
            </p>
            {(searchQuery || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products
            .filter((product) => {
              const matchesSearch =
                product.name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                product.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase());
              const matchesCategory =
                selectedCategory === "All" ||
                product.category === selectedCategory;
              return matchesSearch && matchesCategory;
            })
            .map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute right-2 top-2">
                    <Badge variant="secondary" className="bg-background/80">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-primary">
                      {product.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">UGX</p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleBuyClick(product)}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Buy Now
                      </>
                    ) : (
                      "Out of Stock"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* No Results Message */}
        {products.filter((product) => {
          const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          const matchesCategory =
            selectedCategory === "All" || product.category === selectedCategory;
          return matchesSearch && matchesCategory;
        }).length === 0 && (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mb-2 text-lg font-semibold">No products found</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : `No products in ${selectedCategory} category`}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Purchase</DialogTitle>
            <DialogDescription>
              Review your order and optional donation
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6">
              {/* Product Summary */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{selectedProduct.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedProduct.price.toLocaleString()} UGX each
                      </p>

                      {/* Quantity Selector */}
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setQuantity(Math.max(1, quantity - 1));
                            setCustomAmount(""); // Reset custom amount when quantity changes
                            setIsEditingAmount(false);
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">
                          {quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setQuantity(Math.min(10, quantity + 1));
                            setCustomAmount(""); // Reset custom amount when quantity changes
                            setIsEditingAmount(false);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Round-Up Section */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Heart className="h-5 w-5 text-primary" />
                      Round-Up Donation
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRoundUpEnabled(!roundUpEnabled)}
                      className={
                        roundUpEnabled
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {roundUpEnabled ? (
                        <Check className="mr-1 h-4 w-4" />
                      ) : null}
                      {roundUpEnabled ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">
                        Purchase Amount:
                      </span>
                      <div className="flex items-center gap-2">
                        {isEditingAmount ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              className="w-24 rounded border border-input bg-background px-2 py-1 text-right text-sm font-semibold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              autoFocus
                            />
                            <span className="text-xs text-muted-foreground">
                              UGX
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2"
                              onClick={() => setIsEditingAmount(false)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setIsEditingAmount(true);
                              // Set input to current total amount (whether custom or base)
                              setCustomAmount(totalAmount.toString());
                            }}
                            className="group flex items-center gap-1 rounded px-2 py-1 hover:bg-accent"
                          >
                            <span className="font-semibold">
                              {totalAmount.toLocaleString()} UGX
                            </span>
                            <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                              ✏️ Edit
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                    {roundUpEnabled && roundUpAmount > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Rounded To:
                          </span>
                          <span className="font-semibold">
                            {(totalAmount + roundUpAmount).toLocaleString()} UGX
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-base">
                          <span className="font-semibold text-primary">
                            💚 Smart Round-Up Donation:
                          </span>
                          <span className="font-bold text-primary">
                            {roundUpAmount.toLocaleString()} UGX
                          </span>
                        </div>

                        {/* Show donation affordability message */}
                        <p className="text-xs text-muted-foreground italic">
                          {roundUpAmount < 500 &&
                            "Micro-donation for maximum impact"}
                          {roundUpAmount >= 500 &&
                            roundUpAmount < 1000 &&
                            "Affordable contribution"}
                          {roundUpAmount >= 1000 &&
                            roundUpAmount < 2000 &&
                            "Generous support"}
                          {roundUpAmount >= 2000 &&
                            "Meaningful impact donation"}
                        </p>
                      </>
                    )}
                    {roundUpEnabled && roundUpAmount === 0 && (
                      <div className="space-y-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3">
                        <p className="text-xs font-semibold text-primary">
                          💡 Amount already rounded!
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Try editing the amount above to see smart round-up
                          suggestions, or add a custom donation:
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => {
                              // Don't go into edit mode, just update the custom amount
                              const newAmount = (totalAmount + 500).toString();
                              setCustomAmount(newAmount);
                              // Keep edit mode off so it applies immediately
                            }}
                          >
                            Add 500 UGX
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => {
                              // Don't go into edit mode, just update the custom amount
                              const newAmount = (totalAmount + 1000).toString();
                              setCustomAmount(newAmount);
                              // Keep edit mode off so it applies immediately
                            }}
                          >
                            Add 1,000 UGX
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {roundUpEnabled && (
                    <>
                      <Separator />

                      {/* Project Selection */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">
                          Choose Project to Support:
                        </Label>
                        {projectsLoading ? (
                          <p className="text-sm text-muted-foreground">
                            Loading projects...
                          </p>
                        ) : activeProjects.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No active projects available
                          </p>
                        ) : (
                          <RadioGroup
                            value={selectedProject?.toString() || ""}
                            onValueChange={(value) =>
                              setSelectedProject(parseInt(value))
                            }
                          >
                            {activeProjects.map((project) => (
                              <div
                                key={project.id}
                                className="flex items-start space-x-2 rounded-lg border p-3 hover:bg-accent/50"
                              >
                                <RadioGroupItem
                                  value={project.id.toString()}
                                  id={`project-${project.id}`}
                                  className="mt-1"
                                />
                                <Label
                                  htmlFor={`project-${project.id}`}
                                  className="flex-1 cursor-pointer"
                                >
                                  <p className="font-semibold">
                                    {project.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {project.description}
                                  </p>
                                  <div className="mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {project.category || "Community"}
                                    </Badge>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Total */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{totalAmount.toLocaleString()} UGX</span>
                    </div>
                    {roundUpEnabled && (
                      <div className="flex justify-between text-sm text-primary">
                        <span>Donation:</span>
                        <span>+{roundUpAmount.toLocaleString()} UGX</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{finalAmount.toLocaleString()} UGX</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Checkout Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={
                  isDonating ||
                  isDonateConfirming ||
                  (roundUpEnabled && selectedProject === null)
                }
              >
                {isDonating || isDonateConfirming ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Complete Purchase{" "}
                    {roundUpEnabled && `& Donate ${roundUpAmount} UGX`}
                  </>
                )}
              </Button>

              {!isConnected && (
                <p className="text-center text-sm text-muted-foreground">
                  Connect wallet to complete purchase with donation
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
