"use client";

import { Smile, Moon, Droplets, Dumbbell } from "lucide-react";
import { useMoods } from "@/hooks/use-mood";
import { useSleepHistory } from "@/hooks/use-sleep";
import { useWaterToday } from "@/hooks/use-water";
import { useFitnessStats } from "@/hooks/use-fitness";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";

const EMOJI_MAP: Record<number, string> = {
  1: "😢", 2: "😞", 3: "😐", 4: "😊", 5: "😄",
};

function GoalBar({ value, max, colorClass = "bg-foreground" }: { value: number; max: number; colorClass?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-green-400" : colorClass}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function ModuleWidgets() {
  const { data: moods } = useMoods(1);
  const { data: sleeps } = useSleepHistory(1);
  const { data: water } = useWaterToday();
  const { data: fitness } = useFitnessStats();
  const goals = useAuthStore((s) => s.user?.goals);

  const latestMood = moods?.[0];
  const latestSleep = sleeps?.[0];
  const glasses = water?.glasses ?? 0;
  const waterGoal = goals?.water ?? water?.goal ?? 8;
  const sleepGoal = goals?.sleep ?? 7;
  const exerciseGoal = goals?.exercise ?? 4;
  const moodGoal = goals?.mood ?? 3;
  const activeDays = fitness?.activeDays ?? 0;

  const widgets = [
    {
      href: "/mood",
      icon: latestMood
        ? <span className="text-lg">{EMOJI_MAP[latestMood.score]}</span>
        : <Smile className="h-4 w-4 text-muted-foreground" />,
      label: "Mood",
      value: latestMood ? `${latestMood.score}/5` : "No entry",
      bar: latestMood ? <GoalBar value={latestMood.score} max={moodGoal} colorClass="bg-violet-400" /> : null,
      subtext: latestMood ? `Goal ≥ ${moodGoal}/5` : null,
    },
    {
      href: "/sleep",
      icon: <Moon className="h-4 w-4 text-muted-foreground" />,
      label: "Sleep",
      value: latestSleep ? `${latestSleep.duration}h` : "No entry",
      bar: latestSleep ? <GoalBar value={latestSleep.duration} max={sleepGoal} colorClass="bg-sky-400" /> : null,
      subtext: latestSleep ? `Goal ${sleepGoal}h` : null,
    },
    {
      href: "/water",
      icon: <Droplets className="h-4 w-4 text-muted-foreground" />,
      label: "Water",
      value: `${glasses}/${waterGoal}`,
      bar: <GoalBar value={glasses} max={waterGoal} colorClass="bg-sky-400" />,
      subtext: `Goal ${waterGoal} glasses`,
    },
    {
      href: "/fitness",
      icon: <Dumbbell className="h-4 w-4 text-muted-foreground" />,
      label: "Fitness",
      value: `${activeDays}/${exerciseGoal} days`,
      bar: <GoalBar value={activeDays} max={exerciseGoal} colorClass="bg-emerald-400" />,
      subtext: `Goal ${exerciseGoal} days/week`,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {widgets.map((w) => (
        <Link key={w.href} href={w.href}>
          <div className="border rounded-xl p-4 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-2 mb-3">
              {w.icon}
              <span className="text-xs text-muted-foreground">{w.label}</span>
            </div>
            <p className="text-lg font-semibold tracking-tight">{w.value}</p>
            {w.bar}
            {w.subtext && (
              <p className="text-[10px] text-muted-foreground mt-1">{w.subtext}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
