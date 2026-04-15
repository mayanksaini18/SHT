"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { Challenge } from "@/types/challenge";

export function useChallenges() {
  return useQuery({
    queryKey: ["challenges"],
    queryFn: () =>
      fetchApi<{ challenges: Challenge[]; weekStart: string }>("/challenges"),
  });
}
