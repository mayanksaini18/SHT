"use client";

import { Smile, Moon, Droplets, Dumbbell } from "lucide-react";
import { useMoods } from "@/hooks/use-mood";
import { useSleepHistory } from "@/hooks/use-sleep";
import { useWaterToday } from "@/hooks/use-water";
import { useFitnessStats } from "@/hooks/use-fitness";
import Link from "next/link";

const EMOJI_MAP: Record<number, string> = {
  1: "😢", 2: "😞", 3: "😐", 4: "😊", 5: "😄",
};

export function ModuleWidgets() {
  const { data: moods } = useMoods(1);
  const { data: sleeps } = useSleepHistory(1);
  const { data: water } = useWaterToday();
  const { data: fitness } = useFitnessStats();

  const latestMood = moods?.[0];
  const latestSleep = sleeps?.[0];
  const glasses = water?.glasses ?? 0;
  const goal = water?.goal ?? 8;

  const widgets = [
    {
      href: "/mood",
      icon: latestMood ? <span className="text-lg">{EMOJI_MAP[latestMood.score]}</span> : <Smile className="h-4 w-4 text-muted-foreground" />,
      label: "Mood",
      value: latestMood ? `${latestMood.score}/5` : "No entry",
    },
    {
      href: "/sleep",
      icon: <Moon className="h-4 w-4 text-muted-foreground" />,
      label: "Sleep",
      value: latestSleep ? `${latestSleep.duration}h` : "No entry",
    },
    {
      href: "/water",
      icon: <Droplets className="h-4 w-4 text-muted-foreground" />,
      label: "Water",
      value: `${glasses}/${goal}`,
    },
    {
      href: "/fitness",
      icon: <Dumbbell className="h-4 w-4 text-muted-foreground" />,
      label: "Fitness",
      value: `${fitness?.activeDays ?? 0} days`,
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
          </div>
        </Link>
      ))}
    </div>
  );
}
