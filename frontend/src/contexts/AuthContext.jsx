import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  // ============================================
  // AUTO-LOGIN ON APP LOAD
  // ============================================
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    // The API interceptor will handle token refreshing automatically.
    // We just need to ask for the user profile.
    const fetchUserOnLoad = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        // If this fails, the refresh token is likely invalid. The interceptor failed.
        console.error("Auto-login failed, session is invalid.");
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserOnLoad();
  }, []); // Empty dependency array ensures this runs only once on mount

  // ============================================
  // LOGIN
  // ============================================
  const login = async (email, password) => {
    console.log("login initiated");
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res;
  };

  // ============================================
  // REGISTER
  // ============================================
  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
