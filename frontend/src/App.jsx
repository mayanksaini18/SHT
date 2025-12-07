import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Welcome from './pages/welcomePage/Welcome';
import Login from './pages/loginPage/Login';
import Register from './pages/registerPage/Register';
import Dashboard from './pages/dashboardPage/Dashboard';
import CreateHabit from './pages/createHabitPage/CreateHabit';
import { AuthContext } from './contexts/AuthContext';

export default function App() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If not logged in, go to login
    if (!user) navigate('/Welcome');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/Welcome" />} />
       <Route path="/createhabit" element={<CreateHabit />} />
    </Routes>
  );
}
