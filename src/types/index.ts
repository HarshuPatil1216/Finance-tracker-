export type TransactionType = 'income' | 'expense';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  currency: string;
  theme: 'light' | 'dark';
  createdAt: string;
}

export interface Transaction {
  id?: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface Budget {
  id?: string;
  userId: string;
  category: string;
  amount: number;
  month: string; // YYYY-MM
  createdAt: string;
}

export interface Bill {
  id?: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid';
  createdAt: string;
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  recentTransactions: Transaction[];
  categorySpending: { category: string; amount: number }[];
  monthlyTrends: { month: string; income: number; expense: number }[];
}
