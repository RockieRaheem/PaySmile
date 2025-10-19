'use client';

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { donationHistory } from "@/lib/data";

type Donation = {
  id: number;
  projectName: string;
  amount: number;
  date: string;
};

export default function HistoryPage() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 pb-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-bold">Donation History</h1>
        <div className="w-12" />
      </header>
      <main className="flex-1 space-y-4 p-4">
        {donationHistory?.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>You haven't made any donations yet.</p>
            </div>
          </div>
        ) : (
          donationHistory?.map((donation) => (
            <Card key={donation.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-bold">{donation.projectName}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(donation.date)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">
                    {new Intl.NumberFormat('en-US').format(donation.amount)} UGX
                  </p>
                  <p className="text-xs text-muted-foreground">Round-up</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  );
}
