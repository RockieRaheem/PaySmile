"use client";

import { useState } from "react";
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
    const rounded = Math.ceil(amount / 1000) * 1000;
    return rounded - amount;
  };

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowCheckout(true);
    setSelectedProject(activeProjects.length > 0 ? activeProjects[0].id : null);
  };

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

    const totalAmount = selectedProduct.price * quantity;
    const roundUpAmount = calculateRoundUp(totalAmount);
    const finalAmount = totalAmount + (roundUpEnabled ? roundUpAmount : 0);

    try {
      // In a real app, this would process payment through payment gateway
      // For demo, we'll just process the donation if round-up is enabled

      if (roundUpEnabled && selectedProject !== null && roundUpAmount > 0) {
        // Convert UGX to CELO (demo rate: 1000 UGX = 0.001 CELO)
        const donationInCelo = (roundUpAmount / 1000000).toFixed(6);

        await donateToProject(selectedProject, donationInCelo);

        toast({
          title: "Purchase Processing! 🎉",
          description: `Payment: ${totalAmount.toLocaleString()} UGX + ${roundUpAmount.toLocaleString()} UGX donation`,
        });
      } else {
        // Simulate successful purchase without donation
        toast({
          title: "Purchase Successful! 🎉",
          description: `Total: ${totalAmount.toLocaleString()} UGX`,
        });
      }

      // Reset and close
      setTimeout(() => {
        setShowCheckout(false);
        setSelectedProduct(null);
        setQuantity(1);
      }, 2000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Purchase Failed",
        description: error.message || "Failed to process payment",
      });
    }
  };

  // Show success toast when donation confirms
  if (isDonateSuccess && showCheckout) {
    toast({
      title: "Donation Confirmed! 💚",
      description: "Your round-up donation is now on the blockchain",
    });
  }

  const totalAmount = selectedProduct ? selectedProduct.price * quantity : 0;
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

      <main className="flex-1 space-y-6 overflow-y-auto p-4">
        {/* How It Works Banner */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-primary" />
              Shop with Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                1
              </div>
              <p className="text-muted-foreground">
                Add products to cart and checkout
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                2
              </div>
              <p className="text-muted-foreground">
                We round up to nearest 1,000 UGX
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                3
              </div>
              <p className="text-muted-foreground">
                Spare change goes to community projects
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
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
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
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
                          onClick={() => setQuantity(Math.min(10, quantity + 1))}
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
                        roundUpEnabled ? "text-primary" : "text-muted-foreground"
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
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Purchase Amount:
                      </span>
                      <span className="font-semibold">
                        {totalAmount.toLocaleString()} UGX
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Rounded To:
                      </span>
                      <span className="font-semibold">
                        {Math.ceil(totalAmount / 1000) * 1000} UGX
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base">
                      <span className="font-semibold text-primary">
                        Round-Up Donation:
                      </span>
                      <span className="font-bold text-primary">
                        {roundUpAmount.toLocaleString()} UGX
                      </span>
                    </div>
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
                                  <p className="font-semibold">{project.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {project.description}
                                  </p>
                                  <div className="mt-1">
                                    <Badge variant="outline" className="text-xs">
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
