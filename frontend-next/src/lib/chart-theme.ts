"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export interface ChartColors {
  bar: string;
  barHover: string;
  line: string;
  fill: string;
  grid: string;
  tickColor: string;
}

const DARK: ChartColors = {
  bar:      "rgba(255, 255, 255, 0.15)",
  barHover: "rgba(255, 255, 255, 0.35)",
  line:     "rgba(255, 255, 255, 0.9)",
  fill:     "rgba(255, 255, 255, 0.05)",
  grid:     "rgba(255, 255, 255, 0.07)",
  tickColor: "rgba(255, 255, 255, 0.45)",
};

const LIGHT: ChartColors = {
  bar:      "rgba(0, 0, 0, 0.12)",
  barHover: "rgba(0, 0, 0, 0.25)",
  line:     "rgba(0, 0, 0, 0.85)",
  fill:     "rgba(0, 0, 0, 0.05)",
  grid:     "rgba(0, 0, 0, 0.06)",
  tickColor: "rgba(0, 0, 0, 0.45)",
};

export function useChartColors(): ChartColors {
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = useState<ChartColors>(LIGHT);

  useEffect(() => {
    setColors(resolvedTheme === "dark" ? DARK : LIGHT);
  }, [resolvedTheme]);

  return colors;
}
