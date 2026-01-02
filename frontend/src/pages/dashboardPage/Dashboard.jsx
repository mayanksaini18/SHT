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
import { Spinner } from "@/components/ui/spinner"
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Link, useNavigate } from 'react-router-dom';
import { Plus, LogOut, TrendingUp, Calendar } from 'lucide-react';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Dashboard() {
  const { user, setUser, logout } = useContext(AuthContext);
  const [habits, setHabits] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHabits();
    fetchWeeklyAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchHabits() {
    try {
      const res = await api.get('/habits');
      setHabits(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCheckin(habitId) {
    try {
      const res = await api.post(`/habits/${habitId}/checkin`);
      if (res.data?.user) {
        setUser(prev => ({ ...prev, xp: res.data.user.xp, level: res.data.user.level }));
        localStorage.setItem('user', JSON.stringify({ ...user, xp: res.data.user.xp, level: res.data.user.level }));
      }
      await fetchHabits();
      toast("Habit completed!", { description: "+10 XP added." });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    }
  }

  async function fetchWeeklyAnalytics() {
    try {
      const res = await api.get('/habits/analytics/weekly');
      const labels = res.data.map(d => d.day);
      const data = res.data.map(d => d.count);
      setChartData({
        labels,
        datasets: [{
          label: 'Check-ins',
          data,
          fill: true,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4
        }]
      });
    } catch (err) {
      setChartData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Check-ins',
          data: [1, 2, 3, 2, 4, 1, 5],
          fill: true,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4
        }]
      });
    }
  }

  // ---------- CALENDAR DATA ----------
  const today = new Date();
  const dayPills = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      key: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate()
    };
  });

  function Greeting() {
    const hour = new Date().getHours();
    //gives 0 - 23 
    const greeting = hour < 12
      ? "Good Morning"
      : hour < 18
        ? "Good Afternoon"
        : "Good Evening";
  return (
    <p className="text-sm font-medium text-slate-500">{greeting}</p>
  )
  }
  const firstLetter = (user?.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen">

      {/* TOP NAVIGATION BAR */}
      <div className="top-0 z-30 w-full bg-white/80 backdrop-blur-md px-4 md:px-8 py-3">

        <header className="flex items-center justify-between">
          <div>
           <Greeting/>
            <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="px-2 py-0.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                XP {user?.xp ?? 0}
              </Badge>
              <Badge variant="outline" className="px-2 py-0.5 border-slate-300">
                Lvl {user?.level ?? 1}
              </Badge>
            </div>
          </div>
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-slate-900 text-white font-medium">
              {firstLetter}
            </AvatarFallback>
          </Avatar>
        </header>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT CONTENT COLUMN (Main) */}
          <div className="lg:col-span-8 space-y-8">

            {/* CALENDAR STRIP */}
            <section>
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
            </section>

            {/* HABITS GRID */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Your Habits</h2>
                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" onClick={() => navigate("/CreateHabit")}>
                  <Plus className="w-4 h-4 mr-1" /> Add New
                </Button>
              </div>

              {habits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 text-center">
                  <div className="bg-slate-50 p-4 rounded-full mb-3">
                    <Plus className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">No habits tracked yet</h3>
                  <p className="text-slate-500 mb-4 max-w-xs">Start building your streak by adding your first habit.</p>
                  <Button onClick={() => navigate("/CreateHabit")}>Create Habit</Button>
                </div>
              ) : (
                // RESPONSIVE GRID: 1 col mobile -> 2 col tablet -> 3 col desktop
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {habits.map((habit, idx) => (
                    <HabitCard
                      key={habit._id}
                      habit={habit}
                      index={idx}
                      onCheckin={() => handleCheckin(habit._id)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT SIDEBAR COLUMN (Analytics & Stats) */}
          <div className="lg:col-span-4 space-y-6">

            {/* ANALYTICS CARD */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800">Weekly Progress</h3>
                </div>
              </div>

              <div className="h-64 w-full">
                {chartData ? (
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                        y: { grid: { color: '#f8fafc' }, ticks: { stepSize: 1, font: { size: 10 } } }
                      },
                      elements: {
                        point: { radius: 4, hoverRadius: 6 }
                      }
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    <Spinner/>
                    Loading chart...
                    </div>
                )}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Current Level</span>
                  <span className="font-bold text-slate-900">{user?.level ?? 1}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Total XP</span>
                  <span className="font-bold text-indigo-600">{user?.xp ?? 0}</span>
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                className="text-slate-500 hover:text-red-600 hover:bg-red-50 w-full sm:w-auto"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}