import React, { useContext, useState } from "react";
import api from "../../api/api";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "sonner";

// shadcn UI
import { Card } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function CreateHabit() {
  const { user } = useContext(AuthContext);

  const [newHabits, setNewHabits] = useState([]);

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");

  // ui state
  const [loading, setLoading] = useState(false);

  async function startNewHabit(title, description, frequency = "daily") {
    if (!user) throw new Error("User not logged in");
    const payload = { title, description, frequency };
    const res = await api.post("/habits", payload);
    return res.data;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Missing fields", {
        description: "Please enter title and description",
      });
      return;
    }

    setLoading(true);

    try {
      const created = await startNewHabit(
        title.trim(),
        description.trim(),
        frequency
      );

      setNewHabits(prev => [created, ...prev]);

      setTitle("");
      setDescription("");
      setFrequency("daily");

      toast.success("Habit created 🎉", {
        description: `${created.title} added successfully`,
      });

      // browser notification (optional)
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Habit created", {
          body: `${created.title} was added.`,
        });
      } else if (
        "Notification" in window &&
        Notification.permission !== "denied"
      ) {
        Notification.requestPermission();
      }
    } catch (error) {
      toast.error("Failed to create habit", {
        description:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 max-w-md mx-auto">
      {/* HEADER */}
      <header className="mb-6">
      
        <div className="mt-3">
          <Badge variant="secondary">What’s on your mind today?</Badge>
        </div>
      </header>

      {/* FORM CARD */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Create a new habit</h2>
         
        </div>

        <Separator className="mb-4" />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TITLE */}
          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Drink 8 glasses of water"
              disabled={loading}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <Label>Description</Label>
            <Input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short note about your habit"
              disabled={loading}
              required
            />
          </div>

          {/* FREQUENCY */}
          <div>
            <Label>Frequency</Label>
            <Select
              value={frequency}
              onValueChange={setFrequency}
              disabled={loading}
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

          {/* ACTIONS */}
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Creating..." : "Create Habit"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={() => {
                setTitle("");
                setDescription("");
                setFrequency("daily");
              }}
            >
              Reset
            </Button>
          </div>
        </form>

        {/* RECENT HABITS */}
        {newHabits.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-2">Recently added</h4>
            <div className="space-y-2">
              {newHabits.map(h => (
                <div
                  key={h._id}
                  className="flex items-center justify-between bg-slate-100 rounded-lg p-3"
                >
                  <div>
                    <div className="font-medium">{h.title}</div>
                    <div className="text-xs text-slate-500">
                      {h.description}
                    </div>
                  </div>
                  <Badge variant="outline">
                    Streak {h.streak ?? 0}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default CreateHabit;
