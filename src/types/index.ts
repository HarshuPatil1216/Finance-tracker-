export type TransactionType = 'income' | 'expense';
export type MoneyFlowType = 'give' | 'take';

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
  pin?: string;
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

export interface MoneyFlow {
  id?: string;
  userId: string;
  personName: string;
  amount: number;
  dueDate: string;
  type: MoneyFlowType; // give = I owe them, take = they owe me
  notes?: string;
  status: 'pending' | 'settled';
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
  status: 'paid' | 'unpaid' | 'pending';
  createdAt: string;
}
