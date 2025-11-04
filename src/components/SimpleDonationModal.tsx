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
import { Smartphone, CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SimpleDonationModalProps {
  projectId: number;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SimpleDonationModal({
  projectId,
  projectName,
  isOpen,
  onClose,
}: SimpleDonationModalProps) {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("RWF");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"mobilemoney" | "card">(
    "mobilemoney"
  );
  const { toast } = useToast();

  const currencies = [
    { value: "RWF", label: "Rwandan Franc", symbol: "FRw" },
    { value: "USD", label: "US Dollar", symbol: "$" },
    { value: "UGX", label: "Ugandan Shilling", symbol: "USh" },
  ];

  const selectedCurrency = currencies.find((c) => c.value === currency);

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!amount || parseFloat(amount) < 100) {
      toast({
        title: "Invalid Amount",
        description: `Minimum donation is 100 ${currency}`,
        variant: "destructive",
      });
      return;
    }

    if (!donorName || !donorEmail || !donorPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Start payment processing
    setStep("processing");

    try {
      // Call Flutterwave API to initialize payment
      const response = await fetch("/api/donations/fiat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
          customer: {
            name: donorName,
            email: donorEmail,
            phone_number: donorPhone,
          },
          projectId,
          projectName,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment initialization failed");
      }

      // Open Flutterwave payment link
      if (data.link) {
        window.open(data.link, "_blank", "width=600,height=700");

        // Show message that payment window opened
        toast({
          title: "Payment Window Opened",
          description:
            "Complete payment in the new window. Don't close this page.",
        });

        // Poll for payment status
        const checkPaymentStatus = setInterval(async () => {
          try {
            const statusResponse = await fetch(
              `/api/donations/verify?tx_ref=${data.tx_ref}`
            );
            const statusData = await statusResponse.json();

            if (statusData.status === "successful") {
              clearInterval(checkPaymentStatus);
              setStep("success");

              // Auto-close after 5 seconds
              setTimeout(() => {
                handleClose();
              }, 5000);
            } else if (statusData.status === "failed") {
              clearInterval(checkPaymentStatus);
              throw new Error("Payment failed");
            }
          } catch (error) {
            // Continue polling
          }
        }, 3000); // Check every 3 seconds

        // Stop polling after 5 minutes
        setTimeout(() => {
          clearInterval(checkPaymentStatus);
          setStep("form");
          toast({
            title: "Payment Timeout",
            description: "Please try again or contact support",
            variant: "destructive",
          });
        }, 300000);
      } else {
        throw new Error("No payment link received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setStep("form");
      toast({
        title: "Payment Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to initialize payment",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setStep("form");
    setAmount("");
    setDonorName("");
    setDonorEmail("");
    setDonorPhone("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle>Donate to {projectName}</DialogTitle>
              <DialogDescription>
                Support this project with Mobile Money or Card
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleDonation} className="space-y-4 mt-4">
              {/* Payment Method */}
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

              {/* Currency */}
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

              {/* Name */}
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

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  required
                />
              </div>

              {/* Phone */}
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

              {/* Info */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3 text-sm">
                <p className="text-green-900 dark:text-green-100">
                  ✨ <strong>Easy & Secure:</strong> No wallet needed! Payment
                  processed instantly. Donation recorded on blockchain for
                  transparency.
                </p>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" size="lg">
                Complete Donation{" "}
                {amount && `(${selectedCurrency?.symbol}${amount})`}
              </Button>
            </form>
          </>
        )}

        {step === "processing" && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
            <h3 className="text-xl font-semibold">Processing Payment...</h3>
            <p className="text-muted-foreground">
              Please wait while we process your{" "}
              {paymentMethod === "mobilemoney" ? "Mobile Money" : "card"}{" "}
              payment
            </p>
            <div className="text-sm text-muted-foreground">
              {paymentMethod === "mobilemoney"
                ? "Check your phone for MTN/Airtel prompt"
                : "Verifying card payment"}
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-12 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
            <h3 className="text-2xl font-bold">Donation Successful! 🎉</h3>
            <p className="text-muted-foreground">
              Thank you for donating{" "}
              <strong>
                {selectedCurrency?.symbol}
                {amount} {currency}
              </strong>{" "}
              to {projectName}
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 text-sm">
              <p className="text-green-900 dark:text-green-100">
                ✅ Payment confirmed
                <br />
                📧 Receipt sent to {donorEmail}
                <br />
                🔗 Recording on blockchain...
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
