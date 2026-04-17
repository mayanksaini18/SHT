"use client";

import { useFitnessStats, useFitnessHistory } from "@/hooks/use-fitness";
import { Skeleton } from "@/components/ui/skeleton";
import { Dumbbell01Icon, FireIcon, Time01Icon, Calendar03Icon } from "hugeicons-react";
import type { Fitness } from "@/types/fitness";

const STAT_ICONS = [
  { icon: FireIcon, color: "text-orange-400 bg-orange-400/10" },
  { icon: Time01Icon, color: "text-sky-400 bg-sky-400/10" },
  { icon: Dumbbell01Icon, color: "text-violet-400 bg-violet-400/10" },
  { icon: Calendar03Icon, color: "text-emerald-400 bg-emerald-400/10" },
];

function WorkoutEntry({ entry }: { entry: Fitness }) {
  const typeIcons: Record<string, string> = {
    cardio: "🏃",
    strength: "🏋️",
    flexibility: "🧘",
    sports: "⚽",
    other: "💪",
  };

  return (
    <div className="border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          {new Date(entry.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
        <span className="text-xs text-muted-foreground">
          {entry.totalDuration}m total
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {entry.exercises.map((ex, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-xs"
          >
            <span>{typeIcons[ex.type] ?? "💪"}</span>
            <span>{ex.name}</span>
            <span className="text-muted-foreground">{ex.duration}m</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function FitnessStatsCard() {
  const { data: stats, isLoading: statsLoading } = useFitnessStats();
  const { data: history, isLoading: histLoading } = useFitnessHistory(7);

  if (statsLoading || histLoading) return <Skeleton className="h-64 w-full rounded-xl" />;

  const statItems = [
    { value: `${stats?.weeklyCalories ?? 0}`, label: "Calories burned" },
    { value: `${stats?.weeklyDuration ?? 0}m`, label: "Total minutes" },
    { value: `${stats?.totalExercises ?? 0}`, label: "Exercises" },
    { value: `${stats?.activeDays ?? 0}/7`, label: "Active days" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((s, i) => {
          const { icon: Icon, color } = STAT_ICONS[i];
          return (
            <div key={s.label} className="border rounded-xl p-4 flex items-start gap-3">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xl font-semibold">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent workouts */}
      {history && history.length > 0 && (
        <div>
          <h3 className="font-medium text-sm mb-3">Recent workouts</h3>
          <div className="space-y-3">
            {history.slice(0, 5).map((entry) => (
              <WorkoutEntry key={entry._id} entry={entry} />
            ))}
          </div>
        </div>
      )}

      {(!history || history.length === 0) && (
        <div className="border border-dashed rounded-xl py-12 text-center">
          <Dumbbell01Icon className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No workouts yet this week.</p>
          <p className="text-xs text-muted-foreground mt-1">Log your first workout to see stats here.</p>
        </div>
      )}
    </div>
  );
}
