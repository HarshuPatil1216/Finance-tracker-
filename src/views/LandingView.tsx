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
    <div className="min-h-screen bg-[#f8fafc] selection:bg-indigo-100">
      {/* Navbar Branding */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#111827]">Fintrace</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Simple money tracking for you
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#111827] leading-[1.1] mb-8 tracking-tight">
              Manage your money with <br className="hidden sm:block" />
              <span className="text-indigo-600">complete clarity.</span>
            </h1>
            <p className="max-w-2xl mx-auto lg:mx-0 text-lg text-secondary mb-12 font-medium leading-relaxed">
              Fintrace is a simple and clean app to track your expenses, 
              manage budgets, and see where your money goes. No complex terms, just clear results.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button 
                onClick={onGoogleLogin}
                className="w-full sm:w-auto h-14 px-8 rounded-xl text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02]"
              >
                <LogIn className="w-5 h-5 mr-3" />
                Get Started for Free
              </Button>
              <button 
                onClick={onGuestMode}
                className="w-full sm:w-auto px-8 py-4 text-slate-600 hover:text-indigo-600 font-bold transition-all flex items-center justify-center gap-2 group"
              >
                Try as Guest
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full max-w-2xl"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600/5 blur-3xl rounded-full" />
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop" 
                alt="Financial Dashboard" 
                className="relative rounded-[2rem] shadow-2xl border-4 border-white object-cover aspect-video"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -right-6 md:-right-10 bg-white p-6 rounded-3xl shadow-xl hidden md:block border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Growth Rate</p>
                    <p className="text-xl font-bold text-[#111827]">+24.5%</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<TrendingUp className="w-6 h-6" />}
            title="Income & Expenses"
            description="Easily track daily spends and see where you can save more money."
            delay={0.1}
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6" />}
            title="Safe & Simple"
            description="Your data is secure and private. No complex setup or confusion."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Globe className="w-6 h-6" />}
            title="Use Anywhere"
            description="Open Fintrace on any device and keep your finances in your pocket."
            delay={0.3}
          />
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-secondary font-medium">© 2026 Fintrace. Simple Money Tracker.</p>
        <div className="flex gap-8">
          <a href="#" className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-indigo-600 transition-colors">Privacy</a>
          <a href="#" className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-indigo-600 transition-colors">Terms</a>
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
    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-[#111827]">{title}</h3>
    <p className="text-secondary leading-relaxed font-medium">{description}</p>
  </motion.div>
);
