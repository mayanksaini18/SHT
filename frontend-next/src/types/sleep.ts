export interface Sleep {
  _id: string;
  user: string;
  date: string;
  bedtime?: string;
  wakeTime?: string;
  duration: number;
  quality: number;
  notes?: string;
  createdAt: string;
}

export interface SleepStats {
  entries: { date: string; duration: number; quality: number }[];
  avgDuration: number;
  avgQuality: number;
  totalEntries: number;
}
