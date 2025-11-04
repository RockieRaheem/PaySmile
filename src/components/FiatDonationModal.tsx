"use client";

import { useState } from "react";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Donate to {projectName}</DialogTitle>
          <DialogDescription>
            Support this project with Mobile Money, Card, or Cryptocurrency
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="fiat" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fiat">
              <CreditCard className="mr-2 h-4 w-4" />
              Mobile Money / Card
            </TabsTrigger>
            <TabsTrigger value="crypto" onClick={onCryptoSwitch}>
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
