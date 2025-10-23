"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: "home", label: "Home" },
  { href: "/shop", icon: "shopping_bag", label: "Shop" },
  { href: "/projects", icon: "volunteer_activism", label: "Donate" },
  { href: "/badges", icon: "military_tech", label: "Badges" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-20 border-t bg-card shadow-lg safe-area-inset-bottom">
      <div className="flex h-full items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors flex-1 min-h-[56px] min-w-[56px] rounded-lg active:bg-accent/50",
                isActive
                  ? "text-primary font-semibold"
                  : "hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[28px]",
                  isActive && "font-bold"
                )}
              >
                {item.icon}
              </span>
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
