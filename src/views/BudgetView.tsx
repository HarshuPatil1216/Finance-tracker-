import React, { useState } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Plus, PieChart, TrendingDown, AlertCircle } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { setBudget } from '../services/db';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';

const CATEGORIES = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Other'];

export const BudgetView = () => {
  const { budgets, summary, loading } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    await setBudget({
      userId: auth.currentUser.uid,
      category: selectedCategory,
      amount: parseFloat(amount),
      month,
    });

    setIsModalOpen(false);
    setAmount('');
  };

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Budgets</h1>
          <p className="text-slate-500 font-medium text-sm">Plan your spending and save more.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Set Budget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map(budget => {
          const spent = summary.categorySpending.find(c => c.category === budget.category)?.amount || 0;
          const percent = Math.min((spent / budget.amount) * 100, 100);
          const remaining = budget.amount - spent;
          const isOver = spent > budget.amount;

          return (
            <Card key={budget.id} className="relative overflow-hidden group">
              {isOver && (
                <div className="absolute top-0 right-0 p-2">
                  <div className="bg-rose-500 text-white p-1 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                  <PieChart className="w-5 h-5" />
                </div>
                <h3 className="font-black text-slate-900">{budget.category}</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-0.5">Budget</p>
                    <p className="text-xl font-black text-slate-900">{formatCurrency(budget.amount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-0.5">Remaining</p>
                    <p className={cn("text-xl font-black", isOver ? "text-rose-600" : "text-emerald-600")}>
                      {formatCurrency(remaining)}
                    </p>
                  </div>
                </div>

                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      isOver ? "bg-rose-500" : percent > 80 ? "bg-amber-500" : "bg-indigo-600"
                    )}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                  <span className={cn(isOver ? "text-rose-500" : "text-slate-400")}>
                    {percent.toFixed(0)}% Used
                  </span>
                  <span className="text-slate-400">{budget.month}</span>
                </div>
              </div>
            </Card>
          );
        })}

        {budgets.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-200">
              <PieChart className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No budgets set</h2>
            <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">Clear financial goals start with a budget. Set one for your favorite category today.</p>
            <Button onClick={() => setIsModalOpen(true)}>Create Your First Budget</Button>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Set Category Budget">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-3 rounded-xl text-[10px] font-bold transition-all border uppercase tracking-wider",
                    selectedCategory === cat 
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
            label="Monthly Limit" 
            type="number" 
            placeholder="0.00" 
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Input 
            label="Month" 
            type="month" 
            required
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />

          <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold">
            Set Budget
          </Button>
        </form>
      </Modal>
    </div>
  );
};
