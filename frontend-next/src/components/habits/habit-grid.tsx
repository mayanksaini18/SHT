"use client";

import { useHabits, useCheckin } from "@/hooks/use-habits";
import { useAuthStore } from "@/stores/auth-store";
import { HabitCard } from "./habit-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function HabitGrid() {
  const { data, isLoading } = useHabits();
  const checkin = useCheckin();
  const updateUserStats = useAuthStore((s) => s.updateUserStats);

  const habits = data?.habits ?? [];

  async function handleCheckin(habitId: string) {
    try {
      const result = await checkin.mutateAsync(habitId);
      if (result.user) {
        updateUserStats(result.user.xp, result.user.level);
      }
      toast("Habit completed! +10 XP");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Check-in failed");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="border border-dashed rounded-xl py-16 text-center">
        <img
          src="/healthy-habit.svg"
          alt="Build habits"
          className="h-32 mx-auto mb-6 select-none"
          draggable={false}
        />
        <p className="font-medium mb-1">No habits yet</p>
        <p className="text-sm text-muted-foreground mb-5">
          Start building your daily routine.
        </p>
        <Link href="/habits/new">
          <Button variant="outline" size="sm">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Create habit
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit._id}
          habit={habit}
          onCheckin={() => handleCheckin(habit._id)}
        />
      ))}
    </div>
  );
}
