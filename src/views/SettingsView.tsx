import React from 'react';
import { UserProfile } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useFinance } from '../hooks/useFinance';
import { 
  Download, 
  FileText, 
  Table as TableIcon, 
  ShieldCheck, 
  Moon, 
  Sun,
  Palette,
  CreditCard
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { formatCurrency, formatDate } from '../lib/utils';

interface SettingsViewProps {
  user: UserProfile | null;
}

export const SettingsView = ({ user }: SettingsViewProps) => {
  const { transactions, budgets, bills } = useFinance();

  const exportToCSV = () => {
    const csvData = transactions.map(t => ({
      Date: t.date,
      Type: t.type,
      Amount: t.amount,
      Category: t.category,
      Notes: t.notes || ''
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF() as any;
    doc.text('Smart Personal Finance Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
    doc.text(`User: ${user?.displayName}`, 14, 28);

    const tableData = transactions.map(t => [
      formatDate(t.date),
      t.type.toUpperCase(),
      t.category,
      formatCurrency(t.amount)
    ]);

    doc.autoTable({
      head: [['Date', 'Type', 'Category', 'Amount']],
      body: tableData,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save(`finance_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 font-medium text-sm">Personalize your experience and manage data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Account Profile">
          <div className="flex items-center gap-6 mb-8">
            <img 
              src={user?.photoURL} 
              className="w-20 h-20 rounded-[2.5rem] border-4 border-white shadow-xl shadow-indigo-100" 
              alt="Profile"
            />
            <div>
              <h2 className="text-xl font-black text-slate-900">{user?.displayName}</h2>
              <p className="text-slate-500 text-sm font-medium">{user?.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded-lg">Pro User</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-lg">Verified</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 text-slate-600">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-bold">Biometric Security</span>
              </div>
              <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 text-slate-600">
                <CreditCard className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-bold">Currency: USD ($)</span>
              </div>
              <button className="text-xs font-black text-indigo-600 uppercase tracking-wider hover:underline">Change</button>
            </div>
          </div>
        </Card>

        <div className="space-y-8">
          <Card title="Export Workspace">
            <p className="text-slate-500 text-sm mb-6 font-medium">Download your transaction history and budget analysis in your preferred format.</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={exportToCSV}
                className="flex flex-col items-center justify-center p-6 bg-emerald-50 border border-emerald-100 rounded-3xl hover:bg-emerald-100 transition-all group"
              >
                <TableIcon className="w-8 h-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black text-emerald-950 uppercase tracking-tighter">Export CSV</span>
              </button>
              <button 
                onClick={exportToPDF}
                className="flex flex-col items-center justify-center p-6 bg-indigo-50 border border-indigo-100 rounded-3xl hover:bg-indigo-100 transition-all group"
              >
                <FileText className="w-8 h-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black text-indigo-950 uppercase tracking-tighter">Export PDF</span>
              </button>
            </div>
          </Card>

          <Card title="Appearance">
            <div className="flex items-center justify-between p-1.5 bg-slate-100 rounded-2xl">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-indigo-950 rounded-xl shadow-sm">
                <Sun className="w-4 h-4" />
                <span className="text-xs font-bold">Light</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 text-slate-500">
                <Moon className="w-4 h-4" />
                <span className="text-xs font-bold">Dark</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
