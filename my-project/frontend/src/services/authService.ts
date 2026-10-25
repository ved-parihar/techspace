import api from './api';
import type { User } from '../types';

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface OAuthConfig {
  success: boolean;
  providers: {
    google: { enabled: boolean; clientId: string };
  };
}

export const registerUser = async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/register', data);
  return res.data;
};

export const loginUser = async (data: { email: string; password: string }): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/login', data);
  return res.data;
};

export const getMe = async (): Promise<{ success: boolean; user: User }> => {
  const res = await api.get<{ success: boolean; user: User }>('/auth/me');
  return res.data;
};

export const getOAuthConfig = async (): Promise<OAuthConfig> => {
  const res = await api.get<OAuthConfig>('/auth/oauth/config');
  return res.data;
};

export const oauthLogin = async (data: {
  provider: 'google';
  credential?: string;
  accessToken?: string;
  userInfo?: {
    email: string;
    name?: string;
    id?: string;
    avatar?: string;
  };
}): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/oauth', data);
  return res.data;
};
