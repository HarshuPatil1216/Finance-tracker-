import React, { useState } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownLeft,
  ChevronDown,
  Download
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { addTransaction, deleteTransaction } from '../services/db';
import { auth } from '../lib/firebase';
import { TransactionType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Salary', 'Investment', 'Other'];

export const TransactionsView = () => {
  const { transactions, loading } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  
  // Form State
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    await addTransaction({
      userId: auth.currentUser.uid,
      type,
      amount: parseFloat(amount),
      category,
      date,
      notes,
    });

    setIsModalOpen(false);
    setAmount('');
    setNotes('');
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (t.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Transactions</h1>
          <p className="text-slate-500 font-medium text-sm">Keep track of every penny with ease.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none">
            <Plus className="w-5 h-5 mr-2" />
            Add Record
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl">
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Card className="px-0">
        <div className="px-6 pb-4 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search category or notes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50/50 border-none rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {(['all', 'income', 'expense'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all",
                  filterType === t 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest font-black text-slate-400">
                <th className="px-6 py-4">Transaction</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {filteredTransactions.map((t) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={t.id} 
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                          t.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>
                          {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{t.notes || t.category}</p>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{t.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                      {formatDate(t.date)}
                    </td>
                    <td className={cn(
                      "px-6 py-4 text-right font-black text-sm",
                      t.type === 'income' ? "text-emerald-600" : "text-slate-900"
                    )}>
                      {t.type === 'expense' && '-'} {formatCurrency(t.amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-300 hover:text-red-500 rounded-xl"
                        onClick={() => t.id && deleteTransaction(t.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="py-20 text-center">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No transactions found.</p>
              <p className="text-slate-400 text-xs mt-1">Try adjusting your filters or add a new record.</p>
            </div>
          )}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transaction">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={cn(
                "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                type === 'expense' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={cn(
                "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                type === 'income' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
            >
              Income
            </button>
          </div>

          <Input 
            label="Amount" 
            type="number" 
            placeholder="0.00" 
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                    category === cat 
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                      : "bg-white border-slate-200 text-slate-500 hover:border-indigo-400"
                  )}
                >
                  {cat}
                </button>
              ))}
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
            label="Notes (Optional)" 
            placeholder="What was this for?" 
            multiline
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold">
            Save Transaction
          </Button>
        </form>
      </Modal>
    </div>
  );
};
