'use client';

import Image from "next/image";
import Link from "next/link";
import { Smile, UserCircle, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { userStats, activeProjects, fundedProjects } from "@/lib/data";
import { useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { useFirestore, useDoc } from "@/firebase";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="flex-1">
      <CardContent className="p-4">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold text-secondary">{value}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = user ? doc(firestore, `users/${user.uid}/userProfile`, user.uid) : null;
  const { data: userProfile } = useDoc(userProfileRef);

  return (
    <div className="bg-background text-foreground">
      <header className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-2">
          <Smile className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-secondary">PaySmile</h1>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <UserCircle className="h-8 w-8" />
          </Link>
        </Button>
      </header>

      <main className="p-4 space-y-6">
        <section>
          <Card className="bg-secondary text-secondary-foreground">
            <CardContent className="p-6">
              <p className="text-lg font-medium">Welcome, {userProfile?.userName || 'User'}!</p>
              <p className="mt-2 text-4xl font-bold tracking-tight">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'UGX', minimumFractionDigits: 0 }).format(userStats.totalDonations)}
              </p>
               <p className="text-sm">Your Total Donations</p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-[22px] font-bold leading-tight tracking-tight text-secondary mb-3">Your Impact</h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Projects Supported" value={userStats.projectsSupported} />
            <StatCard label="Lives Impacted" value={userStats.livesImpacted} />
            <div className="col-span-2">
              <StatCard label="Round-ups Made" value={userStats.roundupsMade.toLocaleString()} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[22px] font-bold leading-tight tracking-tight text-secondary mb-3">Active Projects</h2>
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {activeProjects.map((project) => (
                <CarouselItem key={project.id} className="basis-4/5 pl-4 md:basis-1/3">
                  <Card className="overflow-hidden">
                    {project.image && (
                       <Image
                        src={project.image.imageUrl}
                        alt={project.image.description}
                        width={400}
                        height={225}
                        className="w-full h-32 object-cover"
                        data-ai-hint={project.image.imageHint}
                      />
                    )}
                    <CardContent className="p-4">
                      <p className="font-bold text-secondary">{project.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Funding Goal: {new Intl.NumberFormat('en-US').format(project.fundingGoal)} UGX
                      </p>
                      <Progress value={(project.currentFunding / project.fundingGoal) * 100} className="mt-3 h-2.5" />
                      <p className="mt-1 text-right text-xs text-muted-foreground">
                        {Math.round((project.currentFunding / project.fundingGoal) * 100)}% Funded
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        <section>
          <h2 className="text-[22px] font-bold leading-tight tracking-tight text-secondary mb-3">Funded Projects</h2>
           <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {fundedProjects.map((project) => (
                <CarouselItem key={project.id} className="basis-4/5 pl-4 md:basis-1/3">
                  <Card className="overflow-hidden">
                     {project.image && (
                       <Image
                        src={project.image.imageUrl}
                        alt={project.image.description}
                        width={400}
                        height={225}
                        className="w-full h-32 object-cover"
                        data-ai-hint={project.image.imageHint}
                      />
                    )}
                    <CardContent className="p-4">
                      <p className="font-bold text-secondary">{project.title}</p>
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        <CheckCircle className="h-4 w-4" />
                        Fully Funded!
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </main>
    </div>
  );
}
