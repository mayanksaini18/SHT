"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLogMood } from "@/hooks/use-mood";
import { toast } from "sonner";

const MOOD_EMOJIS = [
  { score: 1, emoji: "😢", label: "Awful" },
  { score: 2, emoji: "😞", label: "Bad" },
  { score: 3, emoji: "😐", label: "Okay" },
  { score: 4, emoji: "😊", label: "Good" },
  { score: 5, emoji: "😄", label: "Great" },
];

const COMMON_TAGS = [
  "stressed", "energetic", "tired", "anxious", "calm",
  "happy", "focused", "motivated", "lonely", "grateful",
];

export function MoodLogger() {
  const [score, setScore] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const logMood = useLogMood();

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSubmit() {
    if (!score) { toast.error("Pick a mood"); return; }
    try {
      await logMood.mutateAsync({
        score,
        notes: notes || undefined,
        tags: tags.length ? tags : undefined,
      });
      toast.success("Mood logged!");
      setScore(0);
      setNotes("");
      setTags([]);
    } catch {
      toast.error("Failed to log mood");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-medium mb-4">How are you feeling?</h2>
        <div className="flex gap-3">
          {MOOD_EMOJIS.map((m) => (
            <button
              key={m.score}
              onClick={() => setScore(m.score)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${
                score === m.score
                  ? "bg-foreground/5 ring-1 ring-foreground/20 scale-105"
                  : "hover:bg-muted"
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[11px] text-muted-foreground">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-medium mb-3 text-sm">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {COMMON_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                tags.includes(tag)
                  ? "bg-foreground text-background"
                  : "border hover:bg-muted"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <Textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        className="resize-none"
      />

      <Button
        onClick={handleSubmit}
        disabled={!score || logMood.isPending}
        className="w-full h-10"
      >
        {logMood.isPending ? "Logging..." : "Log mood"}
      </Button>
    </div>
  );
}
