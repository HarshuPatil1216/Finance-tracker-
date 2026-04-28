import React from 'react';
import { UserProfile } from '../types';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { Button } from './ui/Button';
import { updateUserProfile } from '../services/db';

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

  const toggleTheme = () => {
    if (!user) return;
    const newTheme = user.theme === 'light' ? 'dark' : 'light';
    updateUserProfile(user.uid, { theme: newTheme });
  };

  return (
    <div className="h-20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-400 dark:text-slate-500">{greeting()},</h2>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">{user?.displayName?.split(' ')[0] || 'User'} 👋</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="glass dark:glass-dark rounded-2xl text-slate-600 dark:text-slate-400"
        >
          {user?.theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>

        <Button variant="ghost" size="icon" className="glass dark:glass-dark relative text-slate-500 dark:text-slate-400 rounded-2xl">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white dark:border-slate-800 rounded-full" />
        </Button>
        <div className="h-10 w-px bg-white/10 mx-2" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user?.displayName || 'Guest User'}</p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest mt-1">Smart Track</p>
          </div>
          <img 
            src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'guest'}`} 
            className="w-10 h-10 rounded-2xl border-2 border-white/20 p-0.5 object-cover glass-glow"
            alt="User avatar"
          />
        </div>
      </div>
    </div>
  );
};
