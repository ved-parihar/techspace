import api from './api';
import type { Budget } from '../types';

export const getBudgets = async (): Promise<Budget[]> => {
  const res = await api.get<{ success: boolean; data: Budget[] }>('/budgets');
  return res.data.data;
};

export const createBudget = async (data: Partial<Budget>): Promise<Budget> => {
  const res = await api.post<{ success: boolean; data: Budget }>('/budgets', data);
  return res.data.data;
};

export const updateBudget = async (id: string, data: Partial<Budget>): Promise<Budget> => {
  const res = await api.put<{ success: boolean; data: Budget }>(`/budgets/${id}`, data);
  return res.data.data;
};

export const deleteBudget = async (id: string): Promise<void> => {
  await api.delete(`/budgets/${id}`);
};
