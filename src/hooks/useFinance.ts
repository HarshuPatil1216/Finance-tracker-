import React, { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Transaction, Budget, Bill, FinancialSummary } from '../types';

export const useFinance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;

    const tUnsub = onSnapshot(
      query(collection(db, 'transactions'), where('userId', '==', uid), orderBy('date', 'desc')),
      (snap) => {
        setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
      }
    );

    const bUnsub = onSnapshot(
      query(collection(db, 'budgets'), where('userId', '==', uid)),
      (snap) => {
        setBudgets(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Budget)));
      }
    );

    const blUnsub = onSnapshot(
      query(collection(db, 'bills'), where('userId', '==', uid), orderBy('dueDate', 'asc')),
      (snap) => {
        setBills(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bill)));
        setLoading(false);
      }
    );

    return () => {
      tUnsub();
      bUnsub();
      blUnsub();
    };
  }, []);

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    const catMap: Record<string, number> = {};

    transactions.forEach(t => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      }
    });

    const categorySpending = Object.entries(catMap).map(([category, amount]) => ({ category, amount }));

    return {
      totalBalance: income - expense,
      totalIncome: income,
      totalExpenses: expense,
      recentTransactions: transactions.slice(0, 5),
      categorySpending: categorySpending.sort((a, b) => b.amount - a.amount),
    };
  }, [transactions]);

  return { transactions, budgets, bills, summary, loading };
};
