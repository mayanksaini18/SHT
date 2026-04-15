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
import { useChartScaleColors, CHART_COLORS } from "@/lib/chart-theme";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const C = CHART_COLORS.mood;

export function MoodChart() {
  const { data: moods, isLoading } = useMoods();
  const scale = useChartScaleColors();

  if (isLoading) return <Skeleton className="h-52 w-full rounded-xl" />;

  const sorted = [...(moods || [])].reverse();

  if (sorted.length === 0) {
    return (
      <div className="border border-dashed rounded-xl py-12 text-center">
        <img src="/mood.svg" alt="" className="h-24 mx-auto mb-4 select-none opacity-60" draggable={false} />
        <p className="text-sm text-muted-foreground">Log your first mood to see trends here.</p>
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
            borderColor: C.line,
            backgroundColor: C.fill,
            pointBackgroundColor: C.point,
            pointBorderColor: "transparent",
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          }],
        }}
        options={{
          responsive: true,
          scales: {
            y: {
              min: 1, max: 5,
              ticks: { stepSize: 1, color: scale.tickColor },
              border: { display: false },
              grid: { color: scale.grid },
            },
            x: {
              border: { display: false },
              grid: { display: false },
              ticks: { color: scale.tickColor },
            },
          },
          plugins: { legend: { display: false } },
        }}
      />
    </div>
  );
}
