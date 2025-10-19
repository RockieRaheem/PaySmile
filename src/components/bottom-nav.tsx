"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: "home", label: "Home" },
  { href: "/projects", icon: "how_to_vote", label: "Vote" },
  { href: "/badges", icon: "military_tech", label: "Badges" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-card">
      <div className="flex h-full items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-end gap-1 text-muted-foreground transition-colors flex-1",
                isActive ? "text-primary" : "hover:text-foreground"
              )}
            >
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
