import { BottomNav } from "@/components/bottom-nav";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav />
      <PWAInstallPrompt />
    </div>
  );
}
