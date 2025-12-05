import React, { useContext, useState } from 'react';
import api from '../api/api'; // make sure this path matches your project
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';


function CreateHabit() {
    const { user } = useContext(AuthContext);

    const [Newhabits, setNewHabits] = useState([]);


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
        try {
            const res = await api.post('/habits', payload);
            return res.data;

        } catch (err) {
            console.log(`post request failed  ${err}`);
        }
    }



async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setSuccess("");
    if (!title.trim() || !description.trim()) {
        setErr('Please enter a title and description')
        return;
    }
    setLoading(true);

    try {
        const created = await startNewHabit(title.trim(), description.trim(), frequency);
        // update local list
      setNewHabits(prev => [created, ...prev]);
      // clear form
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
    } catch (error) {
      console.error(error);
      setErr(error.response?.data?.message || error.message || 'Failed to create habit');
    } finally {
      setLoading(false);
    }

}

return (

    <div className="page">
        <header className="header">
            <div>
                <h1>Good morning, {user?.name || 'User'}</h1>
                <p className="muted">XP: {user?.xp ?? 0}  Level: {user?.level ?? 1}</p>
                <p className="muted"> what in ur mind today?</p>

            </div>
            <div>

            </div>
        </header>

      // form for new habit
        <div className="center-screen">
            <div className="card auth-card">
                <h2>create a new habit</h2>
                {err && <div className="error" style={{ marginBottom: 8 }}>{err}</div>}
                {success && <div className="success" style={{ marginBottom: 8 }}>{success}</div>}

                <form onSubmit={handleSubmit} className="form">
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Enter the title of the habit"
                        type="text"
                        required
                        disabled={loading}
                    />

                    <input
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Enter the description of the habit"
                        type="text"
                        required
                        disabled={loading}
                    />

                    <label style={{ display: 'block', margin: '8px 0' }}>
                        Frequency
                        <select
                            value={frequency}
                            onChange={e => setFrequency(e.target.value)}
                            style={{ marginLeft: 8 }}
                            disabled={loading}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </label>

                    <button className="btn" type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create'}
                    </button>
                </form>

            </div>
        </div>
    </div>
)
}

export default CreateHabit;
