import React from 'react';
import { motion } from 'framer-motion';

interface DividerProps {
  text?: string;
}

export const Divider: React.FC<DividerProps> = ({ text = 'or' }) => {
  return (
    <div className="relative flex items-center gap-4 py-4">
      {/* Left Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-gray-700 origin-left"
      />

      {/* Text */}
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="text-sm font-medium text-gray-500 uppercase tracking-wider px-2"
      >
        {text}
      </motion.span>

      {/* Right Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-gray-700 to-gray-700 origin-right"
      />
    </div>
  );
};
