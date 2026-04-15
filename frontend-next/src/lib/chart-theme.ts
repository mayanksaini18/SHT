"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export interface ChartScaleColors {
  grid: string;
  tickColor: string;
}

const DARK: ChartScaleColors = {
  grid:      "rgba(255, 255, 255, 0.07)",
  tickColor: "rgba(255, 255, 255, 0.4)",
};

const LIGHT: ChartScaleColors = {
  grid:      "rgba(0, 0, 0, 0.06)",
  tickColor: "rgba(0, 0, 0, 0.4)",
};

export function useChartScaleColors(): ChartScaleColors {
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = useState<ChartScaleColors>(LIGHT);

  useEffect(() => {
    setColors(resolvedTheme === "dark" ? DARK : LIGHT);
  }, [resolvedTheme]);

  return colors;
}

// Per-chart accent palettes — vibrant, readable on both light & dark
export const CHART_COLORS = {
  mood: {
    line:   "#a78bfa",                      // violet-400
    fill:   "rgba(167, 139, 250, 0.12)",
    point:  "#a78bfa",
  },
  sleep: {
    bar:      "rgba(56, 189, 248, 0.55)",   // sky-400
    barHover: "rgba(56, 189, 248, 0.85)",
  },
  weekly: {
    line:  "#34d399",                       // emerald-400
    fill:  "rgba(52, 211, 153, 0.1)",
    point: "#34d399",
  },
  water: {
    bar:      "rgba(34, 211, 238, 0.55)",   // cyan-400
    barHover: "rgba(34, 211, 238, 0.85)",
    barGoal:  "rgba(34, 211, 238, 0.85)",   // hit goal — full opacity
  },
} as const;
