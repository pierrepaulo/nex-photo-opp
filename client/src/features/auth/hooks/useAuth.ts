import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import * as authService from '@/features/auth/services/authService';
import type { User } from '@/types';

export function useAuth() {
  const { user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(email: string, password: string): Promise<User> {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      setAuth(response.token, response.user);
      return response.user;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Erro ao fazer login';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    storeLogout();
    navigate('/login');
  }

  return { login, logout, user, isAuthenticated, isLoading, error };
}
