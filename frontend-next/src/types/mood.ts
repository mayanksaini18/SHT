export interface Mood {
  _id: string;
  user: string;
  date: string;
  score: number;
  notes?: string;
  tags: string[];
  createdAt: string;
}

export interface MoodTrend {
  date: string;
  avgScore: number;
}
