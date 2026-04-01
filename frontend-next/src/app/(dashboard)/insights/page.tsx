"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { useInsights, useWeeklyReport } from "@/hooks/use-insights";
import { Skeleton } from "@/components/ui/skeleton";

export default function InsightsPage() {
  const { data: insights, isLoading } = useInsights();
  const weeklyReport = useWeeklyReport();

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
            <p className="text-muted-foreground mt-1">AI-powered wellness reports.</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => weeklyReport.mutateAsync()}
          disabled={weeklyReport.isPending}
        >
          {weeklyReport.isPending ? (
            <><RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="h-3.5 w-3.5 mr-2" /> Generate report</>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      ) : !insights?.length ? (
        <div className="border border-dashed rounded-xl py-20 text-center">
          <img
            src="/personal-data.svg"
            alt="Insights"
            className="h-32 mx-auto mb-6 select-none"
            draggable={false}
          />
          <p className="font-medium mb-1">No insights yet</p>
          <p className="text-sm text-muted-foreground mb-5">
            Generate your first report to get started.
          </p>
          <Button
            variant="outline"
            onClick={() => weeklyReport.mutateAsync()}
            disabled={weeklyReport.isPending}
          >
            <Sparkles className="h-3.5 w-3.5 mr-2" /> Generate report
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {insights.map((insight) => (
            <div key={insight._id} className="border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">
                  {insight.type === "weekly_report" ? "Weekly Report" : insight.type === "correlation" ? "Correlation" : "Tip"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(insight.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </span>
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {insight.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
