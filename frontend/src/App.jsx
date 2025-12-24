import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/loginPage/Login';
import Register from './pages/registerPage/Register';
import Dashboard from './pages/dashboardPage/Dashboard';
import CreateHabit from './pages/createHabitPage/CreateHabit';
import Welcome from './pages/welcomePage/welcome';
import { AuthContext } from './contexts/AuthContext';

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/welcome" replace />} />
      <Route path="/CreateHabit" element={user ? <CreateHabit /> : <Navigate to="/login" replace />} />
    
    </Routes>
  );
}
