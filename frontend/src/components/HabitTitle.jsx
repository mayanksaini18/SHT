import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const COLORS = [
  "bg-yellow-300",
  "bg-green-300",
  "bg-orange-300",
  "bg-blue-300",
  "bg-purple-300",
  "bg-pink-300",
];

export default function HabitTile({ habit, onCheckin, index }) {

     // check if already checked in today
  const hasCheckedToday = (habit.checkins || []).some(c => {
    try {
      const d = new Date(c.date);
      const t = new Date();
      return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
    } catch { return false; }
  });
  
  return (
    <Card
      onClick={onCheckin}
      className={`
        ${COLORS[index % COLORS.length]}
        border-none rounded-2xl p-4 h-32 cursor-pointer
        flex flex-col justify-between
        active:scale-95 transition
      `}
    >
      <div className="text-lg font-semibold">
        {habit.title}
      </div>

      <div className="flex items-center justify-between">
        <p className="  text-slate-600">
          {habit.description || "Daily habit"}
        </p>
        <Badge variant="secondary">
          {hasCheckedToday ? "Checked" : "CheckIn"}
        </Badge>
      </div>
    </Card>
  );
}
