export interface Insight {
  _id: string;
  user: string;
  type: "weekly_report" | "correlation" | "tip";
  content: string;
  data?: Record<string, unknown>;
  weekOf?: string;
  createdAt: string;
}
