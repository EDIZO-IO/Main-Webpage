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
    const token = localStorage.getItem('admin_token');
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
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    fullName: string;
    avatarUrl?: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const authAPI = {
  login: (email: string, password: string): Promise<axios.AxiosResponse<LoginResponse>> =>
    api.post('/api/auth/login', { email, password }),
  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },
  getMe: () => api.get('/api/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put<ChangePasswordRequest>('/api/auth/change-password', { currentPassword, newPassword })
};

// Users API (Admin Management)
export const usersAPI = {
  getAll: () => api.get('/api/users'),
  getById: (id) => api.get(`/api/users/${id}`),
  create: (data) => api.post('/api/users', data),
  update: (id, data) => api.put(`/api/users/${id}`, data),
  delete: (id) => api.delete(`/api/users/${id}`),
  resetPassword: (id, newPassword) =>
    api.put(`/api/users/${id}/reset-password`, { newPassword })
};

// Internships API
export const internshipsAPI = {
  getAll: () => api.get('/api/internships/admin/all'),
  getById: (id) => api.get(`/api/internships/${id}`),
  create: (data) => api.post('/api/internships', data),
  update: (id, data) => api.put(`/api/internships/${id}`, data),
  delete: (id) => api.delete(`/api/internships/${id}`)
};

// Services API
export const servicesAPI = {
  getAll: () => api.get('/api/services/admin/all'),
  getById: (id) => api.get(`/api/services/${id}`),
  create: (data) => api.post('/api/services', data),
  update: (id, data) => api.put(`/api/services/${id}`, data),
  delete: (id) => api.delete(`/api/services/${id}`)
};

// Applications API (Internship)
export const applicationsAPI = {
  getAll: (params?: any) => api.get('/api/applications', { params }),
  getById: (id) => api.get(`/api/applications/internship/${id}`),
  update: (id, data) => api.put(`/api/applications/internship/${id}`, data),
  delete: (id) => api.delete(`/api/applications/internship/${id}`)
};

// Service Applications API
export const serviceApplicationsAPI = {
  getAll: (params?: any) => api.get('/api/applications?type=service', { params }),
  getById: (id) => api.get(`/api/applications/service/${id}`),
  create: (data) => api.post('/api/applications/service', data),
  update: (id, data) => api.put(`/api/applications/service/${id}`, data),
  delete: (id) => api.delete(`/api/applications/service/${id}`)
};

// Certificates API
export const certificatesAPI = {
  getAll: () => api.get('/api/certificates'),
  getById: (id) => api.get(`/api/certificates/${id}`),
  create: (data) => api.post('/api/certificates', data),
  update: (id, data) => api.put(`/api/certificates/${id}`, data),
  delete: (id) => api.delete(`/api/certificates/${id}`),
  verify: (certificateId) => api.get(`/api/certificates/verify/${certificateId}`)
};

// Team API
export const teamAPI = {
  getAll: () => api.get('/api/team/admin/all'),
  create: (data) => api.post('/api/team', data),
  update: (id, data) => api.put(`/api/team/${id}`, data),
  delete: (id) => api.delete(`/api/team/${id}`)
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/api/projects/admin/all'),
  getById: (id) => api.get(`/api/projects/${id}`),
  create: (data) => api.post('/api/projects', data),
  update: (id, data) => api.put(`/api/projects/${id}`, data),
  delete: (id) => api.delete(`/api/projects/${id}`)
};

// Events API
export const eventsAPI = {
  getAll: () => api.get('/api/events/admin/all'),
  getById: (id) => api.get(`/api/events/${id}`),
  create: (data) => api.post('/api/events', data),
  update: (id, data) => api.put(`/api/events/${id}`, data),
  delete: (id) => api.delete(`/api/events/${id}`)
};

// Testimonials API
export const testimonialsAPI = {
  getAll: () => api.get('/api/testimonials/admin/all'),
  update: (id, data) => api.put(`/api/testimonials/${id}`, data),
  delete: (id) => api.delete(`/api/testimonials/${id}`)
};

// Contact API
export const contactAPI = {
  getAll: () => api.get('/api/contact'),
  update: (id, data) => api.put(`/api/contact/${id}`, data),
  delete: (id) => api.delete(`/api/contact/${id}`)
};

// Stats API
export const statsAPI = {
  getAll: () => api.get('/api/stats/admin/all'),
  create: (data) => api.post('/api/stats', data),
  update: (id, data) => api.put(`/api/stats/${id}`, data),
  delete: (id) => api.delete(`/api/stats/${id}`)
};

// Blogs API
export const blogsAPI = {
  getAll: () => api.get('/api/blogs/admin/all'),
  create: (data) => api.post('/api/blogs', data),
  update: (id, data) => api.put(`/api/blogs/${id}`, data),
  delete: (id) => api.delete(`/api/blogs/${id}`)
};

// File Upload API
export const uploadAPI = {
  uploadImage: async (file, folder = 'services') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const response = await api.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default api;
