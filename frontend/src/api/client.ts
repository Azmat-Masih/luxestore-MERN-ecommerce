import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
console.log('🔌 API URL Configured:', API_URL);

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
    console.error('🚨 CRITICAL ERROR: VITE_API_URL is missing! The app is trying to connect to localhost which will fail. Please set VITE_API_URL in Vercel to your Render Backend URL.');
}

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for API calls
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Could implement token refresh here if using refresh tokens
            // For now, just redirect to login
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
