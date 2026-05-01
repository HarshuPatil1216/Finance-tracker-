import React, { useState } from 'react';
import { TransactionType } from '../types';
import { auth } from '../lib/firebase';
import { addTransaction } from '../services/db';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

const categories = [
  'Salary',
  'Food & Drinks',
  'Shopping',
  'Transport',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Investment',
  'Others'
];

interface TransactionFormProps {
  onSuccess: () => void;
}

export const TransactionForm = ({ onSuccess }: TransactionFormProps) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Drinks');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userId = auth.currentUser?.uid || 'guest';
      
      await addTransaction({
        userId,
        type,
        amount: parseFloat(amount),
        category,
        date,
        notes
      });
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={cn(
            "flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
            type === 'expense' ? "bg-white text-rose-600 shadow-sm" : "text-secondary hover:text-slate-900"
          )}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={cn(
            "flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
            type === 'income' ? "bg-white text-emerald-600 shadow-sm" : "text-secondary hover:text-slate-900"
          )}
        >
          Income
        </button>
      </div>

      <Input 
        label="Amount (₹)" 
        type="number" 
        placeholder="0.00" 
        required 
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Category</label>
        <div className="relative group">
          <select 
            className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer group-hover:border-slate-300"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <Input 
        label="Date" 
        type="date" 
        required 
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <Input 
        label="Notes" 
        placeholder="What is this for?" 
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-indigo-100 transition-all"
      >
        {loading ? 'Processing...' : 'Add Transaction'}
      </Button>
    </form>
  );
};
