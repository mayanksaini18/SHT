import React, { useEffect, useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../contexts/AuthContext';
import HabitCard from '../components/HabitCard';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Dashboard() {
  const { user, setUser, logout } = useContext(AuthContext);
  const [habits, setHabits] = useState([]);
  const [chartData, setChartData] = useState(null);

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
        labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        datasets: [{ label: 'Check-ins', data: [1,2,3,2,4,1,0], fill: false }]
      });
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Good morning, {user?.name || 'User'}</h1>
          <p className="muted">XP: {user?.xp ?? 0} — Level: {user?.level ?? 1}</p>
        </div>
        <div>
          <button className="btn-ghost" onClick={logout}>Logout</button>
        </div>
      </header>

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
