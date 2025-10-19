'use client';

import Image from "next/image";
import Link from "next/link";
import { HandHeart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useState } from "react";

export default function WelcomePage() {
  const welcomeImage = PlaceHolderImages.find(img => img.id === 'welcome-child');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const handleGetStarted = () => {
    setIsLoading(true);
    // Simulate a network request
    setTimeout(() => {
      router.push('/connect');
    }, 1000);
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4 text-center">
      <div className="flex flex-col items-center">
        <HandHeart className="h-24 w-24 text-primary" />
        <h2 className="mt-2 text-3xl font-bold text-foreground">PaySmile</h2>
      </div>

      {welcomeImage && (
        <div className="my-8 w-full max-w-md">
            <Image
              src={welcomeImage.imageUrl}
              alt={welcomeImage.description}
              width={1200}
              height={675}
              className="rounded-xl object-cover aspect-video"
              data-ai-hint={welcomeImage.imageHint}
            />
        </div>
      )}

      <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground">
        Small Payments, Big Smiles
      </h1>

      <div className="mt-12 flex w-full max-w-sm flex-col items-center gap-4">
        <Button onClick={handleGetStarted} size="lg" className="h-14 w-full rounded-full text-lg font-bold">
          Get Started
        </Button>
        <Button asChild variant="secondary" size="lg" className="h-14 w-full rounded-full bg-primary/20 text-secondary-foreground hover:bg-primary/30 text-lg font-bold">
          <Link href="/learn-more">Learn More</Link>
        </Button>
      </div>
    </div>
  );
}
