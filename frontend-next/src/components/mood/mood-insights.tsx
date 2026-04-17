"use client";

import { useCorrelations } from "@/hooks/use-insights";
import { ChartIncreaseIcon, ChartDecreaseIcon } from "hugeicons-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export function MoodInsights() {
  const { data, isLoading } = useCorrelations();

  if (isLoading) return <Skeleton className="h-24 w-full rounded-xl" />;

  const relevant = (data?.correlations ?? []).filter((c) =>
    ["sleep-mood", "sleep-energy", "habits-mood", "water-mood", "exercise-energy", "water-energy"].includes(c.id)
  );

  if (relevant.length === 0) return null;

  const top = relevant.slice(0, 3);

  return (
    <div className="border rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Your patterns</h3>
        <Link href="/insights" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          View all
        </Link>
      </div>
      <div className="space-y-2.5">
        {top.map((c) => (
          <div key={c.id} className="flex items-start gap-2.5">
            {c.direction === "positive" ? (
              <ChartIncreaseIcon className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
            ) : (
              <ChartDecreaseIcon className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
            )}
            <div>
              <p className="text-sm font-medium">{c.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{c.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
