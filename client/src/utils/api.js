import axios from "axios";

const api = axios.create({
  baseURL: "https://yungd-codecamp-api.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("codecamp_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "Something went wrong. Try again.";

    if (error.response?.status === 401) {
      localStorage.removeItem("codecamp_token");
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;