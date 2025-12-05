import React, { useContext, useState } from 'react';
import api from '../../apiClient';
import { AuthContext } from '../contexts/AuthContext';
import './CreateHabit.css';

function CreateHabit() {
  const { user } = useContext(AuthContext);

  const [newHabits, setNewHabits] = useState([]);
  // form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');

  // ui state
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  async function startNewHabit(title, description, frequency = 'daily') {
    if (!user) throw new Error('User not logged in');

    const payload = { title, description, frequency };
    const res = await api.post('/api/habits', payload);
    return res.data;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setSuccess('');
    if (!title.trim() || !description.trim()) {
      setErr('Please enter a title and description');
      return;
    }
    setLoading(true);

    try {
      // --- CHECKPOINT: Log data before sending ---
      console.log('Creating habit with payload:', { title: title.trim(), description: description.trim(), frequency });

      const created = await startNewHabit(title.trim(), description.trim(), frequency);
      setNewHabits(prev => [created, ...prev]);

      setTitle('');
      setDescription('');
      setFrequency('daily');
      setSuccess('Habit created successfully!');

      // optional: browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Habit created', { body: `${created.title} was added.` });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }

      // auto-hide success after 3s
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      // --- CHECKPOINT: Log the ENTIRE error object ---
      console.error('Failed to create habit. Full error object:', error);
      setErr(error.response?.data?.message || error.message || 'Failed to create habit');
      // auto-hide error after 4s
      setTimeout(() => setErr(''), 4000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-page">
      <header className="create-header">
        <div>
          <h1 className="title">Good morning, {user?.name || 'User'}</h1>
          <p className="muted">XP: <span className="accent">{user?.xp ?? 0}</span>  •  Level: <span className="accent">{user?.level ?? 1}</span></p>
        </div>

        <div className="header-actions">
          <div className="chip">What’s on your mind today?</div>
        </div>
      </header>

      <main className="center-screen">
        <div className="card create-card">
          <div className="card-header">
            <h2>Create a new habit</h2>
            <p className="sub">Small steps, big change — keep it simple.</p>
          </div>

          {err && <div className="toast toast-error">{err}</div>}
          {success && <div className="toast toast-success">{success}</div>}

          <form onSubmit={handleSubmit} className="form-grid">
            <label className="field">
              <span className="label">Title</span>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Drink 8 glasses of water"
                type="text"
                required
                disabled={loading}
                className="input"
              />
            </label>

            <label className="field">
              <span className="label">Description</span>
              <input
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Short note about your habit"
                type="text"
                required
                disabled={loading}
                className="input"
              />
            </label>

            <label className="field inline">
              <span className="label">Frequency</span>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
                disabled={loading}
                className="select"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>

            <div className="actions">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                <span className={`btn-text ${loading ? 'muted' : ''}`}>{loading ? 'Creating...' : 'Create Habit'}</span>
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setTitle('');
                  setDescription('');
                  setFrequency('daily');
                  setErr('');
                  setSuccess('');
                }}
              >
                Reset
              </button>
            </div>
          </form>

          {newHabits.length > 0 && (
            <div className="recent">
              <h4>Recently added</h4>
              <ul>
                {newHabits.map(h => (
                  <li key={h._id} className="recent-item">
                    <div>
                      <strong>{h.title}</strong>
                      <div className="small muted">{h.description}</div>
                    </div>
                    <div className="streak small">Streak: {h.streak ?? 0}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CreateHabit;
