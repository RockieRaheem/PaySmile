import Link from "next/link";
import { ArrowLeft, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 pb-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-bold">Settings</h1>
        <div className="w-12" />
      </header>
      <main className="flex-1 p-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User profile settings will be here.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="text-primary"/>
                My Smile Badges (NFTs)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your collected NFT reward badges will be displayed here.</p>
              <Button className="mt-4">Claim a Test Badge</Button>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notification settings will be here.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
