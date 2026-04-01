"use client";

import { WaterTracker } from "@/components/water/water-tracker";
import { WaterHistory } from "@/components/water/water-history";

export default function WaterPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Water</h1>
          <p className="text-muted-foreground mt-1">Stay hydrated throughout the day.</p>
        </div>
        <img src="/water.svg" alt="" className="hidden md:block h-24 select-none opacity-80" draggable={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <WaterTracker />
        </div>
        <div className="lg:col-span-3">
          <WaterHistory />
        </div>
      </div>
    </div>
  );
}
