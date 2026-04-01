"use client";

import { useAuthStore } from "@/stores/auth-store";
import { ThemeToggle } from "./theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  const user = useAuthStore((s) => s.user);
  const firstLetter = (user?.name || "U").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-sm border-b px-4 md:px-8 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1" />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
            <span>Lvl {user?.level ?? 1}</span>
            <span className="text-border">|</span>
            <span>{user?.xp ?? 0} XP</span>
          </div>
          <ThemeToggle />
          <div className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium">
            {firstLetter}
          </div>
        </div>
      </div>
    </header>
  );
}
