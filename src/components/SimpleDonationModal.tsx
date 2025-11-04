"use client";

import { useState, useEffect } from "react";
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
import {
  Smartphone,
  CreditCard,
  CheckCircle2,
  Loader2,
  Wallet,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDonateToProject } from "@/hooks/use-contracts";

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
  const [step, setStep] = useState<
    "form" | "processing" | "payment" | "success"
  >("form");
  const [paymentLink, setPaymentLink] = useState<string>("");

  // Wallet connection
  const { address, isConnected } = useAccount();
  const {
    donateToProject,
    isPending: isDonating,
    isSuccess,
    hash,
  } = useDonateToProject();

  // Separate state for wallet vs fiat
  const [walletAmount, setWalletAmount] = useState("");
  const [fiatAmount, setFiatAmount] = useState("");
  const [currency, setCurrency] = useState("RWF");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");

  // Card-specific fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<
    "wallet" | "mobilemoney" | "card"
  >("wallet");
  const [transactionRef, setTransactionRef] = useState<string>("");
  const { toast } = useToast();

  const currencies = [
    { value: "RWF", label: "Rwandan Franc", symbol: "FRw" },
    { value: "USD", label: "US Dollar", symbol: "$" },
    { value: "UGX", label: "Ugandan Shilling", symbol: "USh" },
  ];

  const selectedCurrency = currencies.find((c) => c.value === currency);

  // Watch for transaction success
  useEffect(() => {
    if (isSuccess && step === "processing" && paymentMethod === "wallet") {
      setStep("success");
      setTransactionRef(hash || "");

      toast({
        title: "Donation Confirmed! 🎉",
        description: `Successfully donated ${walletAmount} CELO`,
      });

      setTimeout(() => {
        handleClose();
      }, 5000);
    }
  }, [isSuccess, step, hash, walletAmount, paymentMethod]);

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = paymentMethod === "wallet" ? walletAmount : fiatAmount;

    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: `Please enter a valid amount`,
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod !== "wallet" && parseFloat(amount) < 100) {
      toast({
        title: "Amount Too Low",
        description: `Minimum donation is 100 ${currency}`,
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "card" && (!cardNumber || !cardExpiry || !cardCvv)) {
      toast({
        title: "Missing Card Information",
        description: "Please fill in all card details",
        variant: "destructive",
      });
      return;
    }

    if (
      paymentMethod === "mobilemoney" &&
      (!donorName || !donorEmail || !donorPhone)
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Handle wallet payment (crypto donation)
    if (paymentMethod === "wallet") {
      if (!isConnected || !address) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet first",
          variant: "destructive",
        });
        onClose();
        return;
      }

      try {
        setStep("processing");

        toast({
          title: "Confirm Transaction",
          description:
            "Please confirm the transaction in your wallet (MetaMask)",
        });

        // Donate via smart contract
        await donateToProject(projectId, walletAmount);

        toast({
          title: "Transaction Submitted",
          description: "Waiting for blockchain confirmation...",
        });

        // Success is now handled by useEffect watching isSuccess
        // Timeout fallback after 2 minutes
        setTimeout(() => {
          if (!isSuccess && step === "processing") {
            setStep("form");
            toast({
              title: "Transaction Timeout",
              description: "Please check your wallet and try again",
              variant: "destructive",
            });
          }
        }, 120000);
      } catch (error: any) {
        console.error("Wallet donation error:", error);
        setStep("form");
        toast({
          title: "Transaction Failed",
          description: error?.message || "Failed to process donation",
          variant: "destructive",
        });
      }
      return;
    }

    // Start fiat payment processing
    setStep("processing");

    try {
      // Call Flutterwave API to initialize payment
      const response = await fetch("/api/donations/fiat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(fiatAmount),
          currency,
          donorName,
          donorEmail,
          donorPhone,
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
        setTransactionRef(data.tx_ref);
        setPaymentLink(data.link);
        setStep("payment");

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
    setWalletAmount("");
    setFiatAmount("");
    setDonorName("");
    setDonorEmail("");
    setDonorPhone("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setTransactionRef("");
    setPaymentLink("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={step === "payment" ? "sm:max-w-[650px]" : "sm:max-w-[450px]"}
      >
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle>Donate to {projectName}</DialogTitle>
              <DialogDescription>
                Choose your preferred payment method
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleDonation} className="space-y-4 mt-4">
              {/* Payment Method Priority */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={paymentMethod === "wallet" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("wallet" as any)}
                    className="w-full"
                    title="Recommended"
                  >
                    <Wallet className="mr-1 h-4 w-4" />
                    Wallet
                  </Button>
                  <Button
                    type="button"
                    variant={
                      paymentMethod === "mobilemoney" ? "default" : "outline"
                    }
                    onClick={() => setPaymentMethod("mobilemoney")}
                    className="w-full"
                  >
                    <Smartphone className="mr-1 h-4 w-4" />
                    Mobile
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("card")}
                    className="w-full"
                  >
                    <CreditCard className="mr-1 h-4 w-4" />
                    Card
                  </Button>
                </div>
                {paymentMethod === "wallet" && (
                  <p className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded px-2 py-1.5">
                    ⚡ <strong>Recommended:</strong> Instant & secure blockchain
                    donation
                  </p>
                )}
              </div>

              {/* Currency - Only for fiat payments */}
              {paymentMethod !== "wallet" && (
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
              )}

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base font-semibold">
                  {paymentMethod === "wallet" ? "Amount (CELO)" : `Amount`}
                  {paymentMethod !== "wallet" && (
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      (Minimum: 100 {currency})
                    </span>
                  )}
                </Label>
                <div className="relative">
                  {paymentMethod !== "wallet" && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-base">
                      {selectedCurrency?.symbol}
                    </span>
                  )}
                  {paymentMethod === "wallet" && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-base">
                      CELO
                    </span>
                  )}
                  <Input
                    id="amount"
                    type="number"
                    value={
                      paymentMethod === "wallet" ? walletAmount : fiatAmount
                    }
                    onChange={(e) =>
                      paymentMethod === "wallet"
                        ? setWalletAmount(e.target.value)
                        : setFiatAmount(e.target.value)
                    }
                    className="pl-20 h-14 text-lg font-semibold"
                    required
                    min={paymentMethod === "wallet" ? "0.01" : "100"}
                    step={paymentMethod === "wallet" ? "0.01" : "1"}
                  />
                </div>
                {paymentMethod === "wallet" && (
                  <p className="text-xs text-muted-foreground">
                    Enter amount in CELO tokens
                  </p>
                )}
              </div>

              {/* Card-specific fields */}
              {paymentMethod === "card" && (
                <>
                  <div className="space-y-2">
                    <Label
                      htmlFor="cardNumber"
                      className="text-base font-semibold"
                    >
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => {
                        const formatted = e.target.value
                          .replace(/\s/g, "")
                          .replace(/(\d{4})/g, "$1 ")
                          .trim();
                        setCardNumber(formatted);
                      }}
                      className="h-14 text-base"
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="cardExpiry"
                        className="text-base font-semibold"
                      >
                        Expiry Date
                      </Label>
                      <Input
                        id="cardExpiry"
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + "/" + value.slice(2, 4);
                          }
                          setCardExpiry(value);
                        }}
                        className="h-14 text-base"
                        maxLength={5}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="cardCvv"
                        className="text-base font-semibold"
                      >
                        CVV
                      </Label>
                      <Input
                        id="cardCvv"
                        type="text"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) =>
                          setCardCvv(e.target.value.replace(/\D/g, ""))
                        }
                        className="h-14 text-base"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="cardName"
                      className="text-base font-semibold"
                    >
                      Cardholder Name
                    </Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="John Doe"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="h-14 text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="cardEmail"
                      className="text-base font-semibold"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="cardEmail"
                      type="email"
                      placeholder="john@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="h-14 text-base"
                      required
                    />
                  </div>
                </>
              )}

              {/* Mobile Money fields */}
              {paymentMethod === "mobilemoney" && (
                <>
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-semibold">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="h-14 text-base"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-semibold">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="h-14 text-base"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-semibold">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+250 780 000 000"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="h-14 text-base"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: +250 780 000 000
                    </p>
                  </div>
                </>
              )}

              {/* Info Messages */}
              {paymentMethod === "mobilemoney" && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3 text-sm">
                  <p className="text-green-900 dark:text-green-100">
                    ✨ <strong>Easy & Secure:</strong> No wallet needed! Payment
                    processed instantly. Donation recorded on blockchain for
                    transparency.
                  </p>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 text-sm">
                  <p className="text-blue-900 dark:text-blue-100">
                    💳 <strong>Secure Card Payment:</strong> All transactions
                    are encrypted and secure. Accepted cards: Visa, Mastercard,
                    Amex.
                  </p>
                </div>
              )}

              {/* Wallet Info */}
              {paymentMethod === "wallet" && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 text-sm">
                  <p className="text-blue-900 dark:text-blue-100">
                    🔐 <strong>Direct Blockchain:</strong> Your donation goes
                    directly to the project smart contract. Most transparent and
                    instant method.
                  </p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold"
                size="lg"
              >
                {paymentMethod === "wallet"
                  ? "Connect Wallet & Donate"
                  : `Pay with ${
                      paymentMethod === "mobilemoney" ? "Mobile Money" : "Card"
                    }`}
                {fiatAmount &&
                  paymentMethod !== "wallet" &&
                  ` - ${selectedCurrency?.symbol}${fiatAmount}`}
                {walletAmount &&
                  paymentMethod === "wallet" &&
                  ` - ${walletAmount} CELO`}
              </Button>
            </form>
          </>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Complete Your Payment</DialogTitle>
              <DialogDescription>
                Securely process your{" "}
                {paymentMethod === "mobilemoney" ? "mobile money" : "card"}{" "}
                payment below
              </DialogDescription>
            </DialogHeader>

            <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <iframe
                src={paymentLink}
                className="w-full h-[600px]"
                title="Flutterwave Payment"
                style={{ border: "none" }}
                allow="payment"
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Waiting for payment confirmation...</span>
            </div>
          </div>
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
          <div className="py-8 text-center space-y-6">
            <CheckCircle2 className="h-20 w-20 mx-auto text-green-500" />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Payment Confirmed</h3>
              <p className="text-base text-muted-foreground">
                Thank you for your donation to {projectName}
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Amount:
                </span>
                <span className="font-semibold text-lg text-right">
                  {paymentMethod === "wallet"
                    ? `${walletAmount} CELO`
                    : `${selectedCurrency?.symbol}${fiatAmount} ${currency}`}
                </span>
              </div>
              {donorEmail && (
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    Receipt sent to:
                  </span>
                  <span className="font-medium text-sm text-right break-all">
                    {donorEmail}
                  </span>
                </div>
              )}
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Transaction ID:
                </span>
                <span className="font-mono text-xs text-right break-all max-w-[200px]">
                  {transactionRef}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  Verified ✓
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground px-4">
              Your contribution will be recorded on the Celo blockchain for full
              transparency
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
