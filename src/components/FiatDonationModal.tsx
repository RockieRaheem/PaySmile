"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Smartphone, Wallet } from "lucide-react";
import { useDonateToProject } from "@/hooks/use-contracts";
import { useToast } from "@/hooks/use-toast";

interface FiatDonationModalProps {
  projectId: number;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
  onCryptoSwitch?: () => void;
}

export function FiatDonationModal({
  projectId,
  projectName,
  isOpen,
  onClose,
  onCryptoSwitch,
}: FiatDonationModalProps) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("RWF");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobilemoney">(
    "mobilemoney"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("fiat");

  // Crypto donation states
  const [cryptoAmount, setCryptoAmount] = useState("");
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const {
    donateToProject,
    isPending: isDonating,
    isConfirming,
  } = useDonateToProject();

  const currencies = [
    { value: "RWF", label: "Rwandan Franc (RWF)", symbol: "FRw" },
    { value: "UGX", label: "Ugandan Shilling (UGX)", symbol: "USh" },
    { value: "KES", label: "Kenyan Shilling (KES)", symbol: "KSh" },
    { value: "USD", label: "US Dollar (USD)", symbol: "$" },
    { value: "EUR", label: "Euro (EUR)", symbol: "€" },
  ];

  const selectedCurrency = currencies.find((c) => c.value === currency);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsProcessing(true);

    try {
      // Validate inputs
      if (!amount || parseFloat(amount) < 100) {
        throw new Error(`Minimum donation is 100 ${currency}`);
      }

      if (!donorName || !donorEmail) {
        throw new Error("Please fill in all required fields");
      }

      if (paymentMethod === "mobilemoney" && !donorPhone) {
        throw new Error("Phone number is required for Mobile Money");
      }

      // Call API to initialize payment
      const response = await fetch("/api/donations/fiat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
          projectId,
          projectName,
          donorEmail,
          donorName,
          donorPhone,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      // Redirect to Flutterwave payment page
      window.location.href = data.paymentUrl;
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Failed to process payment");
      setIsProcessing(false);
    }
  };

  const handleCryptoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to donate with crypto.",
      });
      return;
    }

    try {
      const amount = parseFloat(cryptoAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          variant: "destructive",
          title: "Invalid Amount",
          description: "Please enter a valid donation amount.",
        });
        return;
      }

      setIsProcessing(true);

      await donateToProject(projectId, amount.toString());

      toast({
        title: "Donation Submitted! ⏳",
        description: `Donating ${amount} CELO to ${projectName}`,
      });

      // Close modal after submission
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error: any) {
      console.error("Crypto donation error:", error);
      toast({
        variant: "destructive",
        title: "Donation Failed",
        description: error.message || "Failed to process donation",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Donate to {projectName}</DialogTitle>
          <DialogDescription>
            Support this project with Mobile Money, Card, or Cryptocurrency
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fiat">
              <CreditCard className="mr-2 h-4 w-4" />
              Mobile Money / Card
            </TabsTrigger>
            <TabsTrigger value="crypto">
              <Wallet className="mr-2 h-4 w-4" />
              Crypto Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fiat" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Payment Method Selection */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={
                      paymentMethod === "mobilemoney" ? "default" : "outline"
                    }
                    onClick={() => setPaymentMethod("mobilemoney")}
                    className="w-full"
                  >
                    <Smartphone className="mr-2 h-4 w-4" />
                    Mobile Money
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("card")}
                    className="w-full"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card
                  </Button>
                </div>
              </div>

              {/* Currency Selection */}
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (Min: 100 {currency})</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {selectedCurrency?.symbol}
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    required
                    min="100"
                  />
                </div>
              </div>

              {/* Donor Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  required
                />
              </div>

              {/* Donor Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email (for receipt)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  required
                />
              </div>

              {/* Phone Number (for Mobile Money) */}
              {paymentMethod === "mobilemoney" && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+250 780 000 000"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 text-sm">
                <p className="text-blue-900 dark:text-blue-100">
                  <strong>✨ No wallet needed!</strong> Your donation will be
                  securely processed and converted to cryptocurrency, then sent
                  to the project. You&apos;ll receive an email receipt.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>Donate {amount && `${selectedCurrency?.symbol}${amount}`}</>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Secured by Flutterwave • Your data is encrypted
              </p>
            </form>
          </TabsContent>

          {/* Crypto Wallet Tab */}
          <TabsContent value="crypto" className="space-y-4 mt-4">
            {!isConnected ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                <p className="text-sm text-yellow-900 dark:text-yellow-100 text-center">
                  <strong>⚠️ Wallet Not Connected</strong>
                  <br />
                  Please connect your MetaMask wallet to donate with
                  cryptocurrency.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCryptoSubmit} className="space-y-4">
                {/* Amount in CELO */}
                <div className="space-y-2">
                  <Label htmlFor="cryptoAmount">Amount (CELO)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      CELO
                    </span>
                    <Input
                      id="cryptoAmount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.1"
                      value={cryptoAmount}
                      onChange={(e) => setCryptoAmount(e.target.value)}
                      className="pl-16"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Minimum donation: 0.01 CELO
                  </p>
                </div>

                {/* Wallet Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 text-sm">
                  <p className="text-blue-900 dark:text-blue-100">
                    <strong>✅ Wallet Connected</strong>
                    <br />
                    <span className="text-xs font-mono">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                    <br />
                    <br />
                    Your donation will be sent directly to the project&apos;s
                    smart contract on the Celo blockchain. You&apos;ll receive
                    an NFT badge as proof of your contribution!
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isProcessing || isDonating || isConfirming}
                >
                  {isProcessing || isDonating || isConfirming ? (
                    <>Processing...</>
                  ) : (
                    <>Donate {cryptoAmount && `${cryptoAmount} CELO`}</>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secured by Blockchain • Transaction recorded on-chain
                </p>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
