import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Shield, Smartphone, Globe, LogIn, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface LandingViewProps {
  onGoogleLogin: () => void;
  onGuestMode: () => void;
}

export const LandingView = ({ onGoogleLogin, onGuestMode }: LandingViewProps) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
      {/* Navbar Branding */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 dark:shadow-none">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#111827] dark:text-white">Fintrace</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            Empowering your financial future
          </div>
          <h1 className="heading-hero max-w-4xl mx-auto mb-8">
            Manage your money with <br className="hidden sm:block" />
            <span className="text-indigo-600">absolute clarity.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-secondary mb-12 font-medium leading-relaxed">
            A premium personal finance dashboard designed for the modern professional. 
            Track capital velocity, monitor budgets, and gain AI insights in a clean, light-first experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={onGoogleLogin}
              className="w-full sm:w-auto h-14 px-8 rounded-xl text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02]"
            >
              <LogIn className="w-5 h-5 mr-3" />
              Start Tracking Free
            </Button>
            <button 
              onClick={onGuestMode}
              className="w-full sm:w-auto px-8 py-4 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white font-bold transition-all flex items-center justify-center gap-2 group"
            >
              Explore Guest Mode
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-100 dark:border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<TrendingUp className="w-6 h-6" />}
            title="Real-time Tracking"
            description="Monitor your income and expenses with precise granularity and interactive visualizations."
            delay={0.1}
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6" />}
            title="Private & Secure"
            description="Your data is encrypted and protected. Add extra safety with our integrated 4-digit PIN system."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Globe className="w-6 h-6" />}
            title="Global Access"
            description="Access your workspace from any device. Guest mode data stays local for total privacy."
            delay={0.3}
          />
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-secondary font-medium">© 2026 Fintrace. Built with precision.</p>
        <div className="flex gap-8">
          <a href="#" className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-indigo-600 transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-indigo-600 transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="space-y-4"
  >
    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-[#111827] dark:text-white">{title}</h3>
    <p className="text-secondary leading-relaxed font-medium">{description}</p>
  </motion.div>
);
