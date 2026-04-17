"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLogSleep } from "@/hooks/use-sleep";
import { toast } from "sonner";

const QUALITY_LABELS = ["", "Terrible", "Poor", "Fair", "Good", "Excellent"];

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = [0, 15, 30, 45];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatTime(hour: number, minute: number, period: "AM" | "PM") {
  return `${hour}:${pad(minute)} ${period}`;
}

function to24(hour: number, period: "AM" | "PM") {
  if (period === "AM" && hour === 12) return 0;
  if (period === "PM" && hour !== 12) return hour + 12;
  return hour;
}

function calcDuration(
  bedH: number, bedM: number, bedP: "AM" | "PM",
  wakeH: number, wakeM: number, wakeP: "AM" | "PM"
) {
  const bedMins = to24(bedH, bedP) * 60 + bedM;
  const wakeMins = to24(wakeH, wakeP) * 60 + wakeM;
  let diff = wakeMins - bedMins;
  if (diff <= 0) diff += 24 * 60;
  return diff / 60;
}

function TimeSelector({
  label,
  hour,
  minute,
  period,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
}: {
  label: string;
  hour: number;
  minute: number;
  period: "AM" | "PM";
  onHourChange: (h: number) => void;
  onMinuteChange: (m: number) => void;
  onPeriodChange: (p: "AM" | "PM") => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-1.5">
        {/* Hour */}
        <select
          value={hour}
          onChange={(e) => onHourChange(Number(e.target.value))}
          className="h-10 rounded-lg border border-input bg-transparent px-2 text-sm font-medium tabular-nums focus:border-ring focus:ring-3 focus:ring-ring/50 outline-none appearance-none cursor-pointer"
        >
          {HOURS.map((h) => (
            <option key={h} value={h}>{pad(h)}</option>
          ))}
        </select>

        <span className="text-muted-foreground font-medium">:</span>

        {/* Minute */}
        <select
          value={minute}
          onChange={(e) => onMinuteChange(Number(e.target.value))}
          className="h-10 rounded-lg border border-input bg-transparent px-2 text-sm font-medium tabular-nums focus:border-ring focus:ring-3 focus:ring-ring/50 outline-none appearance-none cursor-pointer"
        >
          {MINUTES.map((m) => (
            <option key={m} value={m}>{pad(m)}</option>
          ))}
        </select>

        {/* AM/PM */}
        <div className="flex rounded-lg border border-input overflow-hidden">
          {(["AM", "PM"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPeriodChange(p)}
              className={`px-3 h-10 text-xs font-medium transition-colors ${
                period === p
                  ? "bg-foreground text-background"
                  : "hover:bg-muted"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SleepLogger() {
  const [bedHour, setBedHour] = useState(10);
  const [bedMinute, setBedMinute] = useState(30);
  const [bedPeriod, setBedPeriod] = useState<"AM" | "PM">("PM");

  const [wakeHour, setWakeHour] = useState(6);
  const [wakeMinute, setWakeMinute] = useState(30);
  const [wakePeriod, setWakePeriod] = useState<"AM" | "PM">("AM");

  const [quality, setQuality] = useState(0);
  const [notes, setNotes] = useState("");
  const logSleep = useLogSleep();

  const duration = calcDuration(bedHour, bedMinute, bedPeriod, wakeHour, wakeMinute, wakePeriod);
  const durationDisplay = `${Math.floor(duration)}h ${Math.round((duration % 1) * 60)}m`;

  const buildISO = useCallback((hour: number, minute: number, period: "AM" | "PM", dateOffset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + dateOffset);
    d.setHours(to24(hour, period), minute, 0, 0);
    return d.toISOString();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!quality) {
      toast.error("Please select a sleep quality");
      return;
    }

    const bed24 = to24(bedHour, bedPeriod);
    const bedtimeISO = buildISO(bedHour, bedMinute, bedPeriod, bed24 >= 12 ? -1 : 0);
    const wakeTimeISO = buildISO(wakeHour, wakeMinute, wakePeriod, 0);

    try {
      await logSleep.mutateAsync({
        duration: Math.round(duration * 2) / 2,
        quality,
        bedtime: bedtimeISO,
        wakeTime: wakeTimeISO,
        notes: notes || undefined,
      });
      toast.success("Sleep logged!");
      setQuality(0);
      setNotes("");
    } catch {
      toast.error("Failed to log sleep");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <TimeSelector
        label="Bedtime"
        hour={bedHour}
        minute={bedMinute}
        period={bedPeriod}
        onHourChange={setBedHour}
        onMinuteChange={setBedMinute}
        onPeriodChange={setBedPeriod}
      />

      <TimeSelector
        label="Wake time"
        hour={wakeHour}
        minute={wakeMinute}
        period={wakePeriod}
        onHourChange={setWakeHour}
        onMinuteChange={setWakeMinute}
        onPeriodChange={setWakePeriod}
      />

      {/* Auto-calculated duration */}
      <div className="rounded-xl border bg-muted/30 p-4 text-center">
        <p className="text-xs text-muted-foreground mb-1">Total sleep</p>
        <p className="text-2xl font-semibold tabular-nums">{durationDisplay}</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Quality</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuality(q)}
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

      <Textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className="resize-none"
      />

      <Button type="submit" disabled={logSleep.isPending} className="w-full h-10">
        {logSleep.isPending ? "Logging..." : "Log sleep"}
      </Button>
    </form>
  );
}
