"use client";

import type { Habit } from "@/types/habit";

interface Props {
  habit: Habit;
}

const WEEKS = 16;
const DAYS_TO_SHOW = WEEKS * 7;

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function HabitHeatmap({ habit }: Props) {
  const checkinSet = new Set(
    (habit.checkins ?? []).map((c) => new Date(c.date).toISOString().slice(0, 10))
  );

  // Build grid: from (today - DAYS_TO_SHOW + 1) to today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: { dateKey: string; checked: boolean; isToday: boolean }[] = [];
  for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = getDateKey(d);
    days.push({ dateKey, checked: checkinSet.has(dateKey), isToday: i === 0 });
  }

  // Pad front so grid starts on Sunday
  const firstDay = new Date(today);
  firstDay.setDate(today.getDate() - (DAYS_TO_SHOW - 1));
  const padCount = firstDay.getDay(); // 0=Sun
  const paddedDays = [
    ...Array(padCount).fill(null),
    ...days,
  ];

  const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  for (let col = 0; col < WEEKS; col++) {
    const dayIdx = col * 7 - padCount;
    if (dayIdx < 0 || dayIdx >= days.length) continue;
    const d = new Date(today);
    d.setDate(today.getDate() - (DAYS_TO_SHOW - 1 - dayIdx));
    if (d.getMonth() !== lastMonth) {
      monthLabels.push({
        label: d.toLocaleDateString("en-US", { month: "short" }),
        col,
      });
      lastMonth = d.getMonth();
    }
  }

  return (
    <div className="space-y-2">
      {/* Month labels */}
      <div
        className="grid text-[10px] text-muted-foreground"
        style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: WEEKS }).map((_, col) => {
          const label = monthLabels.find((m) => m.col === col);
          return <span key={col}>{label?.label ?? ""}</span>;
        })}
      </div>

      {/* Heatmap grid: 7 rows × WEEKS cols */}
      <div className="flex gap-1">
        {/* Day-of-week labels */}
        <div className="flex flex-col gap-1 mr-1">
          {weekLabels.map((d, i) => (
            <span
              key={d}
              className="text-[9px] text-muted-foreground leading-none"
              style={{ height: 12, lineHeight: "12px", visibility: i % 2 === 0 ? "hidden" : "visible" }}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Columns (weeks) */}
        <div
          className="grid gap-1 flex-1"
          style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: WEEKS }).map((_, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, dayIdx) => {
                const cell = paddedDays[weekIdx * 7 + dayIdx];
                if (!cell) {
                  return <div key={dayIdx} className="aspect-square rounded-sm" />;
                }
                return (
                  <div
                    key={dayIdx}
                    title={cell.dateKey}
                    className={`aspect-square rounded-sm transition-colors ${
                      cell.checked
                        ? "bg-emerald-500"
                        : cell.isToday
                        ? "bg-muted-foreground/20 ring-1 ring-muted-foreground/40"
                        : "bg-muted"
                    }`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 justify-end">
        <span className="text-[10px] text-muted-foreground">Less</span>
        <div className="w-2.5 h-2.5 rounded-sm bg-muted" />
        <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40" />
        <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
        <span className="text-[10px] text-muted-foreground">More</span>
      </div>
    </div>
  );
}
