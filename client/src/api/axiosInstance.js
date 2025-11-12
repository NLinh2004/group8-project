// src/api/axiosInstance.js
import axios from "axios";
import { store } from "../store";
import { refreshAccessToken, logout } from "../store/authSlice";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api", // ← DÙNG ENV
  withCredentials: true, // Enable credentials for CORS
});

// Gắn accessToken vào header
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý 401 → tự động refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await store.dispatch(refreshAccessToken()).unwrap();
        const newToken = store.getState().auth.accessToken;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;