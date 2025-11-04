"use client";

import { useState } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
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
import { Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FiatDonationModalProps {
  projectId: number;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FiatDonationModalInline({
  projectId,
  projectName,
  isOpen,
  onClose,
}: FiatDonationModalProps) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("RWF");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const { toast } = useToast();

  const currencies = [
    { value: "RWF", label: "Rwandan Franc (RWF)", symbol: "FRw" },
    { value: "UGX", label: "Ugandan Shilling (UGX)", symbol: "USh" },
    { value: "KES", label: "Kenyan Shilling (KES)", symbol: "KSh" },
    { value: "USD", label: "US Dollar (USD)", symbol: "$" },
  ];

  const selectedCurrency = currencies.find((c) => c.value === currency);

  // Flutterwave configuration
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "",
    tx_ref: `PAYSMILE-${projectId}-${Date.now()}`,
    amount: parseFloat(amount) || 0,
    currency: currency,
    payment_options: "mobilemoney,card",
    customer: {
      email: donorEmail,
      phone_number: donorPhone,
      name: donorName,
    },
    customizations: {
      title: projectName,
      description: `Donation to ${projectName}`,
      logo: "https://paysmile.app/logo.png",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handleDonation = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
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
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Open Flutterwave payment modal (stays on your site!)
    handleFlutterPayment({
      callback: (response) => {
        console.log("Payment response:", response);
        closePaymentModal(); // Close the modal

        if (response.status === "successful") {
          toast({
            title: "Donation Successful! 🎉",
            description: `Thank you for donating ${amount} ${currency} to ${projectName}`,
          });

          // TODO: Save donation to Firestore
          // TODO: Queue for crypto conversion

          onClose();
        } else {
          toast({
            title: "Payment Failed",
            description: "Your payment was not completed. Please try again.",
            variant: "destructive",
          });
        }
      },
      onClose: () => {
        console.log("Payment modal closed");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Donate to {projectName}</DialogTitle>
          <DialogDescription>
            Support this project with Mobile Money or Card
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleDonation} className="space-y-4 mt-4">
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

          {/* Phone Number */}
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

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 text-sm">
            <p className="text-blue-900 dark:text-blue-100">
              <strong>✨ No wallet needed!</strong> Pay with Mobile Money (MTN,
              Airtel) or Card. Payment stays on this page.
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            <Smartphone className="mr-2 h-4 w-4" />
            Donate {amount && `${selectedCurrency?.symbol}${amount}`}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secured by Flutterwave • Your data is encrypted
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
