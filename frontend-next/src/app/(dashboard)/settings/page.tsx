"use client";

import { useAuthStore } from "@/stores/auth-store";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="max-w-lg mx-auto space-y-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Profile</h2>
        <div className="border rounded-xl divide-y">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm">Name</span>
            <span className="text-sm text-muted-foreground">{user?.name || "—"}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm">Email</span>
            <span className="text-sm text-muted-foreground">{user?.email || "—"}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm">Level</span>
            <span className="text-sm text-muted-foreground">{user?.level ?? 1}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm">XP</span>
            <span className="text-sm text-muted-foreground">{user?.xp ?? 0}</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Appearance</h2>
        <div className="border rounded-xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-xs text-muted-foreground mt-0.5">Toggle light and dark mode</p>
          </div>
          <ThemeToggle />
        </div>
      </section>

      <p className="text-xs text-muted-foreground">LifeOS v1.0</p>
    </div>
  );
}
