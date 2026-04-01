"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ListChecks,
  Smile,
  Moon,
  Droplets,
  Dumbbell,
  Sparkles,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { fetchApi } from "@/lib/api";

const NAV_ITEMS = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Habits", href: "/habits", icon: ListChecks },
  { title: "Mood", href: "/mood", icon: Smile },
  { title: "Sleep", href: "/sleep", icon: Moon },
  { title: "Water", href: "/water", icon: Droplets },
  { title: "Fitness", href: "/fitness", icon: Dumbbell },
  { title: "Insights", href: "/insights", icon: Sparkles },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const clearUser = useAuthStore((s) => s.clearUser);

  async function handleLogout() {
    try {
      await fetchApi("/auth/logout", { method: "POST" });
    } catch {
      // continue
    }
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    clearUser();
    router.push("/welcome");
  }

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5">
        <span className="text-lg font-semibold tracking-tight">LifeOS</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <a href={item.href}>
                    <SidebarMenuButton isActive={pathname === item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </a>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-4 space-y-1">
        <a href="/settings">
          <SidebarMenuButton isActive={pathname === "/settings"}>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </SidebarMenuButton>
        </a>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
