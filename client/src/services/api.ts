import axios from 'axios';

import { setSessionExpiredLoginFlash } from '@/services/loginFlash';

const STORAGE_TOKEN_KEY = 'photoopp-token';

function resolveApiBaseUrl(rawValue?: string): string {
  const trimmedValue = rawValue?.trim();

  if (!trimmedValue) {
    return '';
  }

  return trimmedValue.replace(/\/api\/?$/, '').replace(/\/$/, '');
}

export const api = axios.create({
  baseURL: resolveApiBaseUrl(import.meta.env.VITE_API_URL),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem('photoopp-user');
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        setSessionExpiredLoginFlash();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
