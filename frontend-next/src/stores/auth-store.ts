import { create } from "zustand";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserStats: (xp: number, level: number) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUserStats: (xp, level) =>
    set((state) => ({
      user: state.user ? { ...state.user, xp, level } : null,
    })),
  clearUser: () => set({ user: null }),
}));
