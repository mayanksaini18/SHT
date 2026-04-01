import { HabitGrid } from "@/components/habits/habit-grid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function HabitsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Habits</h1>
          <p className="text-muted-foreground mt-1">Build consistency, one day at a time.</p>
        </div>
        <div className="flex items-center gap-4">
          <img src="/healthy-habit.svg" alt="" className="hidden md:block h-24 select-none opacity-80" draggable={false} />
          <Link href="/habits/new">
            <Button variant="outline" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> New habit
            </Button>
          </Link>
        </div>
      </div>
      <HabitGrid />
    </div>
  );
}
