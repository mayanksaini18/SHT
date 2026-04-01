import { HabitGrid } from "@/components/habits/habit-grid";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { ModuleWidgets } from "@/components/dashboard/module-widgets";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getSession();

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {user?.name?.split(" ")[0] || "there"}.
          </h1>
          <p className="text-muted-foreground mt-1">Here&apos;s your overview for today.</p>
        </div>
        <img
          src="/dashboard.svg"
          alt=""
          className="hidden md:block h-24 select-none opacity-80"
          draggable={false}
        />
      </div>

      <ModuleWidgets />

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold tracking-tight">Habits</h2>
          <Link href="/habits/new">
            <Button variant="outline" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> New habit
            </Button>
          </Link>
        </div>
        <HabitGrid />
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight mb-6">Weekly progress</h2>
        <WeeklyChart xp={user?.xp ?? 0} level={user?.level ?? 1} />
      </section>
    </div>
  );
}
