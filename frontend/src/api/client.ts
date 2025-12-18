import axios from 'axios';

// Set the base URL for all API requests
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Base URL includes /api
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to log the full URL and handle file uploads
api.interceptors.request.use(config => {
  // Log the full URL for debugging
  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);

  // Don't set Content-Type for FormData - let the browser set it with the correct boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

const getToken = () => (typeof window === 'undefined' ? null : window.localStorage.getItem('cvs_token'));

api.interceptors.request.use((config) => {
  // Explicitly get token using the correct key
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('cvs_token') : null;

  if (!config.headers) {
    config.headers = {} as any;
  }

  if (token) {
    // Remove extra quotes if present (common localStorage issue)
    const cleanToken = token.replace(/^"(.*)"$/, '$1');
    config.headers.Authorization = `Bearer ${cleanToken}`;
    console.log('[Client Debug] Auth Header set with cvs_token');
  } else {
    console.warn('[Client Debug] No cvs_token found in localStorage');
  }
  return config;
});

export default api;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('[Client Debug] 401/403 received. Clearing auth and redirecting.');
      // Clear local storage
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('cvs_token');
        window.localStorage.removeItem('cvs_user');

        // Only redirect if not already on login page to avoid loops
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);


