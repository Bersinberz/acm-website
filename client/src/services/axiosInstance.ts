import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

// --- Request Interceptor ---
axiosInstance.interceptors.request.use(
  (config) => {
    // ✅ If body is FormData, let browser handle headers
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      // ✅ Default to JSON
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor ---
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
