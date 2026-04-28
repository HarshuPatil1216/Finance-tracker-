/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signInWithGoogle } from './lib/firebase';
import { getOrCreateUser, updateUserProfile } from './services/db';
import { UserProfile } from './types';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './views/DashboardView';
import { TransactionsView } from './views/TransactionsView';
import { BudgetView } from './views/BudgetView';
import { BillsView } from './views/BillsView';
import { SettingsView } from './views/SettingsView';
import { LandingView } from './views/LandingView';
import { Button } from './components/ui/Button';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    // Initial theme apply from localStorage (fastest)
    const savedTheme = localStorage.getItem('fintrace_theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    // Check if guest session exists
    const guestSession = localStorage.getItem('smartfinance_is_guest');
    if (guestSession === 'true') {
      handleGuestMode();
    }

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      try {
        if (u) {
          setIsGuest(false);
          setUser(u);
          const p = await getOrCreateUser(u);
          setProfile(p);
        } else if (!isGuest) {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [isGuest]);

  useEffect(() => {
    // Apply theme changes from profile
    if (profile?.theme) {
      document.documentElement.classList.toggle('dark', profile.theme === 'dark');
      localStorage.setItem('fintrace_theme', profile.theme);
    }
  }, [profile?.theme]);

  const handleGuestMode = async () => {
    try {
      setIsGuest(true);
      localStorage.setItem('smartfinance_is_guest', 'true');
      const p = await getOrCreateUser(null);
      setProfile(p);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (isGuest) {
      setIsGuest(false);
      localStorage.removeItem('smartfinance_is_guest');
      setProfile(null);
    } else {
      auth.signOut();
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a] gap-6"
      >
        <div className="relative">
          <div className="w-16 h-16 border-2 border-indigo-100 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-[#111827] dark:text-white font-bold tracking-tight">Fintrace</p>
          <p className="text-xs text-secondary font-medium tracking-widest uppercase">Initializing Vault</p>
        </div>
      </motion.div>
    );
  }

  if (!user && !isGuest) {
    return <LandingView onGoogleLogin={signInWithGoogle} onGuestMode={handleGuestMode} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView />;
      case 'transactions': return <TransactionsView />;
      case 'budget': return <BudgetView />;
      case 'bills': return <BillsView />;
      case 'settings': return <SettingsView user={profile} />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100">
      <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={profile} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {isGuest && (
                <div className="mb-6 glass bg-amber-50/50 dark:bg-amber-900/20 border-amber-200/50 dark:border-amber-700/50 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3 text-amber-800 dark:text-amber-400">
                    <Sparkles className="w-5 h-5" />
                    <p className="text-sm font-bold">You are in Guest Mode. Data is stored locally on this device.</p>
                  </div>
                  <Button size="sm" onClick={signInWithGoogle} className="glass dark:glass-dark bg-white/50 dark:bg-slate-800/50 text-amber-900 dark:text-amber-100 font-bold border-amber-300">
                    Save Now
                  </Button>
                </div>
              )}
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
