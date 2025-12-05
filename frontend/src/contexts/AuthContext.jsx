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

  // ============================================
  // AUTO-LOGIN USING SAVED ACCESS TOKEN
  // ============================================
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    // Fetch user if token exists
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.log("Token expired -> trying refresh");
        try {
          // Try refresh token (cookie-based)
          const refreshRes = await api.post("/api/auth/refresh");
          localStorage.setItem("accessToken", refreshRes.data.accessToken);

          const profile = await api.get("/auth/me");
          setUser(profile.data);
          localStorage.setItem("user", JSON.stringify(profile.data));
        } catch {
          // refresh also failed
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ============================================
  // LOGIN
  // ============================================
  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res;
  };

  // ============================================
  // REGISTER
  // ============================================
  const register = async (data) => {
    const res = await api.post('/api/auth/register', data);
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res;
  };

  // ============================================
  // LOGOUT
  // ============================================
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
