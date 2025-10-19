'use client';

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

type Donation = {
  id: string;
  projectName: string;
  amount: number;
  donationTimestamp: {
    seconds: number;
  };
};

export default function HistoryPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const donationsRef = useMemoFirebase(() => 
    user ? collection(firestore, `users/${user.uid}/donations`) : null,
    [user, firestore]
  );
  
  const donationsQuery = useMemoFirebase(() =>
    donationsRef ? query(donationsRef, orderBy("donationTimestamp", "desc")) : null,
    [donationsRef]
  );

  const { data: donationHistory, isLoading } = useCollection<Donation>(donationsQuery);

  const formatDate = (seconds: number) => {
    return new Date(seconds * 1000).toLocaleDateString();
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
        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">Loading donation history...</p>
          </div>
        )}
        {!isLoading && donationHistory?.length === 0 ? (
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
                  <p className="text-sm text-muted-foreground">{formatDate(donation.donationTimestamp.seconds)}</p>
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
