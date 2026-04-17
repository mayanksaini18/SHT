"use client";

import { MoodLogger } from "@/components/mood/mood-logger";
import { MoodChart } from "@/components/mood/mood-chart";
import { MoodHistory } from "@/components/mood/mood-history";
import { MoodInsights } from "@/components/mood/mood-insights";

export default function MoodPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mood</h1>
          <p className="text-muted-foreground mt-1">Track how you feel each day.</p>
        </div>
        <img src="/mood.svg" alt="" className="hidden md:block h-24 select-none opacity-80" draggable={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <MoodLogger />
        </div>
        <div className="lg:col-span-3 space-y-10">
          <MoodChart />
          <MoodInsights />
          <MoodHistory />
        </div>
      </div>
    </div>
  );
}
