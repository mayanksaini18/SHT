export interface Challenge {
  _id: string;
  key: string;
  title: string;
  description: string;
  module: "mood" | "sleep" | "water" | "exercise" | "habits" | "journal";
  target: number;
  progress: number;
  xpReward: number;
  weekStart: string;
  completed: boolean;
  completedAt?: string;
}
