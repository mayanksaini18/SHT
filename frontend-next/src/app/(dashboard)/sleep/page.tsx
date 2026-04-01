"use client";

import { SleepLogger } from "@/components/sleep/sleep-logger";
import { SleepChart } from "@/components/sleep/sleep-chart";

export default function SleepPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sleep</h1>
          <p className="text-muted-foreground mt-1">Monitor your rest and recovery.</p>
        </div>
        <img src="/sleep.svg" alt="" className="hidden md:block h-24 select-none opacity-80" draggable={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <SleepLogger />
        </div>
        <div className="lg:col-span-3">
          <SleepChart />
        </div>
      </div>
    </div>
  );
}
