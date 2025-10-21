"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after 3 seconds if not already installed
      setTimeout(() => {
        if (!window.matchMedia("(display-mode: standalone)").matches) {
          setShowPrompt(true);
        }
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem("pwa-prompt-dismissed", "true");
  };

  // Don't show if dismissed in this session or already installed
  if (
    !showPrompt ||
    sessionStorage.getItem("pwa-prompt-dismissed") ||
    window.matchMedia("(display-mode: standalone)").matches
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 md:left-auto md:right-8 md:max-w-sm animate-in slide-in-from-bottom">
      <Card className="border-2 border-primary shadow-xl">
        <CardContent className="p-4">
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-2 rounded-full p-1 hover:bg-accent"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3 pr-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Download className="h-6 w-6 text-primary" />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-base mb-1">Install PaySmile</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Add to your home screen for a faster, app-like experience!
              </p>

              <Button onClick={handleInstall} size="sm" className="w-full">
                Install App
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
