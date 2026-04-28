import React, { useState } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { 
  Target, 
  Plus, 
  CircleDollarSign, 
  PieChart as PieIcon,
  AlertTriangle,
  Wallet
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { setBudget } from '../services/db';
import { auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

const categories = [
  'Food & Drinks',
  'Shopping',
  'Transport',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Investment',
  'Others'
];

export const BudgetView = () => {
  const { budgets, summary } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Drinks');

  const currentMonth = new Date().toISOString().slice(0, 7);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = auth.currentUser?.uid || 'guest';
    
    await setBudget({
      userId,
      amount: parseFloat(amount),
      category,
      month: currentMonth
    });

    setIsModalOpen(false);
    setAmount('');
  };

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">CapVaults</h1>
          <p className="text-secondary font-medium text-sm">Designate spending thresholds for strategic capital management.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none font-bold">
          <Plus className="w-4 h-4 mr-2" />
          Initialize Vault
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {budgets.map((budget) => {
            const spent = summary.categorySpending.find(c => c.category === budget.category)?.amount || 0;
            const percent = (spent / budget.amount) * 100;
            const isExceeded = percent >= 100;
            const isWarning = percent > 85;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                key={budget.id}
              >
                <Card 
                  className="border-none hover:shadow-medium transition-shadow group h-full flex flex-col"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-soft",
                      isExceeded ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600" : isWarning ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600" : "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600"
                    )}>
                      {isExceeded ? <AlertTriangle className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-1">Cap Limit</p>
                      <p className="text-xl font-bold text-[#111827] dark:text-white tracking-tighter">{formatCurrency(budget.amount)}</p>
                    </div>
                  </div>

                  <div className="mb-8 flex-1">
                    <h3 className="text-lg font-bold text-[#111827] dark:text-white mb-2">{budget.category}</h3>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-lg uppercase tracking-widest",
                        isExceeded ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-secondary"
                      )}>
                        {isExceeded ? 'Exceeded' : 'Strategic'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-secondary">
                        Spent: <span className={cn(isExceeded ? "text-rose-600" : "text-[#111827] dark:text-white")}>{formatCurrency(spent)}</span>
                      </span>
                      <span className="text-xs font-bold text-indigo-600">{Math.round(percent)}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percent, 100)}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={cn(
                          "h-full rounded-full transition-colors",
                          isExceeded ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-indigo-600"
                        )}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {budgets.length === 0 && (
          <div className="lg:col-span-3 py-24 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[2.5rem]">
            <div className="flex flex-col items-center gap-4">
               <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] dark:text-white">Empty Vault System</h3>
              <p className="text-secondary max-w-sm mx-auto text-sm font-medium leading-relaxed">
                Initialize your first capital vault to begin strategic tracking of category-specific thresholds.
              </p>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="mt-6 h-12 bg-indigo-600 hover:bg-indigo-700 px-8 rounded-xl font-bold"
              >
                Initialize First Vault
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Initialize CapVault">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-[0.2em] ml-1">Asset Category</label>
            <select 
              className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-6 text-sm font-bold text-[#111827] dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Input 
            label="Monetary Limit (₹)" 
            type="number" 
            placeholder="0.00" 
            required 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/20 flex gap-4">
            <CircleDollarSign className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs text-[#111827] dark:text-slate-400 leading-relaxed font-medium">
              Caps help enforce financial discipline. Strategic alerts are triggered once consumption reaches 85% of the designated threshold.
            </p>
          </div>

          <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-indigo-100 transition-all">
            Authorized Initialization
          </Button>
        </form>
      </Modal>
    </div>
  );
};
