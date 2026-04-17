"use client";

import { ExerciseLogger } from "@/components/fitness/exercise-logger";
import { FitnessStatsCard } from "@/components/fitness/fitness-stats";

export default function FitnessPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Fitness</h1>
          <p className="text-muted-foreground mt-1">Log workouts and track your activity.</p>
        </div>
        <img src="/fitness.svg" alt="" className="hidden md:block h-24 select-none opacity-80" draggable={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-4">Log workout</h2>
          <ExerciseLogger />
        </div>
        <div>
          <h2 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-4">This week</h2>
          <FitnessStatsCard />
        </div>
      </div>
    </div>
  );
}
