import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useFinance } from '../hooks/useFinance';
import { 
  FileText, 
  Table as TableIcon, 
  Moon, 
  Sun,
  Palette,
  CreditCard,
  CheckCircle2,
  User as UserIcon
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { updateUserProfile } from '../services/db';

interface SettingsViewProps {
  user: UserProfile | null;
}

export const SettingsView = ({ user }: SettingsViewProps) => {
  const { transactions, summary } = useFinance();
  const [isExporting, setIsExporting] = useState(false);

  const toggleTheme = (theme: 'light' | 'dark') => {
    // Save to localStorage immediately for instant effect/persistence on boot
    localStorage.setItem('fintrace_theme', theme);
    
    if (!user || user.uid === 'guest') {
       const gd = JSON.parse(localStorage.getItem('smartfinance_guest_data') || '{}');
       gd.profile = { ...gd.profile, theme };
       localStorage.setItem('smartfinance_guest_data', JSON.stringify(gd));
       if (theme === 'dark') {
         document.documentElement.classList.add('dark');
       } else {
         document.documentElement.classList.remove('dark');
       }
       return;
    }
    updateUserProfile(user.uid, { theme });
  };

  const exportToCSV = () => {
    const csvData = transactions.map(t => ({
      Date: t.date,
      Type: t.type.toUpperCase(),
      Amount: t.amount,
      Category: t.category,
      Notes: t.notes || ''
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Fintrace_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };

  const exportToPDF = () => {
    setIsExporting(true);
    const doc = new jsPDF() as any;
    
    // Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('FINTRACE STATEMENT', 14, 25);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`User: ${user?.displayName || 'Guest'}`, 14, 33);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 145, 33);

    // Summary Section
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Financial Snapshot', 14, 55);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Net Worth: ${formatCurrency(summary.totalBalance)}`, 14, 65);
    doc.text(`Total Income: ${formatCurrency(summary.totalIncome)}`, 14, 72);
    doc.text(`Total Expense: ${formatCurrency(summary.totalExpenses)}`, 14, 79);

    const tableData = transactions.map(t => [
      formatDate(t.date),
      t.type.toUpperCase(),
      t.category,
      formatCurrency(t.amount)
    ]);

    doc.autoTable({
      head: [['Date', 'Type', 'Category', 'Amount']],
      body: tableData,
      startY: 90,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 4 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { top: 90 }
    });

    doc.save(`Fintrace_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    setIsExporting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">System Configuration</h1>
          <p className="text-secondary font-medium text-sm">Personalize workspace and security protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card className="border-none">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <img 
                  src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'guest'}`} 
                  className="w-24 h-24 rounded-3xl border-4 border-slate-50 dark:border-white/5 shadow-soft" 
                  alt="Profile"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white border-2 border-white dark:border-slate-900">
                  <UserIcon className="w-4 h-4" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-[#111827] dark:text-white">{user?.displayName || 'Guest User'}</h2>
              <p className="text-secondary text-sm font-medium mb-4">{user?.email || 'Local Storage Session'}</p>
              
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase rounded-lg tracking-widest border border-indigo-100/50 dark:border-indigo-800/30">Verified</span>
                <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase rounded-lg tracking-widest border border-emerald-100/50 dark:border-emerald-800/30">Active</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none" title="Data & Operations">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={exportToCSV}
                className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
              >
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <TableIcon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#111827] dark:text-white">Excel/CSV</p>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Spreadsheet Sync</p>
                </div>
              </button>
              
              <button 
                onClick={exportToPDF}
                disabled={isExporting}
                className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group disabled:opacity-50"
              >
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#111827] dark:text-white">PDF Report</p>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Financial Archive</p>
                </div>
              </button>
            </div>
          </Card>

          <Card className="border-none" title="Workspace Experience">
             <div className="space-y-6">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-bold text-[#111827] dark:text-slate-300">Theme Mode</span>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button 
                    onClick={() => toggleTheme('light')}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                      user?.theme === 'light' || !user?.theme ? "bg-white text-indigo-600 shadow-sm" : "text-secondary hover:text-indigo-600"
                    )}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => toggleTheme('dark')}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                      user?.theme === 'dark' ? "bg-slate-700 text-white shadow-sm" : "text-secondary hover:text-indigo-600"
                    )}
                  >
                    Dark
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 border-t border-slate-100 dark:border-white/5 pt-6">
                 <div className="flex items-center gap-3">
                  <Palette className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-bold text-[#111827] dark:text-slate-300">Accent Color</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-800 ring-2 ring-indigo-100 dark:ring-indigo-900/40 cursor-pointer" />
                  <div className="w-5 h-5 rounded-full bg-emerald-600 cursor-not-allowed opacity-30" />
                  <div className="w-5 h-5 rounded-full bg-rose-600 cursor-not-allowed opacity-30" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
