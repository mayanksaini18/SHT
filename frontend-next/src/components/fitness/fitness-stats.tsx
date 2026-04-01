"use client";

import { useFitnessStats, useFitnessHistory } from "@/hooks/use-fitness";
import { Skeleton } from "@/components/ui/skeleton";

export function FitnessStatsCard() {
  const { data: stats, isLoading: statsLoading } = useFitnessStats();
  const { data: history, isLoading: histLoading } = useFitnessHistory(7);

  if (statsLoading || histLoading) return <Skeleton className="h-64 w-full rounded-xl" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {[
          { value: `${stats?.weeklyCalories ?? 0}`, label: "Calories burned" },
          { value: `${stats?.weeklyDuration ?? 0}m`, label: "Total minutes" },
          { value: `${stats?.totalExercises ?? 0}`, label: "Exercises" },
          { value: `${stats?.activeDays ?? 0}`, label: "Active days" },
        ].map((s) => (
          <div key={s.label} className="border rounded-xl p-4">
            <p className="text-2xl font-semibold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {history && history.length > 0 && (
        <div>
          <h3 className="font-medium text-sm mb-3">Recent workouts</h3>
          <div className="space-y-2">
            {history.slice(0, 5).map((entry) => (
              <div key={entry._id} className="flex items-center justify-between py-2.5 border-b last:border-0">
                <span className="text-sm">
                  {new Date(entry.date).toLocaleDateString("en-US", {
                    weekday: "short", month: "short", day: "numeric",
                  })}
                </span>
                <span className="text-sm text-muted-foreground">
                  {entry.exercises.length} exercises &middot; {entry.totalDuration}m
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
