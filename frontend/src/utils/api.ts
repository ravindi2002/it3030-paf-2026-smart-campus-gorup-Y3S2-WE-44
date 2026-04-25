import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public endpoints that don't need auth token
const publicPaths = [
  '/tickets',              // GET tickets list (public for viewing)
  '/tickets/',             // GET single ticket (public)
  '/tickets/with-images', // POST create ticket (public)
  '/tickets/public',      // Public ticket view
  '/auth/login',           // Login
  '/users/register',      // Register
  '/resources',          // GET resources (public)
  '/admin/resources',     // GET resources (public)
  '/admin/bookings'     // GET bookings (for admin dashboard)
];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartcampus_token');
  if (token && config.url) {
    // Check if this is a public endpoint
    const isPublic = publicPaths.some(path => {
      // Handle GET requests to public endpoints  
      if (config.method === 'get' && config.url?.includes(path)) {
        return true;
      }
      // Include match for other methods (POST, etc.)
      if (config.url?.includes(path)) {
        return true;
      }
      return false;
    });
    if (!isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('smartcampus_token');
      localStorage.removeItem('smartcampus_user');
    }
    return Promise.reject(error);
  }
);

export default api;