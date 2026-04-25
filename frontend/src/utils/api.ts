import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public endpoints that don't need auth token
const publicPaths = [
  { path: '/tickets', method: 'get' },              // GET tickets list (public for viewing)
  { path: '/tickets/', method: 'get' },             // GET single ticket (public)
  { path: '/tickets/with-images', method: 'post' }, // POST create ticket (public)
  { path: '/tickets/public', method: 'get' },      // Public ticket view
  { path: '/auth/login', method: 'post' },           // Login
  { path: '/users/register', method: 'post' },      // Register
  { path: '/resources', method: 'get' },          // GET resources (public)
  { path: '/admin/resources', method: 'get' },     // GET resources (public)
  { path: '/admin/bookings', method: 'get' },     // GET bookings (for admin dashboard)
  { path: '/notifications/user/', method: 'get' }  // GET user notifications
];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartcampus_token');
  if (token && config.url) {
    // Check if this is a public endpoint
    const isPublic = publicPaths.some(p => {
      const matchPath = config.url?.includes(p.path);
      const matchMethod = config.method?.toLowerCase() === p.method.toLowerCase();
      return matchPath && matchMethod;
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