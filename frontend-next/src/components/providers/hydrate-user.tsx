"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@/types/user";

export function HydrateUser({ user }: { user: User | null }) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (user) setUser(user);
  }, [user, setUser]);

  return null;
}
