export interface Insight {
  _id: string;
  user: string;
  type: "weekly_report" | "correlation" | "tip";
  content: string;
  data?: Record<string, unknown>;
  weekOf?: string;
  createdAt: string;
}

export interface Correlation {
  id: string;
  title: string;
  description: string;
  strength: "strong" | "moderate" | "weak";
  direction: "positive" | "negative";
  r: number | null;
}

export interface CorrelationResult {
  correlations: Correlation[];
  dataPoints: { mood: number; sleep: number; water: number; fitness: number };
}
