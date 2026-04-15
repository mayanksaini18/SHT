export interface JournalEntry {
  _id: string;
  user: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  aiSummary?: string;
  aiSentiment?: "positive" | "neutral" | "negative" | "mixed";
  aiThemes?: string[];
  aiGeneratedAt?: string;
}

export interface JournalAnalysis {
  summary: string;
  sentiment: "positive" | "neutral" | "negative" | "mixed";
  themes: string[];
  cached: boolean;
}
