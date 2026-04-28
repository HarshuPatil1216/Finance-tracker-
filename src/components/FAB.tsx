import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface FABProps {
  onClick: () => void;
}

export const FAB = ({ onClick }: FABProps) => {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="lg:hidden fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200 z-40"
      aria-label="Add Transaction"
    >
      <Plus className="w-8 h-8" />
    </motion.button>
  );
};
