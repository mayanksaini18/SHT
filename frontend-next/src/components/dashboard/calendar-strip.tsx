"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CalendarStrip() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const today = new Date();

  const days = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      key: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
    };
  });

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {days.map((day, idx) => (
        <Button
          key={day.key}
          variant={idx === selectedIndex ? "default" : "outline"}
          className="flex flex-col h-14 min-w-[52px] rounded-xl"
          onClick={() => setSelectedIndex(idx)}
        >
          <span className="text-xs">{day.weekday}</span>
          <span className="font-bold">{day.date}</span>
        </Button>
      ))}
    </div>
  );
}
