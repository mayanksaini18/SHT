import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/api';
import { AuthContext } from '../../contexts/AuthContext';
import HabitCard from '../../components/HabitCard';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

import './Dashboard.css';

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
      alert('Checked in! +10 XP');
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed');
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
      <header className="header">
        <div>
          {/* avatar circle with first letter of name */}
          <div className="avatar-circle">
            {firstLetter}
          </div>
          <h1>Good morning, {user?.name || 'User'}</h1>
          <p className="muted">XP: {user?.xp ?? 0}  Level: {user?.level ?? 1}</p>
        </div>
        <div>
          <button className="btn" onClick={() => navigate('/CreateHabit')}>Create Habit</button>
          <button className="btn-ghost" onClick={logout}>Logout</button>
        </div>
      </header>
       {/* ---------- CALENDAR STRIP ---------- */}
      <section className="day-strip">
        {dayPills.map((day, idx) => (
          <button
            key={day.key}
            className={`day-pill ${idx === selectedDayIndex ? 'active' : ''}`}
            onClick={() => setSelectedDayIndex(idx)}
            type="button"
          >
            <span className="day-pill-weekday">{day.weekday}</span>
            <span className="day-pill-date">{day.date}</span>
          </button>
        ))}
      </section>

      <main>
        <section className="grid">
          {habits.map(h => (
            <HabitCard key={h._id} habit={h} onCheckin={() => handleCheckin(h._id)} />
          ))}
        </section>

        <section className="chart-card">
          <h3>Weekly activity</h3>
          {chartData ? <Line data={chartData} /> : <p>Loading...</p>}
        </section>
      </main>
    </div>
  );
}
