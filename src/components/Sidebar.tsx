import React from 'react';
import { 
  LayoutDashboard, 
  ReceiptIndianRupee, 
  PieChart, 
  CalendarClock, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/Button';
import { logout } from '../lib/firebase';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptIndianRupee },
    { id: 'budget', label: 'Budgets', icon: PieChart },
    { id: 'bills', label: 'Bills & Dues', icon: CalendarClock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-100 flex flex-col h-full">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-black text-indigo-950 tracking-tight">SmartFinance</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                isActive 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className={cn('w-5 h-5 transition-colors', isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-900')} />
              <span>{item.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.6)]" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
          onClick={() => logout()}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};
