import React, { useState, useEffect } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet,
  TrendingUp,
  BrainCircuit,
  Clock
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { getFinancialInsights } from '../services/ai';
import { motion } from 'motion/react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const DashboardView = () => {
  const { summary, budgets, bills, transactions, loading } = useFinance();
  const [insights, setInsights] = useState<string>("Analyzing your finances...");

  useEffect(() => {
    if (transactions.length > 0) {
      getFinancialInsights(transactions, budgets).then(setInsights);
    }
  }, [transactions, budgets]);

  if (loading) return null;

  return (
    <div className="space-y-8 pb-10">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="bg-indigo-600 text-white border-none shadow-indigo-200">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-xl">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">Overall Balance</span>
            </div>
            <h2 className="text-4xl font-black mb-1">{formatCurrency(summary.totalBalance)}</h2>
            <p className="text-white/70 text-sm font-medium">Safe to spend this month</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Monthly Income</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-1">{formatCurrency(summary.totalIncome)}</h2>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>+12% from last month</span>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
                <ArrowDownLeft className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">Monthly Expense</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-1">{formatCurrency(summary.totalExpenses)}</h2>
            <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
              <span>85% of budget used</span>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Spending Chart */}
        <div className="lg:col-span-2 space-y-8">
          <Card title="Spending Trends" subtitle="Daily expense visualization">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transactions.slice().reverse()}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: number) => formatCurrency(val)}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#4f46e5" 
                    strokeWidth={4} 
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card title="AI Smart Insights" headerAction={<BrainCircuit className="w-5 h-5 text-indigo-600" />}>
              <div className="prose prose-sm text-slate-600 leading-relaxed font-medium">
                {insights.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                    {line}
                  </p>
                ))}
              </div>
            </Card>

            <Card title="Upcoming Dues" headerAction={<Clock className="w-5 h-5 text-slate-400" />}>
              <div className="space-y-4">
                {bills.filter(b => b.status === 'unpaid').slice(0, 3).map(bill => (
                  <div key={bill.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 group hover:border-indigo-100 transition-colors">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{bill.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Due {formatDate(bill.dueDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-rose-600 text-sm">{formatCurrency(bill.amount)}</p>
                      <button className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-wider">Pay Now</button>
                    </div>
                  </div>
                ))}
                {bills.filter(b => b.status === 'unpaid').length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-slate-400 text-sm font-medium">No pending bills. You're all caught up! 🎉</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <Card title="Category Breakdown">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.categorySpending}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="amount"
                  >
                    {summary.categorySpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {summary.categorySpending.slice(0, 4).map((entry, index) => (
                <div key={entry.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs font-bold text-slate-600">{entry.category}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{formatCurrency(entry.amount)}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Budget Tracking">
            <div className="space-y-5">
              {budgets.slice(0, 3).map(budget => {
                const spent = summary.categorySpending.find(c => c.category === budget.category)?.amount || 0;
                const percent = Math.min((spent / budget.amount) * 100, 100);
                const isWarning = percent > 80;

                return (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-slate-700">{budget.category}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          percent >= 100 ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-indigo-600"
                        )}
                      />
                    </div>
                  </div>
                );
              })}
              {budgets.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-slate-400 text-xs mb-3">No budgets set for this month</p>
                  <Button variant="outline" size="sm" className="rounded-xl w-full">Define Budget</Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
