"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useJournalEntries, useJournalByDate, useSaveJournal, useDeleteJournal, useAnalyzeJournal } from "@/hooks/use-journal";
import { toast } from "sonner";
import { Delete02Icon, PencilEdit01Icon, SparklesIcon } from "hugeicons-react";
import { cn } from "@/lib/utils";

const TODAY = new Date().toISOString().slice(0, 10);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });
}

export default function JournalPage() {
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [isDirty, setIsDirty] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: entries, isLoading: listLoading } = useJournalEntries(60);
  const { data: existing } = useJournalByDate(selectedDate);
  const saveJournal = useSaveJournal();
  const deleteJournal = useDeleteJournal();
  const analyzeJournal = useAnalyzeJournal();

  // Load existing entry when date changes
  useEffect(() => {
    setContent(existing?.content ?? "");
    setIsDirty(false);
  }, [existing, selectedDate]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  async function handleSave() {
    if (!content.trim()) { toast.error("Write something first"); return; }
    try {
      await saveJournal.mutateAsync({ content, date: selectedDate });
      setIsDirty(false);
      toast.success("Saved");
    } catch { toast.error("Failed to save"); }
  }

  async function handleAnalyze() {
    if (!existing) { toast.error("Save the entry first"); return; }
    if (isDirty) { toast.error("Save your changes first"); return; }
    try {
      await analyzeJournal.mutateAsync(existing._id);
    } catch { toast.error("Analysis failed"); }
  }

  async function handleDelete(id: string) {
    try {
      await deleteJournal.mutateAsync(id);
      if (selectedDate !== TODAY) setSelectedDate(TODAY);
      toast.success("Entry deleted");
    } catch { toast.error("Failed to delete"); }
  }

  const isToday = selectedDate === TODAY;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Journal</h1>
        <p className="text-muted-foreground mt-1">Your private daily notes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 items-start">

        {/* Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PencilEdit01Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {isToday ? "Today" : formatDate(selectedDate)}
              </span>
            </div>
            {isDirty && (
              <span className="text-xs text-muted-foreground">Unsaved changes</span>
            )}
          </div>

          <div className="border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-ring/50 transition-all">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => { setContent(e.target.value); setIsDirty(true); }}
              placeholder={isToday
                ? "How's your day going? What's on your mind?"
                : "No entry for this day."}
              className="w-full min-h-[280px] px-5 py-4 bg-background text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/50"
              maxLength={5000}
            />
            <div className="flex items-center justify-between px-5 py-3 border-t bg-muted/30">
              <span className="text-xs text-muted-foreground">{content.length}/5000</span>
              <div className="flex items-center gap-2">
                {existing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive h-7 px-2"
                    onClick={() => handleDelete(existing._id)}
                    disabled={deleteJournal.isPending}
                  >
                    <Delete02Icon className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Button>
                )}
                <Button
                  size="sm"
                  className="h-7"
                  onClick={handleSave}
                  disabled={saveJournal.isPending || !isDirty}
                >
                  {saveJournal.isPending ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          </div>

          {existing && (
            <JournalInsights
              summary={existing.aiSummary}
              sentiment={existing.aiSentiment}
              themes={existing.aiThemes}
              isAnalyzing={analyzeJournal.isPending}
              isDirty={isDirty}
              onAnalyze={handleAnalyze}
            />
          )}
        </div>

        {/* History sidebar */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">History</p>
          {listLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : !entries?.length ? (
            <p className="text-sm text-muted-foreground px-1">No entries yet.</p>
          ) : (
            <div className="space-y-1">
              {/* Always show today as first option */}
              {!entries.find((e) => e.date.slice(0, 10) === TODAY) && (
                <button
                  onClick={() => setSelectedDate(TODAY)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors border ${
                    selectedDate === TODAY
                      ? "bg-foreground text-background border-transparent"
                      : "hover:bg-muted/50 border-transparent"
                  }`}
                >
                  <p className="font-medium">Today</p>
                  <p className="text-xs opacity-60 mt-0.5">No entry yet</p>
                </button>
              )}
              {entries.map((entry) => {
                const dateKey = entry.date.slice(0, 10);
                const isSelected = selectedDate === dateKey;
                return (
                  <button
                    key={entry._id}
                    onClick={() => setSelectedDate(dateKey)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors border ${
                      isSelected
                        ? "bg-foreground text-background border-transparent"
                        : "hover:bg-muted/50 border-transparent"
                    }`}
                  >
                    <p className="font-medium">
                      {dateKey === TODAY ? "Today" : formatDateShort(entry.date)}
                    </p>
                    <p className={`text-xs mt-0.5 line-clamp-1 ${isSelected ? "opacity-70" : "text-muted-foreground"}`}>
                      {entry.content}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const SENTIMENT_STYLE: Record<string, string> = {
  positive: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  neutral:  "bg-muted text-muted-foreground border-border",
  negative: "bg-red-500/10 text-red-500 border-red-500/20",
  mixed:    "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

function JournalInsights({
  summary, sentiment, themes, isAnalyzing, isDirty, onAnalyze,
}: {
  summary?: string;
  sentiment?: "positive" | "neutral" | "negative" | "mixed";
  themes?: string[];
  isAnalyzing: boolean;
  isDirty: boolean;
  onAnalyze: () => void;
}) {
  const hasAnalysis = !!summary;

  return (
    <div className="border rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">AI reflection</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={onAnalyze}
          disabled={isAnalyzing || isDirty}
        >
          {isAnalyzing ? "Analyzing…" : hasAnalysis ? "Re-analyze" : "Analyze"}
        </Button>
      </div>

      {isDirty && !isAnalyzing && (
        <p className="text-xs text-muted-foreground">Save your changes first to analyze.</p>
      )}

      {hasAnalysis ? (
        <>
          <p className="text-sm leading-relaxed">{summary}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {sentiment && (
              <span className={cn(
                "text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full border",
                SENTIMENT_STYLE[sentiment],
              )}>
                {sentiment}
              </span>
            )}
            {themes?.map((t) => (
              <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">
          Get a one-line reflection, sentiment, and themes from today&apos;s entry.
        </p>
      )}
    </div>
  );
}
