"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MagicWand01Icon, Refresh01Icon, ChartIncreaseIcon, ChartDecreaseIcon, ArrowRight01Icon } from "hugeicons-react";
import { useInsights, useWeeklyReport, useCorrelations } from "@/hooks/use-insights";
import type { Correlation } from "@/types/insight";

const STRENGTH_STYLE: Record<string, string> = {
  strong:   "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  moderate: "bg-amber-500/15 text-amber-500 border-amber-500/20",
  weak:     "bg-muted text-muted-foreground border-border",
};

function CorrelationCard({ c }: { c: Correlation }) {
  return (
    <div className="border rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {c.direction === "positive"
            ? <ChartIncreaseIcon className="h-4 w-4 text-emerald-500 shrink-0" />
            : <ChartDecreaseIcon className="h-4 w-4 text-rose-500 shrink-0" />}
          <p className="font-medium text-sm">{c.title}</p>
        </div>
        <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${STRENGTH_STYLE[c.strength]}`}>
          {c.strength}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
      {c.r != null && (
        <p className="text-[10px] text-muted-foreground/60">Correlation coefficient: r = {c.r}</p>
      )}
    </div>
  );
}

export default function InsightsPage() {
  const { data: insights, isLoading: insightsLoading } = useInsights();
  const { data: correlationData, isLoading: corrLoading } = useCorrelations();
  const weeklyReport = useWeeklyReport();

  return (
    <div className="max-w-3xl mx-auto space-y-12">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
          <p className="text-muted-foreground mt-1">Patterns and AI-powered wellness reports.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => weeklyReport.mutateAsync()}
          disabled={weeklyReport.isPending}
        >
          {weeklyReport.isPending
            ? <><Refresh01Icon className="h-3.5 w-3.5 mr-2 animate-spin" /> Generating...</>
            : <><MagicWand01Icon className="h-3.5 w-3.5 mr-2" /> Generate report</>}
        </Button>
      </div>

      {/* Correlations */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ArrowRight01Icon className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Your Patterns</h2>
        </div>

        {corrLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : !correlationData?.correlations.length ? (
          <div className="border border-dashed rounded-xl py-10 text-center">
            <p className="text-sm font-medium">Not enough data yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Log mood, sleep, water and fitness for at least a week to see patterns.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {correlationData.correlations.map((c) => (
              <CorrelationCard key={c.id} c={c} />
            ))}
            <p className="text-[10px] text-muted-foreground px-1">
              Based on {correlationData.dataPoints.mood} mood · {correlationData.dataPoints.sleep} sleep · {correlationData.dataPoints.water} water · {correlationData.dataPoints.fitness} fitness entries in the last 30 days.
            </p>
          </div>
        )}
      </section>

      {/* AI Reports */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MagicWand01Icon className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">AI Reports</h2>
        </div>

        {insightsLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
          </div>
        ) : !insights?.length ? (
          <div className="border border-dashed rounded-xl py-16 text-center">
            <img
              src="/personal-data.svg"
              alt="Insights"
              className="h-28 mx-auto mb-5 select-none opacity-70"
              draggable={false}
            />
            <p className="font-medium mb-1">No reports yet</p>
            <p className="text-sm text-muted-foreground mb-5">Generate your first AI wellness report.</p>
            <Button
              variant="outline"
              onClick={() => weeklyReport.mutateAsync()}
              disabled={weeklyReport.isPending}
            >
              <MagicWand01Icon className="h-3.5 w-3.5 mr-2" /> Generate report
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {insights.map((insight) => (
              <div key={insight._id} className="border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">
                    {insight.type === "weekly_report" ? "Weekly Report" : insight.type === "correlation" ? "Correlation" : "Tip"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(insight.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {insight.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
