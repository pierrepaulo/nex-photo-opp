import { api } from '@/services/api';
import type { LoginResponse, User } from '@/types';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/api/auth/login', { email, password });
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/api/auth/me');
  return data;
}
