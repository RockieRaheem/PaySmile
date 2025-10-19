"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

export default function SetupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [monthlyLimit, setMonthlyLimit] = useState(5000);
  const [roundUpAmount, setRoundUpAmount] = useState("100");
  const [isSaving, setIsSaving] = useState(false);

  const handleLimitChange = (amount: number) => {
    setMonthlyLimit((prev) => Math.max(0, prev + amount));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate saving settings
    setTimeout(() => {
      // In a real app, you would save these settings to a backend or localStorage
      localStorage.setItem('donationSettings', JSON.stringify({ monthlyLimit, roundUpAmount }));
      setIsSaving(false);
      toast({
        title: "Settings Saved!",
        description: "Your donation preferences have been updated.",
      });
      router.push('/dashboard');
    }, 1000);
  };
  
  const purchaseAmount = 9500;
  const roundupValue = parseInt(roundUpAmount, 10);
  const totalAmount = Math.ceil(purchaseAmount / roundupValue) * roundupValue;
  const donationAmount = totalAmount - purchaseAmount;


  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 pb-2">
         <div className="w-12"></div>
        <h1 className="flex-1 text-center text-lg font-bold">Manage Donations</h1>
        <Button variant="ghost" size="icon">
          <span className="material-symbols-outlined">info</span>
        </Button>
      </header>

      <main className="flex-1 space-y-4 p-4">
        <p className="text-center text-sm text-primary">
          Your small change can make a big difference. Set up your donation preferences below.
        </p>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <Label htmlFor="auto-roundup" className="text-base font-medium">Enable Automatic Round-Ups</Label>
              <p className="text-sm text-muted-foreground">Automatically round up your daily mobile payments</p>
            </div>
            <Switch id="auto-roundup" defaultChecked />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="mb-2 font-medium">Round up to the nearest...</p>
            <RadioGroup defaultValue="100" value={roundUpAmount} onValueChange={setRoundUpAmount} className="rounded-full bg-primary/10 p-1">
              <div className="flex justify-between">
                {[10, 50, 100].map((amount) => (
                  <Label key={amount} htmlFor={`round-up-${amount}`} className={`flex h-8 flex-1 cursor-pointer items-center justify-center rounded-full text-sm font-medium transition-colors ${roundUpAmount === String(amount) ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
                    <RadioGroupItem value={String(amount)} id={`round-up-${amount}`} className="sr-only" />
                    <span className="truncate">{amount} Shillings</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
             <div className="space-y-1">
              <p className="text-base font-medium">Set a Monthly Donation Limit</p>
              <p className="text-sm text-muted-foreground">You're in control.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" className="h-7 w-7 rounded-full" onClick={() => handleLimitChange(-500)}>
                -
              </Button>
              <span className="text-sm">UGX</span>
              <Input
                type="number"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(Number(e.target.value))}
                className="h-8 w-12 border-0 bg-transparent p-0 text-center text-base font-medium focus-visible:ring-0"
              />
              <Button size="icon" variant="outline" className="h-7 w-7 rounded-full" onClick={() => handleLimitChange(500)}>
                +
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-4 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-4xl">shopping_cart</span>
            </div>
            <p className="font-medium">Your purchase</p>
            <p className="mb-2 text-2xl font-bold">{new Intl.NumberFormat('en-US').format(purchaseAmount)} UGX</p>
            <span className="material-symbols-outlined my-1 text-muted-foreground">arrow_downward</span>
            <p className="font-medium">Rounds up to</p>
            <p className="mb-2 text-2xl font-bold">{new Intl.NumberFormat('en-US').format(totalAmount)} UGX</p>
            <div className="my-2 h-px w-full bg-border"></div>
            <p className="font-medium">Your donation</p>
            <p className="text-3xl font-bold text-primary">{new Intl.NumberFormat('en-US').format(donationAmount)} UGX</p>
            <p className="mt-2 text-xs text-muted-foreground">This amount goes directly to a verified community project.</p>
          </CardContent>
        </Card>
      </main>

      <div className="sticky bottom-0 space-y-2 bg-background p-4 pt-0">
        <Button size="lg" className="h-12 w-full rounded-full font-bold shadow-lg" onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Settings
        </Button>
      </div>
    </div>
  );
}
