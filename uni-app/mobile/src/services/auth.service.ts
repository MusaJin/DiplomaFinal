import * as SecureStore from 'expo-secure-store';
import api from './api';
import { AuthResponse, User } from '../types';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  await SecureStore.setItemAsync('auth_token', response.data.token);
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>('/auth/me');
  return response.data;
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync('auth_token');
}

export async function getStoredToken(): Promise<string | null> {
  return SecureStore.getItemAsync('auth_token');
}
