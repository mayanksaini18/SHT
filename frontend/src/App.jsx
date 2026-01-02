import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/loginPage/Login';
import Register from './pages/registerPage/Register';
import Dashboard from './pages/dashboardPage/Dashboard';
import CreateHabit from './pages/createHabitPage/CreateHabit';
import Welcome from './pages/welcomePage/welcome';
import { AuthContext } from './contexts/AuthContext';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    // This listener from Firebase sets up a global observer for the user's sign-in state.
    // It's best placed in a top-level component like App.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // When the auth state changes, we update our global context.
      setUser(currentUser);
    });

    // The returned function will be called on component unmount,
    // preventing memory leaks.
    return () => unsubscribe();
  }, [setUser]); // Dependency array ensures this effect runs only when `setUser` changes.

  return (
    <Routes>
      {/* Public routes that should only be accessible when logged out. */}
      {/* If a logged-in user tries to access them, they are redirected to the dashboard. */}
      <Route path="/welcome" element={!user ? <Welcome /> : <Navigate to="/" replace />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

      {/* Protected Routes - only accessible when a user is logged in. */}
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/welcome" replace />} />
      <Route path="/CreateHabit" element={user ? <CreateHabit /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}
