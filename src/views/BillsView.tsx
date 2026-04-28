import React, { useState } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { 
  Plus, 
  Receipt, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Bell
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { addBill, updateBillStatus, deleteBill } from '../services/db';
import { auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

export const BillsView = () => {
  const { bills } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = auth.currentUser?.uid || 'guest';
    
    await addBill({
      userId,
      name,
      amount: parseFloat(amount),
      dueDate,
      status: 'pending'
    });

    setIsModalOpen(false);
    setName('');
    setAmount('');
    setDueDate('');
  };

  const pendingBills = bills.filter(b => b.status === 'pending');
  const settledBills = bills.filter(b => b.status === 'paid');

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">Upcoming Bills</h1>
          <p className="text-secondary font-medium text-sm">Keep track of your monthly payments and dues.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 font-bold">
          <Plus className="w-4 h-4 mr-2" />
          Add New Bill
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Pending Bills
            </h2>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-lg tracking-widest border border-indigo-100/50">
              {pendingBills.length} Active
            </span>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {pendingBills.map((bill) => {
                const isOverdue = new Date(bill.dueDate) < new Date(new Date().setHours(0,0,0,0));
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={bill.id}
                    className="card-premium p-6 group hover:border-indigo-100"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-soft shrink-0",
                          isOverdue ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"
                        )}>
                          {isOverdue ? <AlertCircle className="w-6 h-6" /> : <Receipt className="w-6 h-6" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#111827]">{bill.name}</h3>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center gap-1.5 text-secondary text-xs font-medium">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(bill.dueDate)}
                            </div>
                            {isOverdue && (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded leading-none">Overdue</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-50">
                        <div className="text-left sm:text-right">
                          <p className="text-lg font-bold text-[#111827] tracking-tight">{formatCurrency(bill.amount)}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Due Amount</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => bill.id && updateBillStatus(bill.id, 'paid')}
                            className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-soft"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => bill.id && deleteBill(bill.id)}
                            className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-soft"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {pendingBills.length === 0 && (
              <div className="py-20 text-center card-premium border-dashed border-2 flex flex-col items-center">
                <Bell className="w-12 h-12 text-slate-200 mb-4" />
                <p className="text-secondary font-medium">No pending bills for now!</p>
              </div>
            )}
          </div>
        </div>

        {/* Settled Ledger */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Paid History
            </h2>
          </div>

          <Card className="border-none p-0 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {settledBills.map((bill) => (
                <div key={bill.id} className="p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-soft">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#111827]">{bill.name}</p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Settle</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-400 line-through tracking-tight">{formatCurrency(bill.amount)}</p>
                  </div>
                </div>
              ))}
              {settledBills.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-secondary text-xs font-medium">No paid bills yet.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Bill">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Input 
            label="Bill Name / Creditor" 
            placeholder="e.g. Electricity, Rent..." 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input 
            label="Amount (₹)" 
            type="number" 
            placeholder="0.00" 
            required 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input 
            label="Due Date" 
            type="date" 
            required 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-100/50 flex gap-4">
            <Bell className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-xs text-[#111827] leading-relaxed font-medium">
              We will remind you before the due date so you don't miss it.
            </p>
          </div>

          <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-indigo-100 transition-all">
            Save Bill
          </Button>
        </form>
      </Modal>
    </div>
  );
};
