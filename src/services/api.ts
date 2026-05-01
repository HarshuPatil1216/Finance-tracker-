import axios from 'axios';
import { Transaction, MoneyFlow, Bill, Budget } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const apiService = {
  // Transactions
  getTransactions: async (userId: string) => {
    const response = await api.get<Transaction[]>(`/transactions/user/${userId}`);
    return response.data;
  },
  addTransaction: async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const response = await api.post<Transaction>('/transactions', transaction);
    return response.data;
  },
  deleteTransaction: async (id: string) => {
    await api.delete(`/transactions/${id}`);
  },

  // Money Flow
  getMoneyFlows: async (userId: string) => {
    const response = await api.get<MoneyFlow[]>(`/moneyflow/user/${userId}`);
    return response.data;
  },
  addMoneyFlow: async (flow: Omit<MoneyFlow, 'id' | 'createdAt'>) => {
    const response = await api.post<MoneyFlow>('/moneyflow', flow);
    return response.data;
  },
  updateMoneyFlowStatus: async (id: string, status: string) => {
    const response = await api.put<MoneyFlow>(`/moneyflow/${id}/status`, status);
    return response.data;
  },
  deleteMoneyFlow: async (id: string) => {
    await api.delete(`/moneyflow/${id}`);
  },

  // Bills
  getBills: async (userId: string) => {
    const response = await api.get<Bill[]>(`/bills/user/${userId}`);
    return response.data;
  },
  addBill: async (bill: Omit<Bill, 'id' | 'createdAt'>) => {
    const response = await api.post<Bill>('/bills', bill);
    return response.data;
  },
  updateBillStatus: async (id: string, status: string) => {
    const response = await api.put<Bill>(`/bills/${id}/status`, status);
    return response.data;
  },
  deleteBill: async (id: string) => {
    await api.delete(`/bills/${id}`);
  },

  // Budgets
  getBudgets: async (userId: string) => {
    const response = await api.get<Budget[]>(`/budgets/user/${userId}`);
    return response.data;
  },
  setBudget: async (budget: Omit<Budget, 'id' | 'createdAt'>) => {
    const response = await api.post<Budget>('/budgets', budget);
    return response.data;
  },
  deleteBudget: async (id: string) => {
    await api.delete(`/budgets/${id}`);
  }
};
