"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMoods, useDeleteMood } from "@/hooks/use-mood";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const EMOJI_MAP: Record<number, string> = {
  1: "😢", 2: "😞", 3: "😐", 4: "😊", 5: "😄",
};

export function MoodHistory() {
  const { data: moods, isLoading } = useMoods();
  const deleteMood = useDeleteMood();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!moods?.length) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No entries yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm mb-3">Recent entries</h3>
      {moods.map((mood) => (
        <div
          key={mood._id}
          className="flex items-center justify-between py-3 border-b last:border-0"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{EMOJI_MAP[mood.score]}</span>
            <div>
              <p className="text-sm font-medium">
                {new Date(mood.date).toLocaleDateString("en-US", {
                  weekday: "short", month: "short", day: "numeric",
                })}
              </p>
              {mood.tags.length > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {mood.tags.join(", ")}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={async () => {
              try {
                await deleteMood.mutateAsync(mood._id);
                toast.success("Deleted");
              } catch {
                toast.error("Failed");
              }
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
