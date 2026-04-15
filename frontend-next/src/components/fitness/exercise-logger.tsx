"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useLogExercise } from "@/hooks/use-fitness";
import { toast } from "sonner";

interface ExerciseEntry {
  name: string;
  type: string;
  duration: string;
}

const EXERCISE_TYPES = ["cardio", "strength", "flexibility", "sports", "other"];

export function ExerciseLogger() {
  const [exercises, setExercises] = useState<ExerciseEntry[]>([
    { name: "", type: "cardio", duration: "" },
  ]);
  const logExercise = useLogExercise();

  function addExercise() {
    setExercises((prev) => [...prev, { name: "", type: "cardio", duration: "" }]);
  }

  function removeExercise(index: number) {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  }

  function updateExercise(index: number, field: keyof ExerciseEntry, value: string) {
    setExercises((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valid = exercises.filter((ex) => ex.name && ex.duration);
    if (!valid.length) { toast.error("Add at least one exercise"); return; }
    try {
      await logExercise.mutateAsync({
        exercises: valid.map((ex) => ({ name: ex.name, type: ex.type, duration: parseInt(ex.duration) })),
      });
      toast.success("Workout logged!");
      setExercises([{ name: "", type: "cardio", duration: "" }]);
    } catch { toast.error("Failed to log workout"); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {exercises.map((ex, i) => (
        <div key={i} className="border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Exercise {i + 1}
            </span>
            {exercises.length > 1 && (
              <button
                type="button"
                onClick={() => removeExercise(i)}
                className="h-5 w-5 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Name</Label>
              <Input placeholder="Running" value={ex.name} onChange={(e) => updateExercise(i, "name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Type</Label>
              <select
                value={ex.type}
                onChange={(e) => updateExercise(i, "type", e.target.value)}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
              >
                {EXERCISE_TYPES.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Minutes</Label>
              <Input type="number" min="0" placeholder="30" value={ex.duration} onChange={(e) => updateExercise(i, "duration", e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <button type="button" onClick={addExercise} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <Plus className="h-3.5 w-3.5" /> Add another
      </button>

      <Button type="submit" disabled={logExercise.isPending} className="w-full h-10">
        {logExercise.isPending ? "Logging..." : "Log workout"}
      </Button>
    </form>
  );
}
