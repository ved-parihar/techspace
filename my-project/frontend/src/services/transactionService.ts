import api from './api';
import type { Transaction } from '../types';

export const getTransactions = async (): Promise<Transaction[]> => {
  const res = await api.get<{ success: boolean; data: Transaction[] }>('/transactions');
  return res.data.data;
};

export const createTransaction = async (data: Partial<Transaction>): Promise<Transaction> => {
  const res = await api.post<{ success: boolean; data: Transaction }>('/transactions', data);
  return res.data.data;
};

export const updateTransaction = async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
  const res = await api.put<{ success: boolean; data: Transaction }>(`/transactions/${id}`, data);
  return res.data.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};
