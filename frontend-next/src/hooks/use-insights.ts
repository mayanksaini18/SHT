"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { Insight, CorrelationResult } from "@/types/insight";

export function useInsights() {
  return useQuery<Insight[]>({
    queryKey: ["insights"],
    queryFn: () => fetchApi("/insights"),
  });
}

export function useCorrelations() {
  return useQuery<CorrelationResult>({
    queryKey: ["insights", "correlations"],
    queryFn: () => fetchApi("/insights/correlations"),
  });
}

export function useWeeklyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fetchApi<Insight>("/insights/weekly"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });
}
