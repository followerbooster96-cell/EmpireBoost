import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.dispatchEvent(
        new CustomEvent("empire-user-updated", {
          detail: {
            user: null,
          },
        })
      );

      const currentPath = window.location.pathname;

      const publicAuthPages = [
        "/login",
        "/register",
        "/forgot-password",
      ];

      const isResetPasswordPage = currentPath.startsWith("/reset-password");

      if (!publicAuthPages.includes(currentPath) && !isResetPasswordPage) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;