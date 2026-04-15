"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateGoals, useUpdateReminders, subscribeToPush, unsubscribeFromPush, getPushSubscription } from "@/hooks/use-settings";
import { toast } from "sonner";
import { Bell, BellOff } from "lucide-react";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const updateGoalsMutation = useUpdateGoals();
  const updateRemindersMutation = useUpdateReminders();

  const goals = user?.goals ?? { sleep: 7, exercise: 4, mood: 3, water: 8 };
  const reminders = user?.reminderTimes ?? { mood: "", sleep: "", water: "", exercise: "" };

  const [sleepGoal, setSleepGoal]       = useState(String(goals.sleep));
  const [exerciseGoal, setExerciseGoal] = useState(String(goals.exercise));
  const [moodGoal, setMoodGoal]         = useState(String(goals.mood));
  const [waterGoal, setWaterGoal]       = useState(String(goals.water));

  const [moodTime, setMoodTime]         = useState(reminders.mood);
  const [sleepTime, setSleepTime]       = useState(reminders.sleep);
  const [waterTime, setWaterTime]       = useState(reminders.water);
  const [exerciseTime, setExerciseTime] = useState(reminders.exercise);

  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [pushLoading, setPushLoading]     = useState(false);

  useEffect(() => {
    setSleepGoal(String(user?.goals?.sleep ?? 7));
    setExerciseGoal(String(user?.goals?.exercise ?? 4));
    setMoodGoal(String(user?.goals?.mood ?? 3));
    setWaterGoal(String(user?.goals?.water ?? 8));
    setMoodTime(user?.reminderTimes?.mood ?? "");
    setSleepTime(user?.reminderTimes?.sleep ?? "");
    setWaterTime(user?.reminderTimes?.water ?? "");
    setExerciseTime(user?.reminderTimes?.exercise ?? "");
  }, [user]);

  useEffect(() => {
    getPushSubscription().then((sub) => setIsPushEnabled(!!sub));
  }, []);

  async function saveGoals() {
    try {
      await updateGoalsMutation.mutateAsync({
        sleep: parseFloat(sleepGoal),
        exercise: parseInt(exerciseGoal),
        mood: parseFloat(moodGoal),
        water: parseInt(waterGoal),
      });
      toast.success("Goals saved");
    } catch {
      toast.error("Failed to save goals");
    }
  }

  async function saveReminders() {
    try {
      await updateRemindersMutation.mutateAsync({
        mood: moodTime,
        sleep: sleepTime,
        water: waterTime,
        exercise: exerciseTime,
      });
      toast.success("Reminders saved");
    } catch {
      toast.error("Failed to save reminders");
    }
  }

  async function togglePush() {
    setPushLoading(true);
    try {
      if (isPushEnabled) {
        await unsubscribeFromPush();
        setIsPushEnabled(false);
        toast.success("Push notifications disabled");
      } else {
        const sub = await subscribeToPush();
        if (sub) {
          setIsPushEnabled(true);
          toast.success("Push notifications enabled");
        } else {
          toast.error("Notification permission denied");
        }
      }
    } catch {
      toast.error("Failed to update push notifications");
    } finally {
      setPushLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Profile</h2>
        <div className="border rounded-xl divide-y">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm">Name</span>
            <span className="text-sm text-muted-foreground">{user?.name || "—"}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm">Email</span>
            <span className="text-sm text-muted-foreground">{user?.email || "—"}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm">Level</span>
            <span className="text-sm text-muted-foreground">{user?.level ?? 1}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm">XP</span>
            <span className="text-sm text-muted-foreground">{user?.xp ?? 0}</span>
          </div>
        </div>
      </section>

      {/* Goals */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Daily Goals</h2>
          <p className="text-xs text-muted-foreground mt-1">Shown as progress bars on your dashboard.</p>
        </div>
        <div className="border rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Sleep (hours/night)</Label>
              <Input type="number" min="1" max="24" step="0.5" value={sleepGoal}
                onChange={(e) => setSleepGoal(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Exercise (days/week)</Label>
              <Input type="number" min="0" max="7" value={exerciseGoal}
                onChange={(e) => setExerciseGoal(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Mood target (1–5)</Label>
              <Input type="number" min="1" max="5" step="0.5" value={moodGoal}
                onChange={(e) => setMoodGoal(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Water (glasses/day)</Label>
              <Input type="number" min="1" max="50" value={waterGoal}
                onChange={(e) => setWaterGoal(e.target.value)} />
            </div>
          </div>
          <Button
            onClick={saveGoals}
            disabled={updateGoalsMutation.isPending}
            size="sm" className="w-full"
          >
            {updateGoalsMutation.isPending ? "Saving…" : "Save goals"}
          </Button>
        </div>
      </section>

      {/* Reminders */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Reminders</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Set a daily time for each reminder. Enable push notifications below to receive them.
          </p>
        </div>
        <div className="border rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Mood reminder</Label>
              <Input type="time" value={moodTime} onChange={(e) => setMoodTime(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Sleep reminder</Label>
              <Input type="time" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Water reminder</Label>
              <Input type="time" value={waterTime} onChange={(e) => setWaterTime(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Exercise reminder</Label>
              <Input type="time" value={exerciseTime} onChange={(e) => setExerciseTime(e.target.value)} />
            </div>
          </div>
          <Button
            onClick={saveReminders}
            disabled={updateRemindersMutation.isPending}
            size="sm" className="w-full"
          >
            {updateRemindersMutation.isPending ? "Saving…" : "Save reminders"}
          </Button>
        </div>
      </section>

      {/* Push Notifications */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Push Notifications</h2>
        <div className="border rounded-xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Browser notifications</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isPushEnabled ? "Enabled on this device" : "Get notified at your reminder times"}
            </p>
          </div>
          <Button
            variant="outline" size="sm"
            onClick={togglePush}
            disabled={pushLoading}
            className="gap-1.5"
          >
            {isPushEnabled
              ? <><BellOff className="h-3.5 w-3.5" /> Disable</>
              : <><Bell className="h-3.5 w-3.5" /> Enable</>}
          </Button>
        </div>
      </section>

      {/* Appearance */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Appearance</h2>
        <div className="border rounded-xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-xs text-muted-foreground mt-0.5">Toggle light and dark mode</p>
          </div>
          <ThemeToggle />
        </div>
      </section>

      <p className="text-xs text-muted-foreground">LifeOS v1.1</p>
    </div>
  );
}
