import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
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
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Donation history coming soon!</p>
        </div>
      </main>
    </div>
  );
}
