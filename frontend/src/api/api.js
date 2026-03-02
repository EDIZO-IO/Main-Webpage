import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (email, password, fullName, phone) => 
    api.post('/api/auth/register', { email, password, fullName, phone }),
  getMe: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/me', data),
  changePassword: (currentPassword, newPassword) => 
    api.put('/api/auth/change-password', { currentPassword, newPassword }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Internships API
export const internshipsAPI = {
  getAll: (params) => api.get('/api/internships', { params }),
  getById: (id) => api.get(`/api/internships/${id}`),
  // Admin
  getAllAdmin: () => api.get('/api/internships/admin/all'),
  create: (data) => api.post('/api/internships', data),
  update: (id, data) => api.put(`/api/internships/${id}`, data),
  delete: (id) => api.delete(`/api/internships/${id}`)
};

// Services API
export const servicesAPI = {
  getAll: (params) => api.get('/api/services', { params }),
  getById: (id) => api.get(`/api/services/${id}`),
  // Admin
  getAllAdmin: () => api.get('/api/services/admin/all'),
  create: (data) => api.post('/api/services', data),
  update: (id, data) => api.put(`/api/services/${id}`, data),
  delete: (id) => api.delete(`/api/services/${id}`)
};

// Applications API (Internship)
export const applicationsAPI = {
  getAll: (params) => api.get('/api/applications', { params }),
  getById: (id) => api.get(`/api/applications/internship/${id}`),
  create: (data) => api.post('/api/applications/internship', data),
  // Admin
  getAllAdmin: () => api.get('/api/applications'),
  update: (id, data) => api.put(`/api/applications/internship/${id}`, data),
  delete: (id) => api.delete(`/api/applications/internship/${id}`)
};

// Service Applications API
export const serviceApplicationsAPI = {
  getAll: (params) => api.get('/api/applications?type=service', { params }),
  getById: (id) => api.get(`/api/applications/service/${id}`),
  create: (data) => api.post('/api/applications/service', data),
  // Admin
  getAllAdmin: () => api.get('/api/applications?type=service'),
  update: (id, data) => api.put(`/api/applications/service/${id}`, data),
  delete: (id) => api.delete(`/api/applications/service/${id}`)
};

// Certificates API
export const certificatesAPI = {
  verify: (certificateId) => api.get(`/api/certificates/verify/${certificateId}`),
  getAll: (params) => api.get('/api/certificates', { params }),
  getById: (id) => api.get(`/api/certificates/${id}`),
  // Admin
  getAllAdmin: () => api.get('/api/certificates'),
  create: (data) => api.post('/api/certificates', data),
  update: (id, data) => api.put(`/api/certificates/${id}`, data),
  delete: (id) => api.delete(`/api/certificates/${id}`)
};

// Team API
export const teamAPI = {
  getAll: () => api.get('/api/team'),
  // Admin
  getAllAdmin: () => api.get('/api/team/admin/all'),
  create: (data) => api.post('/api/team', data),
  update: (id, data) => api.put(`/api/team/${id}`, data),
  delete: (id) => api.delete(`/api/team/${id}`)
};

// Projects API
export const projectsAPI = {
  getAll: (params) => api.get('/api/projects', { params }),
  getById: (id) => api.get(`/api/projects/${id}`),
  // Admin
  getAllAdmin: () => api.get('/api/projects/admin/all'),
  create: (data) => api.post('/api/projects', data),
  update: (id, data) => api.put(`/api/projects/${id}`, data),
  delete: (id) => api.delete(`/api/projects/${id}`)
};

// Events API
export const eventsAPI = {
  getAll: (params) => api.get('/api/events', { params }),
  getById: (id) => api.get(`/api/events/${id}`),
  // Admin
  getAllAdmin: () => api.get('/api/events/admin/all'),
  create: (data) => api.post('/api/events', data),
  update: (id, data) => api.put(`/api/events/${id}`, data),
  delete: (id) => api.delete(`/api/events/${id}`)
};

// Testimonials API
export const testimonialsAPI = {
  getAll: (params) => api.get('/api/testimonials', { params }),
  create: (data) => api.post('/api/testimonials', data),
  // Admin
  getAllAdmin: () => api.get('/api/testimonials/admin/all'),
  update: (id, data) => api.put(`/api/testimonials/${id}`, data),
  delete: (id) => api.delete(`/api/testimonials/${id}`)
};

// Contact API
export const contactAPI = {
  submit: (data) => api.post('/api/contact', data),
  // Admin
  getAll: () => api.get('/api/contact'),
  update: (id, data) => api.put(`/api/contact/${id}`, data),
  delete: (id) => api.delete(`/api/contact/${id}`)
};

// Stats API
export const statsAPI = {
  getAll: (params) => api.get('/api/stats', { params }),
  // Admin
  getAllAdmin: () => api.get('/api/stats/admin/all'),
  create: (data) => api.post('/api/stats', data),
  update: (id, data) => api.put(`/api/stats/${id}`, data),
  delete: (id) => api.delete(`/api/stats/${id}`)
};

// Blogs API
export const blogsAPI = {
  getAll: (params) => api.get('/api/blogs', { params }),
  getBySlug: (slug) => api.get(`/api/blogs/${slug}`),
  // Admin
  getAllAdmin: () => api.get('/api/blogs/admin/all'),
  create: (data) => api.post('/api/blogs', data),
  update: (id, data) => api.put(`/api/blogs/${id}`, data),
  delete: (id) => api.delete(`/api/blogs/${id}`)
};

export default api;
