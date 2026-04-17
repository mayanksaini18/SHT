"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusSignIcon, Cancel01Icon } from "hugeicons-react";
import { useLogExercise } from "@/hooks/use-fitness";
import { toast } from "sonner";

interface ExerciseEntry {
  name: string;
  type: string;
  duration: string;
  sets: string;
  reps: string;
}

const EXERCISE_TYPES = [
  { value: "cardio", label: "Cardio", icon: "🏃" },
  { value: "strength", label: "Strength", icon: "🏋️" },
  { value: "flexibility", label: "Flexibility", icon: "🧘" },
  { value: "sports", label: "Sports", icon: "⚽" },
  { value: "other", label: "Other", icon: "💪" },
];

const QUICK_ADD = [
  { name: "Running", type: "cardio", duration: "30" },
  { name: "Push-ups", type: "strength", duration: "10" },
  { name: "Yoga", type: "flexibility", duration: "30" },
  { name: "Cycling", type: "cardio", duration: "45" },
  { name: "Squats", type: "strength", duration: "15" },
  { name: "Walking", type: "cardio", duration: "20" },
];

const EMPTY_EXERCISE: ExerciseEntry = { name: "", type: "cardio", duration: "", sets: "", reps: "" };

export function ExerciseLogger() {
  const [exercises, setExercises] = useState<ExerciseEntry[]>([{ ...EMPTY_EXERCISE }]);
  const logExercise = useLogExercise();

  function addExercise() {
    setExercises((prev) => [...prev, { ...EMPTY_EXERCISE }]);
  }

  function removeExercise(index: number) {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  }

  function updateExercise(index: number, field: keyof ExerciseEntry, value: string) {
    setExercises((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
  }

  function quickAdd(preset: (typeof QUICK_ADD)[number]) {
    setExercises((prev) => {
      const empty = prev.findIndex((e) => !e.name);
      if (empty >= 0) {
        return prev.map((e, i) =>
          i === empty ? { ...e, name: preset.name, type: preset.type, duration: preset.duration } : e
        );
      }
      return [...prev, { name: preset.name, type: preset.type, duration: preset.duration, sets: "", reps: "" }];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valid = exercises.filter((ex) => ex.name && ex.duration);
    if (!valid.length) {
      toast.error("Add at least one exercise with name and duration");
      return;
    }
    try {
      await logExercise.mutateAsync({
        exercises: valid.map((ex) => ({
          name: ex.name,
          type: ex.type,
          duration: parseInt(ex.duration),
          ...(ex.sets ? { sets: parseInt(ex.sets) } : {}),
          ...(ex.reps ? { reps: parseInt(ex.reps) } : {}),
        })),
      });
      toast.success("Workout logged!");
      setExercises([{ ...EMPTY_EXERCISE }]);
    } catch {
      toast.error("Failed to log workout");
    }
  }

  const totalDuration = exercises.reduce((s, e) => s + (parseInt(e.duration) || 0), 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quick add */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Quick add</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_ADD.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => quickAdd(preset)}
              className="px-3 py-1.5 rounded-full text-xs border hover:bg-muted transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise entries */}
      <div className="space-y-3">
        {exercises.map((ex, i) => {
          const typeInfo = EXERCISE_TYPES.find((t) => t.value === ex.type);
          return (
            <div key={i} className="border rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{typeInfo?.icon ?? "💪"}</span>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Exercise {i + 1}
                  </span>
                </div>
                {exercises.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExercise(i)}
                    className="h-6 w-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Cancel01Icon className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Name and type row */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Exercise name"
                  value={ex.name}
                  onChange={(e) => updateExercise(i, "name", e.target.value)}
                />
                <div className="flex gap-1.5">
                  {EXERCISE_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => updateExercise(i, "type", t.value)}
                      title={t.label}
                      className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-sm transition-all ${
                        ex.type === t.value
                          ? "bg-foreground/5 ring-1 ring-foreground/20"
                          : "hover:bg-muted"
                      }`}
                    >
                      {t.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration, sets, reps row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    placeholder="30"
                    value={ex.duration}
                    onChange={(e) => updateExercise(i, "duration", e.target.value)}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">min</span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    placeholder="—"
                    value={ex.sets}
                    onChange={(e) => updateExercise(i, "sets", e.target.value)}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">sets</span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    placeholder="—"
                    value={ex.reps}
                    onChange={(e) => updateExercise(i, "reps", e.target.value)}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">reps</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addExercise}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <PlusSignIcon className="h-3.5 w-3.5" /> Add another exercise
      </button>

      {/* Summary + submit */}
      <div className="border rounded-xl p-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{exercises.filter((e) => e.name).length}</span> exercise{exercises.filter((e) => e.name).length !== 1 ? "s" : ""}
          {totalDuration > 0 && (
            <> · <span className="font-medium text-foreground">{totalDuration}</span> min total</>
          )}
        </div>
        <Button type="submit" disabled={logExercise.isPending} className="h-9 px-6">
          {logExercise.isPending ? "Logging..." : "Log workout"}
        </Button>
      </div>
    </form>
  );
}
