import axios from 'axios';
import config from '../config/environment.js';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/SignInform';
    }
    
    // Enhanced error messaging
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'An unexpected error occurred';
    
    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

// API service methods
export const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getUserById: (userId) => api.get(`/auth/${userId}`),
    getUserCount: () => api.get('/auth/count'),
  },

  // Movie endpoints
  movies: {
    getAll: () => api.get('/movies'),
    getNowShowing: (params = {}) => api.get('/movies/now-showing', { params }),
    getComingSoon: (params = {}) => api.get('/movies/coming-soon', { params }),
    getCount: () => api.get('/movies/count'),
    create: (movieData) => api.post('/movies', movieData),
    update: (id, movieData) => api.put(`/movies/${id}`, movieData),
    delete: (id) => api.delete(`/movies/${id}`),
  },

  // Theatre endpoints
  theatres: {
    getAll: () => api.get('/theatres'),
    getWithScreens: () => api.get('/theatres/with-screens'),
    getById: (id) => api.get(`/theatres/${id}`),
    create: (theatreData) => api.post('/theatres', theatreData),
    update: (id, theatreData) => api.put(`/theatres/${id}`, theatreData),
    delete: (id) => api.delete(`/theatres/${id}`),
  },

  // Screen endpoints
  screens: {
    getAll: () => api.get('/screens'),
    getById: (id) => api.get(`/screens/${id}`),
    create: (screenData) => api.post('/screens', screenData),
    update: (id, screenData) => api.put(`/screens/${id}`, screenData),
    delete: (id) => api.delete(`/screens/${id}`),
  },

  // Showtime endpoints
  showtimes: {
    getAll: () => api.get('/showtimes'),
    getAllWithDetails: () => api.get('/showtimes/all/details'),
    getById: (id) => api.get(`/showtimes/${id}`),
    search: (params) => api.get('/showtimes/search', { params }),
    getSeats: (id) => api.get(`/showtimes/${id}/seats`),
    searchSeats: (showtimeSeatIds) => api.get('/showtimes/seats/search', { 
      params: { showtimeSeatIds } 
    }),
    getTodayCount: () => api.get('/showtimes/count/today'),
    create: (showtimeData) => api.post('/showtimes', showtimeData),
    update: (id, showtimeData) => api.put(`/showtimes/${id}`, showtimeData),
    delete: (id) => api.delete(`/showtimes/delete/${id}`),
  },

  // Booking endpoints
  bookings: {
    getAll: () => api.get('/bookings'),
    getById: (id) => api.get(`/bookings/${id}`),
    getByUserId: (userId) => api.get(`/bookings/user/${userId}`),
    create: (bookingData) => api.post('/bookings', bookingData),
    update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
    delete: (id) => api.delete(`/bookings/${id}`),
  },
};

// Export both the configured axios instance and the service methods
export default api;
export { api }; 