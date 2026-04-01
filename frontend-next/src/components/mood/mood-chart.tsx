"use client";

import { useMoods } from "@/hooks/use-mood";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export function MoodChart() {
  const { data: moods, isLoading } = useMoods();

  if (isLoading) return <Skeleton className="h-52 w-full rounded-xl" />;

  const sorted = [...(moods || [])].reverse();

  if (sorted.length === 0) {
    return (
      <div className="border border-dashed rounded-xl py-12 text-center">
        <img src="/mood.svg" alt="" className="h-24 mx-auto mb-4 select-none opacity-60" draggable={false} />
        <p className="text-sm text-muted-foreground">
          Log your first mood to see trends here.
        </p>
      </div>
    );
  }

  const labels = sorted.map((m) =>
    new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  );

  return (
    <div className="border rounded-xl p-6">
      <h3 className="font-medium text-sm mb-4">Mood over time</h3>
      <Line
        data={{
          labels,
          datasets: [{
            label: "Mood",
            data: sorted.map((m) => m.score),
            borderColor: "rgb(0, 0, 0)",
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            fill: true,
            tension: 0.4,
            borderWidth: 1.5,
            pointRadius: 3,
          }],
        }}
        options={{
          responsive: true,
          scales: {
            y: { min: 1, max: 5, ticks: { stepSize: 1 }, border: { display: false }, grid: { color: "rgba(0,0,0,0.04)" } },
            x: { border: { display: false }, grid: { display: false } },
          },
          plugins: { legend: { display: false } },
        }}
      />
    </div>
  );
}
