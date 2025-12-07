import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="center-screen">
      <div className="card auth-card">
        <h2>Login</h2>
        {err && <div className="error">{err}</div>}
        <form onSubmit={handleSubmit} className="form">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
          <button className="btn">Login</button>
        </form>
        <p className="muted">Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}
