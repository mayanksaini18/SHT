"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLogSleep } from "@/hooks/use-sleep";
import { toast } from "sonner";

const QUALITY_LABELS = ["", "Terrible", "Poor", "Fair", "Good", "Excellent"];

export function SleepLogger() {
  const [duration, setDuration] = useState("");
  const [quality, setQuality] = useState(0);
  const [bedtime, setBedtime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [notes, setNotes] = useState("");
  const logSleep = useLogSleep();

  function timeToISO(timeStr: string, baseDate: Date): string {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const d = new Date(baseDate);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!duration || !quality) { toast.error("Duration and quality are required"); return; }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // bedtime before noon assumed to be same day, afternoon/evening assumed previous day
    let bedtimeISO: string | undefined;
    if (bedtime) {
      const [h] = bedtime.split(":").map(Number);
      bedtimeISO = timeToISO(bedtime, h < 12 ? today : yesterday);
    }

    try {
      await logSleep.mutateAsync({
        duration: parseFloat(duration),
        quality,
        bedtime: bedtimeISO,
        wakeTime: wakeTime ? timeToISO(wakeTime, today) : undefined,
        notes: notes || undefined,
      });
      toast.success("Sleep logged!");
      setDuration(""); setQuality(0); setBedtime(""); setWakeTime(""); setNotes("");
    } catch {
      toast.error("Failed to log sleep");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">Bedtime</Label>
          <Input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Wake time</Label>
          <Input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Hours slept</Label>
        <Input
          type="number" step="0.5" min="0" max="24"
          placeholder="e.g. 7.5"
          value={duration} onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Quality</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((q) => (
            <button
              key={q} type="button" onClick={() => setQuality(q)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                quality === q
                  ? "bg-foreground text-background"
                  : "border hover:bg-muted"
              }`}
            >
              {QUALITY_LABELS[q]}
            </button>
          ))}
        </div>
      </div>

      <Textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="resize-none" />

      <Button type="submit" disabled={logSleep.isPending} className="w-full h-10">
        {logSleep.isPending ? "Logging..." : "Log sleep"}
      </Button>
    </form>
  );
}
