import { create } from "zustand";
import type { User, UserGoals, ReminderTimes } from "@/types/user";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserStats: (xp: number, level: number) => void;
  updateGoals: (goals: UserGoals) => void;
  updateReminderTimes: (reminderTimes: ReminderTimes) => void;
  updateEmailReminders: (emailReminders: boolean) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUserStats: (xp, level) =>
    set((state) => ({
      user: state.user ? { ...state.user, xp, level } : null,
    })),
  updateGoals: (goals) =>
    set((state) => ({
      user: state.user ? { ...state.user, goals } : null,
    })),
  updateReminderTimes: (reminderTimes) =>
    set((state) => ({
      user: state.user ? { ...state.user, reminderTimes } : null,
    })),
  updateEmailReminders: (emailReminders) =>
    set((state) => ({
      user: state.user ? { ...state.user, emailReminders } : null,
    })),
  clearUser: () => set({ user: null }),
}));
