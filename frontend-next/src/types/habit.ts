export interface Checkin {
  _id: string;
  date: string;
  xpEarned: number;
}

export interface Habit {
  _id: string;
  user: string;
  title: string;
  description?: string;
  frequency: "daily" | "weekly" | "monthly";
  checkins: Checkin[];
  streak: number;
  bestStreak: number;
  isActive: boolean;
  createdAt: string;
}

export interface HabitsResponse {
  habits: Habit[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AnalyticsDay {
  day: string;
  count: number;
}
