import { BottomNav } from "@/components/bottom-nav";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { PageTransition } from "@/components/page-transition";
import { NavigationProgress } from "@/components/navigation-progress";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <NavigationProgress />
      <main className="flex-1 pb-24">
        <PageTransition>{children}</PageTransition>
      </main>
      <BottomNav />
      <PWAInstallPrompt />
    </div>
  );
}
