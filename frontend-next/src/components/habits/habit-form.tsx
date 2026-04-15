"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateHabit } from "@/hooks/use-habits";
import { toast } from "sonner";
import { ArrowLeft01Icon } from "hugeicons-react";
import Link from "next/link";

export function HabitForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const createHabit = useCreateHabit();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    try {
      await createHabit.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        frequency,
      });
      toast.success("Habit created!");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create habit");
    }
  }

  return (
    <div className="max-w-sm mx-auto space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft01Icon className="h-3.5 w-3.5" />
          Back
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">New habit</h1>
        <p className="text-sm text-muted-foreground mt-1">
          What do you want to build?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Read for 30 minutes"
            disabled={createHabit.isPending}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional note"
            disabled={createHabit.isPending}
          />
        </div>
        <div className="space-y-2">
          <Label>Frequency</Label>
          <Select
            value={frequency}
            onValueChange={(val) => { if (val) setFrequency(val); }}
            disabled={createHabit.isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full h-10"
          disabled={createHabit.isPending}
        >
          {createHabit.isPending ? "Creating..." : "Create habit"}
        </Button>
      </form>
    </div>
  );
}
