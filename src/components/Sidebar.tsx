import React from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Sparkles,
  History,
  Wallet,
  Receipt,
  ArrowRightLeft
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onLogout: () => void;
}

export const Sidebar = ({ activeView, setActiveView, onLogout }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'All Transactions', icon: History },
    { id: 'budget', label: 'Budget Plan', icon: Wallet },
    { id: 'bills', label: 'Bill Payments', icon: Receipt },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="hidden lg:flex w-68 bg-white border-r border-slate-100 flex-col h-screen transition-all duration-300">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">Fintrace</h1>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none mt-1">Money Tracker</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1.5">
        <p className="px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-4">Main Menu</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 group",
              activeView === item.id 
                ? "bg-indigo-600 text-white shadow-indigo-100" 
                : "text-[#6b7280] hover:bg-slate-50 hover:text-indigo-600"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              activeView === item.id ? "text-white" : "text-slate-400 group-hover:text-indigo-600"
            )} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-bold text-[#6b7280] hover:text-rose-600 hover:bg-rose-50 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </div>
  );
};
