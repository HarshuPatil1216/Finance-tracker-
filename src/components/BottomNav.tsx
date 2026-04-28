import React from 'react';
import { 
  LayoutDashboard, 
  History, 
  Wallet, 
  Receipt, 
  Settings 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const BottomNav = ({ activeView, setActiveView }: BottomNavProps) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'transactions', icon: History, label: 'History' },
    { id: 'budget', icon: Wallet, label: 'Budget' },
    { id: 'bills', icon: Receipt, label: 'Bills' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex items-center justify-around px-2 py-3 z-50">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveView(item.id)}
          className={cn(
            "flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all",
            activeView === item.id 
              ? "text-indigo-600" 
              : "text-slate-400"
          )}
        >
          <item.icon className={cn(
            "w-6 h-6",
            activeView === item.id ? "animate-pulse" : ""
          )} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
        </button>
      ))}
    </div>
  );
};
