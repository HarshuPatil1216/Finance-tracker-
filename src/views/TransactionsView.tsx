import React, { useState } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { 
  Plus, 
  Trash2, 
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { addTransaction, deleteTransaction } from '../services/db';
import { auth } from '../lib/firebase';
import { TransactionType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const categories = [
  'All',
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

export const TransactionsView = () => {
  const { transactions } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Drinks');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const filteredTransactions = transactions.filter(t => {
    const matchesCategory = selectedCategory === 'All' ? true : t.category === selectedCategory;
    const matchesSearch = t.notes?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = auth.currentUser?.uid || 'guest';
    
    await addTransaction({
      userId,
      type,
      amount: parseFloat(amount),
      category,
      date,
      notes
    });

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setAmount('');
    setNotes('');
    setCategory('Food & Drinks');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">Activities</h1>
          <p className="text-secondary font-medium text-sm">Review and manage your historical spending patterns.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-11 pr-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none w-fu shadow-soft transition-all"
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none font-bold">
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card className="border-none sticky top-8" title="Category Filter">
            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                    selectedCategory === cat 
                      ? "bg-indigo-600 text-white shadow-soft" 
                      : "text-secondary hover:bg-slate-50 dark:hover:bg-white/5"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="border-none p-0 overflow-hidden" title={`${selectedCategory} Ledger`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                    <th className="px-8 py-5 text-left text-[10px] font-bold text-secondary uppercase tracking-[0.2em] font-sans">Date</th>
                    <th className="px-8 py-5 text-left text-[10px] font-bold text-secondary uppercase tracking-[0.2em] font-sans">Label</th>
                    <th className="px-8 py-5 text-left text-[10px] font-bold text-secondary uppercase tracking-[0.2em] font-sans">Category</th>
                    <th className="px-8 py-5 text-right text-[10px] font-bold text-secondary uppercase tracking-[0.2em] font-sans">Amount</th>
                    <th className="px-8 py-5 text-right text-[10px] font-bold text-secondary uppercase tracking-[0.2em] font-sans">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {filteredTransactions.map((t) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={t.id} 
                        className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-slate-500 tracking-tight">
                          {formatDate(t.date)}
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-[#111827] dark:text-white">{t.notes || t.category}</p>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-secondary text-[10px] font-bold uppercase rounded-lg tracking-widest">
                            {t.category}
                          </span>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-right">
                          <span className={cn(
                            "text-sm font-bold tracking-tight",
                            t.type === 'income' ? "text-emerald-600" : "text-rose-600"
                          )}>
                            {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                          </span>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-right">
                          <button 
                            onClick={() => t.id && deleteTransaction(t.id)}
                            className="p-2 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <History className="w-12 h-12 text-slate-200 dark:text-slate-800" />
                          <p className="text-secondary font-medium">No transactions found matching your criteria.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Transaction">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={cn(
                "flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                type === 'expense' ? "bg-white text-rose-600 shadow-sm" : "text-secondary hover:text-slate-900 dark:hover:text-white"
              )}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={cn(
                "flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                type === 'income' ? "bg-white text-emerald-600 shadow-sm" : "text-secondary hover:text-slate-900 dark:hover:text-white"
              )}
            >
              Income
            </button>
          </div>

          <Input 
            label="Monetary Value (₹)" 
            type="number" 
            placeholder="0.00" 
            required 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary uppercase tracking-[0.2em] ml-1">Type of Capital</label>
            <select 
              className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 text-sm font-bold text-[#111827] dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Input 
            label="Transaction Date" 
            type="date" 
            required 
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Input 
            label="Internal Notes" 
            placeholder="Reference or description..." 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all">
            Authorize Transaction
          </Button>
        </form>
      </Modal>
    </div>
  );
};
