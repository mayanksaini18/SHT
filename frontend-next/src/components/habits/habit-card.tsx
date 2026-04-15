"use client";

import { Check, Snowflake } from "lucide-react";
import type { Habit } from "@/types/habit";

interface HabitCardProps {
  habit: Habit;
  onCheckin: () => void;
}

export function HabitCard({ habit, onCheckin }: HabitCardProps) {
  const hasCheckedToday = (habit.checkins || []).some((c) => {
    try {
      const d = new Date(c.date);
      const t = new Date();
      return (
        d.getFullYear() === t.getFullYear() &&
        d.getMonth() === t.getMonth() &&
        d.getDate() === t.getDate()
      );
    } catch {
      return false;
    }
  });

  const hasFreezeAvailable = (habit.freezesAvailable ?? 1) > 0;

  return (
    <div
      onClick={hasCheckedToday ? undefined : onCheckin}
      className={`border rounded-xl p-4 flex items-center justify-between transition-colors ${
        hasCheckedToday
          ? "bg-muted/30"
          : "cursor-pointer hover:bg-muted/50 active:scale-[0.98]"
      }`}
    >
      <div className="min-w-0">
        <p className="font-medium truncate">{habit.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-sm text-muted-foreground">
            {habit.streak > 0 ? `${habit.streak} day streak` : habit.frequency}
          </p>
          {hasFreezeAvailable && !hasCheckedToday && habit.streak > 0 && (
            <span
              className="inline-flex items-center gap-0.5 text-xs text-blue-500"
              title="Streak freeze available — miss a day and your streak is protected"
            >
              <Snowflake className="h-3 w-3" />
            </span>
          )}
        </div>
      </div>
      <div
        className={`h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          hasCheckedToday
            ? "bg-foreground border-foreground text-background"
            : "border-border"
        }`}
      >
        {hasCheckedToday && <Check className="h-4 w-4" />}
      </div>
    </div>
  );
}
