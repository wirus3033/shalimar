import axios, { AxiosError } from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor (e.g., for auth tokens)
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor (e.g., for error handling)
api.interceptors.response.use(
    (response) => {
        // Return only the data to simplify usage in services
        return response.data;
    },
    (error: AxiosError) => {
        // Handle unauthorized errors (401)
        if (error.response?.status === 401) {
            console.error('Unauthorized access - potential token expiration');
            if (typeof window !== 'undefined') {
                // Example: localStorage.removeItem('token');
                // window.location.href = '/login';
            }
        }

        const errorData = error.response?.data as { message?: string } | undefined;
        const errorMessage = errorData?.message || error.message || 'An unexpected error occurred';
        console.error(`API Error: ${errorMessage}`, error.response?.data);

        return Promise.reject(error);
    }
);

export default api;
