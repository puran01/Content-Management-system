import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
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

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  signup: async (data: { email: string; password: string; name: string; role: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const contentService = {
  getAll: async () => {
    const response = await api.get('/content');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/content/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/content', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/content/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/content/${id}`);
    return response.data;
  },
};

export default api;
