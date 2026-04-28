import React from 'react';
import { UserProfile } from '../types';
import { Bell, Search } from 'lucide-react';
import { Button } from './ui/Button';

interface NavbarProps {
  user: UserProfile | null;
}

export const Navbar = ({ user }: NavbarProps) => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-400">{greeting()},</h2>
          <h2 className="text-lg font-black text-slate-900">{user?.displayName?.split(' ')[0]} 👋</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-slate-500 rounded-2xl">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
        </Button>
        <div className="h-10 w-px bg-slate-100 mx-2" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 leading-none">{user?.displayName}</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">Premium Plan</p>
          </div>
          <img 
            src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
            className="w-10 h-10 rounded-2xl border-2 border-indigo-100 p-0.5 object-cover"
            alt="User avatar"
          />
        </div>
      </div>
    </div>
  );
};
