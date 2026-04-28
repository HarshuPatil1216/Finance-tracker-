import React, { useState } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Plus, Calendar, CheckCircle2, Trash2, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { addBill, updateBillStatus, deleteBill } from '../services/db';
import { auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

export const BillsView = () => {
  const { bills, loading } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    await addBill({
      userId: auth.currentUser.uid,
      name,
      amount: parseFloat(amount),
      dueDate,
      status: 'unpaid',
    });

    setIsModalOpen(false);
    setName('');
    setAmount('');
    setDueDate('');
  };

  if (loading) return null;

  const unpaidBills = bills.filter(b => b.status === 'unpaid');
  const paidBills = bills.filter(b => b.status === 'paid');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bills & Dues</h1>
          <p className="text-slate-500 font-medium text-sm">Never miss a payment again.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Bill
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-black text-slate-900">Upcoming Payments</h2>
          </div>
          <div className="space-y-4">
            <AnimatePresence>
              {unpaidBills.map(bill => {
                const isUrgent = new Date(bill.dueDate).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000;
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    key={bill.id}
                  >
                    <Card className={cn(
                      "group border-l-4 transition-all",
                      isUrgent ? "border-l-rose-500 bg-rose-50/10" : "border-l-indigo-400"
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center",
                            isUrgent ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-600"
                          )}>
                            <Calendar className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-lg uppercase tracking-tight">{bill.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-sm font-bold text-slate-500">{formatDate(bill.dueDate)}</p>
                              {isUrgent && (
                                <span className="flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded uppercase">
                                  <AlertCircle className="w-3 h-3" /> Urgent
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <p className="text-2xl font-black text-slate-900">{formatCurrency(bill.amount)}</p>
                          </div>
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              size="sm" 
                              className="rounded-lg h-8 bg-emerald-500 hover:bg-emerald-600"
                              onClick={() => bill.id && updateBillStatus(bill.id, 'paid')}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1.5" />
                              Pay
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="rounded-lg h-8 text-rose-400 hover:bg-rose-50"
                              onClick={() => bill.id && deleteBill(bill.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1.5" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {unpaidBills.length === 0 && (
              <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
                <p className="text-slate-500 font-bold text-lg">No pending bills!</p>
                <p className="text-slate-400 text-sm">Great job staying on top of your payments.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-black text-slate-900">Paid Bills</h2>
          </div>
          <div className="space-y-3">
            {paidBills.map(bill => (
              <div key={bill.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{bill.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Paid on {formatDate(bill.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-400 line-through text-sm">{formatCurrency(bill.amount)}</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-slate-300 hover:text-red-400"
                    onClick={() => bill.id && deleteBill(bill.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            {paidBills.length === 0 && (
              <p className="text-center py-10 text-slate-400 font-medium text-sm">History will appear here after payments.</p>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Upcoming Bill">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Bill Name" 
            placeholder="e.g. Netflix, Electricity, Rent" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input 
            label="Amount Due" 
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
          <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold mt-4">
            Track Bill
          </Button>
        </form>
      </Modal>
    </div>
  );
};
