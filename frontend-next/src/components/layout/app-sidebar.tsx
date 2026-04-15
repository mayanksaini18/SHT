"use client";

import Link from "next/link";
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
import {
  DashboardSquare01Icon,
  CheckListIcon,
  SmileIcon,
  Moon02Icon,
  DropletIcon,
  Dumbbell01Icon,
  MagicWand01Icon,
  Settings01Icon,
  Logout01Icon,
} from "hugeicons-react";
import { useAuthStore } from "@/stores/auth-store";
import { fetchApi } from "@/lib/api";

const NAV_ITEMS = [
  { title: "Dashboard", href: "/",        icon: DashboardSquare01Icon },
  { title: "Habits",    href: "/habits",  icon: CheckListIcon },
  { title: "Mood",      href: "/mood",    icon: SmileIcon },
  { title: "Sleep",     href: "/sleep",   icon: Moon02Icon },
  { title: "Water",     href: "/water",   icon: DropletIcon },
  { title: "Fitness",   href: "/fitness", icon: Dumbbell01Icon },
  { title: "Insights",  href: "/insights",icon: MagicWand01Icon },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const user     = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);

  const initials = (user?.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleLogout() {
    try { await fetchApi("/auth/logout", { method: "POST" }); } catch { /* continue */ }
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
                  <Link href={item.href}>
                    <SidebarMenuButton isActive={pathname === item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-4 space-y-2">
        {/* User row */}
        {user && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center text-[11px] font-semibold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate leading-none">{user.name}</p>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">Lvl {user.level} · {user.xp} XP</p>
            </div>
          </div>
        )}

        <div className="space-y-0.5">
          <Link href="/settings">
            <SidebarMenuButton isActive={pathname === "/settings"}>
              <Settings01Icon className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </Link>

          <SidebarMenuButton
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground w-full"
          >
            <Logout01Icon className="h-4 w-4" />
            <span>Sign out</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
