import axios from 'axios';

const api = axios.create({
  // baseURL:  'https://sht-0yzn.onrender.com/api'
  baseURL : 'http://localhost:5000/api'
 ,
    headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

// attach access token to headers if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// simple response interceptor to handle 401 by trying refresh
api.interceptors.response.use(response => response, async (error) => {
  const originalRequest = error.config;
  if (error.response && error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const resp = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
      const newToken = resp.data.accessToken;
      localStorage.setItem('accessToken', newToken);
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (e) {
      // redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return Promise.reject(e);
    }
  }
  return Promise.reject(error);
});

export default api;
