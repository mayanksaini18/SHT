import axios from 'axios';

// --- CHECKPOINT: Log the API Base URL ---
console.log('API Client loaded. Base URL:', import.meta.env.VITE_API_URL);

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Important for sending cookies (for auth) with every request
});

export default apiClient;
