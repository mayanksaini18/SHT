import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/api';
import { AuthContext } from '../../contexts/AuthContext';
import HabitCard from '../../components/HabitTitle';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';



import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"



import { Link, useNavigate } from 'react-router-dom';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Dashboard() {
  const { user, setUser, logout } = useContext(AuthContext);
  const [habits, setHabits] = useState([]);
  const [chartData, setChartData] = useState(null);
  
  // index of selected day pill (only for UI highlight)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHabits();
    fetchWeeklyAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchHabits() {
    try {
      console.log("fetching habits")
      const res = await api.get('/habits');
      setHabits(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCheckin(habitId) {
    try {
      const res = await api.post(`/habits/${habitId}/checkin`);
      // update xp/level in context and localStorage
      if (res.data?.user) {
        setUser(prev => ({ ...prev, xp: res.data.user.xp, level: res.data.user.level }));
        localStorage.setItem('user', JSON.stringify({ ...user, xp: res.data.user.xp, level: res.data.user.level }));
      }
      await fetchHabits();
      // show a small toast / alert
     toast({
  title: "Habit completed",
  description: "+10 XP added",
});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    }
  }

  async function fetchWeeklyAnalytics() {
    try {
      // This endpoint should return an array of last 7 days counts e.g. [{day:'Mon', count:2}, ...]
      const res = await api.get('/habits/analytics/weekly');
      const labels = res.data.map(d => d.day);
      const data = res.data.map(d => d.count);
      setChartData({
        labels,
        datasets: [{ label: 'Check-ins', data, fill: true }]
      });
    } catch (err) {
      // fallback dummy
      setChartData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{ label: 'Check-ins', data: [1, 2, 3, 2, 4, 1, 0], fill: false }]
      });
    }
  }
  // ---------- CALENDAR STRIP DATA (NEXT 5 DAYS) ----------
  const today = new Date();
  const dayPills = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    return {
      key: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue...
      date: d.getDate()
    };
  });

  const firstLetter = (user?.name || 'U').charAt(0).toUpperCase();



  return (
    <div className="page">
       <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-slate-500">Good morning,</p>
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <div className="flex gap-2 mt-1">
            <Badge>XP {user?.xp ?? 0}</Badge>
            <Badge variant="outline">Level {user?.level ?? 1}</Badge>
            
          </div>
        </div>

        <Avatar>
          <AvatarFallback className="bg-slate-900 text-white">
            {firstLetter}
          </AvatarFallback>
        </Avatar>
        
      </div>
       {/* DATE STRIP */}
      <div className="flex gap-2 overflow-x-auto mb-5">
        {dayPills.map((day, idx) => (
          <Button
            key={day.key}
            variant={idx === selectedDayIndex ? "default" : "outline"}
            className="flex flex-col h-14 min-w-[52px] rounded-xl"
            onClick={() => setSelectedDayIndex(idx)}
          >
            <span className="text-xs">{day.weekday}</span>
            <span className="font-bold">{day.date}</span>
          </Button>

        ))}
        
      </div>
      
      <main>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
        {habits.map((habit, idx) => (
          <HabitCard
            key={habit._id}
            habit={habit}
            index={idx}
            onCheckin={() => handleCheckin(habit._id)}
          />
        ))}
      </div>
        <Separator />

      </main>
        <section className="chart-card">
          <h3>Weekly activity</h3>
          {chartData ? <Line data={chartData} /> : <p>Loading...</p>}
        </section>
        <Separator />

<br />
        
       {/* ACTIONS */}
      <div className="flex justify-between">
        <Button onClick={() => navigate("/CreateHabit")}>+ Add Habit</Button>
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
