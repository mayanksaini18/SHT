"use client";

import { useState } from "react";
import { Tick01Icon, SnowIcon, ArrowDown01Icon, ArrowUp01Icon } from "hugeicons-react";
import { HabitHeatmap } from "./habit-heatmap";
import type { Habit } from "@/types/habit";

interface HabitCardProps {
  habit: Habit;
  onCheckin: () => void;
}

export function HabitCard({ habit, onCheckin }: HabitCardProps) {
  const [expanded, setExpanded] = useState(false);

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
    <div className={`border rounded-xl transition-colors ${hasCheckedToday ? "bg-muted/30" : ""}`}>
      {/* Main row */}
      <div
        className={`p-4 flex items-center justify-between ${
          hasCheckedToday ? "" : "cursor-pointer hover:bg-muted/50 active:scale-[0.98]"
        }`}
        onClick={hasCheckedToday ? undefined : onCheckin}
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
                <SnowIcon className="h-3 w-3" />
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Expand toggle */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {expanded
              ? <ArrowUp01Icon className="h-3.5 w-3.5" />
              : <ArrowDown01Icon className="h-3.5 w-3.5" />}
          </button>

          {/* Check circle */}
          <div
            className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-colors ${
              hasCheckedToday
                ? "bg-foreground border-foreground text-background"
                : "border-border"
            }`}
          >
            {hasCheckedToday && <Tick01Icon className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {/* Heatmap (expanded) */}
      {expanded && (
        <div className="px-4 pb-4 border-t pt-4">
          <p className="text-xs text-muted-foreground mb-3">Last {16 * 7} days</p>
          <HabitHeatmap habit={habit} />
        </div>
      )}
    </div>
  );
}
