import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    // --- CHECKPOINT: Log form data before sending ---
    console.log('Submitting registration form:', form);
    try {
      await register(form);
      navigate('/');
    } catch (error) {
      // --- CHECKPOINT: Log the ENTIRE error object ---
      console.error('Registration failed. Full error object:', error);
      setErr(error.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className="center-screen">
      <div className="card auth-card">
        <h2>Register</h2>
        {err && <div className="error">{err}</div>}
        <form onSubmit={handleSubmit} className="form">
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" required />
          <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" type="email" required />
          <input value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Password" type="password" required />
          <button className="btn">Create account</button>
        </form>
        <p className="muted">Already have account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
