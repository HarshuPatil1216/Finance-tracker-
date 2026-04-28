import React, { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Transaction, Budget, Bill, MoneyFlow, OperationType } from '../types';
import { handleFirestoreError } from '../lib/utils';

export const useFinance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [moneyFlow, setMoneyFlow] = useState<MoneyFlow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if auth is ready
    const uid = auth.currentUser?.uid;

    if (!uid) {
      // Guest Mode Logic
      const getGuestData = () => {
        const data = localStorage.getItem('smartfinance_guest_data');
        return data ? JSON.parse(data) : { transactions: [], budgets: [], bills: [], moneyFlow: [] };
      };

      const pollGuestData = () => {
        const data = getGuestData();
        setTransactions(data.transactions || []);
        setBudgets(data.budgets || []);
        setBills(data.bills || []);
        setMoneyFlow(data.moneyFlow || []);
        setLoading(false);
      };

      pollGuestData();
      const interval = setInterval(pollGuestData, 1500); 
      return () => clearInterval(interval);
    }

    const tUnsub = onSnapshot(
      query(collection(db, 'transactions'), where('userId', '==', uid), orderBy('date', 'desc')),
      (snap) => {
        setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
        setLoading(false);
      },
      (err) => {
        console.error("Transactions subscription error:", err);
        handleFirestoreError(err, OperationType.LIST, 'transactions');
      }
    );

    const bUnsub = onSnapshot(
      query(collection(db, 'budgets'), where('userId', '==', uid)),
      (snap) => {
        setBudgets(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Budget)));
      },
      (err) => {
        console.error("Budgets subscription error:", err);
        handleFirestoreError(err, OperationType.LIST, 'budgets');
      }
    );

    const blUnsub = onSnapshot(
      query(collection(db, 'bills'), where('userId', '==', uid), orderBy('dueDate', 'asc')),
      (snap) => {
        setBills(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bill)));
      },
      (err) => {
        console.error("Bills subscription error:", err);
        handleFirestoreError(err, OperationType.LIST, 'bills');
      }
    );

    const mfUnsub = onSnapshot(
      query(collection(db, 'moneyFlow'), where('userId', '==', uid), orderBy('dueDate', 'asc')),
      (snap) => {
        setMoneyFlow(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MoneyFlow)));
      },
      (err) => {
        console.error("MoneyFlow subscription error:", err);
        handleFirestoreError(err, OperationType.LIST, 'moneyFlow');
      }
    );

    return () => {
      tUnsub();
      bUnsub();
      blUnsub();
      mfUnsub();
    };
  }, [auth.currentUser]);

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

  return { transactions, budgets, bills, moneyFlow, summary, loading };
};
