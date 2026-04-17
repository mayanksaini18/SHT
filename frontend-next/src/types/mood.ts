export interface Mood {
  _id: string;
  user: string;
  date: string;
  score: number;
  energy?: number;
  notes?: string;
  tags: string[];
  createdAt: string;
}

export interface MoodTrend {
  date: string;
  score: number;
  energy: number | null;
  tags: string[];
}

export interface MoodTrendsResponse {
  trends: MoodTrend[];
  avgScore: number;
  avgEnergy: number;
  totalEntries: number;
}
