import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Delete, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import bcrypt from 'bcryptjs';

interface PinLockProps {
  storedPin: string;
  onSuccess: (pin?: string) => void;
  title?: string;
  isSetting?: boolean;
}

export const PinLock = ({ storedPin, onSuccess, title = "Authorized Access Only", isSetting = false }: PinLockProps) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleNumber = async (n: number) => {
    if (pin.length < 4 && !isVerifying) {
      const newPin = pin + n;
      setPin(newPin);
      
      if (newPin.length === 4) {
        setIsVerifying(true);
        if (isSetting) {
          // For setting, we hash the PIN in the parent component (SettingsView)
          // but we can pass the plain PIN back to the parent.
          onSuccess(newPin);
          setIsVerifying(false);
        } else {
          try {
            const isValid = await bcrypt.compare(newPin, storedPin);
            if (isValid) {
              onSuccess();
            } else {
              setError(true);
              setTimeout(() => {
                setPin('');
                setError(false);
              }, 600);
            }
          } catch (err) {
            console.error("PIN verification error:", err);
            setError(true);
            setPin('');
          } finally {
            setIsVerifying(false);
          }
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-4",
      !isSetting ? "fixed inset-0 z-50 bg-[#f8fafc] dark:bg-[#0f172a]" : ""
    )}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "card-premium p-10 w-full max-w-sm text-center border-none shadow-medium",
          isSetting ? "shadow-none bg-transparent dark:bg-transparent" : ""
        )}
      >
        <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-indigo-100 dark:shadow-none">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-2 tracking-tight">{title}</h2>
        <p className="text-xs text-secondary mb-10 font-bold uppercase tracking-widest leading-relaxed">
          {isSetting ? "Define 4-digit security code" : "Enter PIN to access vault"}
        </p>

        <div className="flex justify-center gap-5 mb-12">
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              className={cn(
                "w-4 h-4 rounded-full border-2 transition-all duration-300",
                pin.length > i 
                  ? "bg-indigo-600 border-indigo-600 scale-125" 
                  : "border-slate-200 dark:border-slate-800"
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => handleNumber(n)}
              className="h-16 w-16 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 text-lg font-bold text-[#111827] dark:text-white active:scale-95 hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-soft"
            >
              {n}
            </button>
          ))}
          <div className="flex items-center justify-center">
             <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
          <button
            type="button"
            onClick={() => handleNumber(0)}
            className="h-16 w-16 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 text-lg font-bold text-[#111827] dark:text-white active:scale-95 hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-soft"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-16 w-16 flex items-center justify-center rounded-2xl text-secondary hover:text-rose-600 active:scale-95 transition-all"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
