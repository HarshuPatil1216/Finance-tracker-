import React, { useState } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { 
  ArrowRightLeft, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  AlertCircle,
  Clock,
  User,
  History
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { addMoneyFlow, updateMoneyFlowStatus, deleteMoneyFlow } from '../services/db';
import { auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

export const MoneyFlowTracker = () => {
  const { moneyFlow, loading } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState<'give' | 'take'>('take');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = auth.currentUser?.uid || 'guest';

    await addMoneyFlow({
      userId,
      personName,
      amount: parseFloat(amount),
      dueDate,
      type,
      status: 'pending',
      notes
    });

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setPersonName('');
    setAmount('');
    setDueDate('');
    setNotes('');
  };

  if (loading) return null;

  const pendingFlows = moneyFlow.filter(f => f.status === 'pending');
  const toReceive = pendingFlows.filter(f => f.type === 'take').reduce((acc, curr) => acc + curr.amount, 0);
  const toGive = pendingFlows.filter(f => f.type === 'give').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Receivables</p>
          <p className="text-xl font-bold text-[#111827] dark:text-emerald-400 tracking-tighter">{formatCurrency(toReceive)}</p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-900/10 p-5 rounded-2xl border border-rose-100 dark:border-rose-900/30">
          <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">Payables</p>
          <p className="text-xl font-bold text-[#111827] dark:text-rose-400 tracking-tighter">{formatCurrency(toGive)}</p>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 hide-scrollbar">
        <AnimatePresence mode="popLayout">
          {pendingFlows.map(flow => {
            const isOverdue = new Date(flow.dueDate) < new Date(new Date().setHours(0,0,0,0));
            return (
              <motion.div
                key={flow.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "card-premium p-5 group flex flex-col gap-4",
                  isOverdue ? "border-rose-200 dark:border-rose-900/40" : ""
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-soft",
                      flow.type === 'give' ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                    )}>
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#111827] dark:text-white text-sm tracking-tight">{flow.personName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3 text-secondary" />
                        <p className={cn("text-[10px] font-bold uppercase tracking-widest", isOverdue ? "text-rose-600" : "text-secondary font-medium")}>
                           {isOverdue ? 'Overdue' : `Due ${formatDate(flow.dueDate)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("font-bold text-sm tracking-tight", flow.type === 'give' ? "text-rose-600" : "text-emerald-600")}>
                      {flow.type === 'give' ? '-' : '+'} {formatCurrency(flow.amount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">{flow.type === 'take' ? 'Receivable' : 'Debt'}</span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => flow.id && updateMoneyFlowStatus(flow.id, 'settled')}
                      className="h-8 px-3 bg-emerald-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors"
                    >
                      Settle
                    </button>
                    <button 
                      onClick={() => flow.id && deleteMoneyFlow(flow.id)}
                      className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {pendingFlows.length === 0 && (
          <div className="py-20 text-center card-premium border-dashed border-2 flex flex-col items-center">
            <History className="w-12 h-12 text-slate-200 dark:text-slate-800 mb-4" />
            <p className="text-secondary font-medium px-6">Balance achieved! No pending payables or receivables found.</p>
          </div>
        )}
      </div>

      <Button onClick={() => setIsModalOpen(true)} className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none">
        <Plus className="w-4 h-4 mr-2" />
        New Entry
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Audit Flow Entry">
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType('take')}
              className={cn(
                "flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                type === 'take' ? "bg-white text-emerald-600 shadow-sm" : "text-secondary hover:text-slate-900 dark:hover:text-white"
              )}
            >
              Take (Receivable)
            </button>
            <button
              type="button"
              onClick={() => setType('give')}
              className={cn(
                "flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                type === 'give' ? "bg-white text-rose-600 shadow-sm" : "text-secondary hover:text-slate-900 dark:hover:text-white"
              )}
            >
              Give (Payable)
            </button>
          </div>

          <Input 
            label="Internal Counterparty" 
            placeholder="Entity or individual name..." 
            required 
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
          />
          
          <Input 
            label="Monetary Allocation (₹)" 
            type="number" 
            placeholder="0.00" 
            required 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Input 
            label="Maturity Date" 
            type="date" 
            required 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <Input 
            label="Protocol Notes" 
            placeholder="Optional context for this flow..." 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-indigo-100 transition-all">
            Authorized Entry
          </Button>
        </form>
      </Modal>
    </div>
  );
};
