import axios from 'axios';
import { API_URL } from '../config/api';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: attach token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: handle 401s (e.g., redirect to login)
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error('Unauthorized or forbidden - clearing token');
            localStorage.removeItem('token');
            // We can optionally force a redirect here if we are not on auth pages:
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default apiClient;
