import axios from "axios";

// Read environment variable
const BASE_URL =
    import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
});

// --- Request Interceptor ---
axiosInstance.interceptors.request.use(
    (config) => {
        // Allow JSON & FormData
        if (!config.headers["Content-Type"]) {
            config.headers["Content-Type"] = "multipart/form-data";
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
