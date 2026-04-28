import React, { useState, useEffect } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Card } from '../components/ui/Card';
import { 
  Plus, 
  PieChart as PieIcon,
  History,
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownLeft,
  BrainCircuit,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { getFinancialInsights } from '../services/ai';
import { motion } from 'motion/react';
import { MoneyFlowTracker } from '../components/MoneyFlowTracker';
import { Button } from '../components/ui/Button';

export const DashboardView = () => {
  const { summary, transactions, loading } = useFinance();
  const [insights, setInsights] = useState<string>("Analyzing your wealth patterns...");

  useEffect(() => {
    if (transactions.length > 0) {
      getFinancialInsights(transactions, []).then(setInsights);
    }
  }, [transactions]);

  if (loading) return null;

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4'];

  // Prepared data for spending trend
  const trendData = transactions.slice(-7).reverse().map(t => ({
    date: formatDate(t.date),
    amount: t.amount,
    type: t.type
  }));

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      {/* Refined Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-premium p-6 flex flex-col justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Total Income</p>
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
            <h2 className="text-2xl font-bold text-[#111827] dark:text-white tracking-tight">{formatCurrency(summary.totalIncome)}</h2>
          </div>
        </div>
        <div className="card-premium p-6 flex flex-col justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Total Expenses</p>
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="w-5 h-5 text-rose-500" />
            <h2 className="text-2xl font-bold text-[#111827] dark:text-white tracking-tight">{formatCurrency(summary.totalExpenses)}</h2>
          </div>
        </div>
        <Card className="border-none" title="Allocation Strategy">
           <div className="h-12 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary.categorySpending.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  innerRadius={10}
                  outerRadius={20}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {summary.categorySpending.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Main Grid: Charts & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Trend & Money Flow */}
        <div className="xl:col-span-2 space-y-8">
           <Card title="Spending Trend" headerAction={<TrendingUp className="w-5 h-5 text-indigo-500" />}>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-[#111827] dark:text-white flex items-center gap-2 tracking-tight">
                <History className="w-5 h-5 text-indigo-500" />
                Recent Activity
              </h2>
            </div>
            <div className="space-y-3">
              {summary.recentTransactions.map((t, i) => (
                <div 
                  key={t.id} 
                  className="card-premium p-4 flex items-center justify-between group hover:border-indigo-100 dark:hover:border-indigo-900"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm",
                      t.type === 'income' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-rose-50 dark:bg-rose-900/20 text-rose-600"
                    )}>
                      {t.category.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-[#111827] dark:text-white text-sm">{t.category}</p>
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-wider">{formatDate(t.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("font-bold text-sm tracking-tight", t.type === 'income' ? "text-emerald-600" : "text-[#111827] dark:text-white")}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Flow & AI */}
        <div className="xl:col-span-1 space-y-8">
           <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-[#111827] dark:text-white flex items-center gap-2 tracking-tight">
                <ArrowRightLeft className="w-5 h-5 text-indigo-500" />
                Capital Flow
              </h2>
            </div>
            <MoneyFlowTracker />
          </div>

          <Card className="bg-indigo-600 dark:bg-indigo-600 text-white border-none py-8" title="AI Insight Pulse">
             <div className="relative z-10">
              <div className="prose prose-sm prose-invert leading-relaxed font-medium">
                 {insights.split('\n').map((line, i) => (
                  <p key={i} className="mb-3 last:mb-0 flex items-start gap-2 text-indigo-50">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0" />
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
