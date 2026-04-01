"use client";

import { ExerciseLogger } from "@/components/fitness/exercise-logger";
import { FitnessStatsCard } from "@/components/fitness/fitness-stats";

export default function FitnessPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Fitness</h1>
          <p className="text-muted-foreground mt-1">Log workouts and track your activity.</p>
        </div>
        <img src="/fitness.svg" alt="" className="hidden md:block h-24 select-none opacity-80" draggable={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <ExerciseLogger />
        </div>
        <div className="lg:col-span-3">
          <FitnessStatsCard />
        </div>
      </div>
    </div>
  );
}
