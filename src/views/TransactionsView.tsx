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
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">History</h1>
          <p className="text-secondary font-medium text-sm">Review and manage your previous money transactions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-11 pr-6 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none w-full shadow-soft transition-all text-slate-900"
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-bold">
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 overflow-x-auto lg:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex lg:flex-col gap-2 pb-4 lg:pb-0 lg:sticky lg:top-8">
            <p className="hidden lg:block px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-4">Categories</p>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "whitespace-nowrap px-6 lg:px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                  selectedCategory === cat 
                    ? "bg-indigo-600 text-white shadow-soft" 
                    : "text-secondary hover:bg-slate-50 bg-white lg:bg-transparent border border-slate-100 lg:border-none"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <Card className="border-none p-0 overflow-hidden" title={`${selectedCategory} List`}>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-8 py-5 text-left text-[10px] font-bold text-secondary uppercase tracking-[0.2em] font-sans">Date</th>
                    <th className="px-8 py-5 text-left text-[10px] font-bold text-secondary uppercase tracking-[0.2em] font-sans">Details</th>
                    <th className="px-8 py-5 text-left text-[10px] font-bold text-secondary uppercase tracking-[0.2em] font-sans">Category</th>
                    <th className="px-8 py-5 text-right text-[10px] font-bold text-secondary uppercase tracking-[0.2em] font-sans">Amount</th>
                    <th className="px-8 py-5 text-right text-[10px] font-bold text-secondary uppercase tracking-[0.2em] font-sans">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence mode="popLayout">
                    {filteredTransactions.map((t) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={t.id} 
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-slate-500 tracking-tight">
                          {formatDate(t.date)}
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-[#111827]">{t.notes || t.category}</p>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <span className="px-3 py-1 bg-slate-100 text-secondary text-[10px] font-bold uppercase rounded-lg tracking-widest">
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
                            className="p-2 text-slate-300 hover:text-rose-600 lg:opacity-0 lg:group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile List View */}
            <div className="md:hidden divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {filteredTransactions.map((t) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={t.id}
                    className="p-6 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-[#111827]">{t.notes || t.category}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] font-bold text-slate-400">
                            {formatDate(t.date)}
                          </span>
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                            {t.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "text-base font-bold tracking-tight",
                          t.type === 'income' ? "text-emerald-600" : "text-rose-600"
                        )}>
                          {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                        </p>
                        <button 
                          onClick={() => t.id && deleteTransaction(t.id)}
                          className="mt-2 text-slate-300 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4 ml-auto" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {(filteredTransactions.length === 0) && (
              <div className="px-8 py-24 text-center">
                <div className="flex flex-col items-center gap-4">
                  <History className="w-12 h-12 text-slate-200" />
                  <p className="text-secondary font-medium">No transactions found matching your criteria.</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Transaction">
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
            <label className="text-xs font-bold text-secondary uppercase tracking-[0.2em] ml-1">Category</label>
            <select 
              className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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

          <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-indigo-100 transition-all">
            Add Transaction
          </Button>
        </form>
      </Modal>
    </div>
  );
};
