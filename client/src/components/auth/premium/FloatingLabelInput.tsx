import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FloatingLabelInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  error?: string;
  icon?: LucideIcon;
  rightIcon?: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  id,
  name,
  type,
  label,
  value,
  error,
  icon: Icon,
  rightIcon,
  onChange,
  onBlur,
  placeholder = ' ',
  autoComplete,
  disabled = false,
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasValue = value && value.length > 0;
  const isFloating = isFocused || hasValue;

  return (
    <div className="relative group">
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <motion.div
            animate={{
              color: isFocused ? 'rgb(99, 102, 241)' : error ? 'rgb(239, 68, 68)' : 'rgb(107, 114, 128)',
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        )}

        {/* Input Field */}
        <input
          ref={inputRef}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          className={`
            peer w-full h-14 px-4 pt-6 pb-2 rounded-xl
            ${Icon ? 'pl-12' : 'pl-4'}
            ${rightIcon ? 'pr-12' : 'pr-4'}
            bg-gray-900/40 backdrop-blur-sm
            border-2 transition-all duration-300
            text-white placeholder-transparent
            focus:outline-none
            ${error 
              ? 'border-red-500/50 focus:border-red-500' 
              : isFocused 
                ? 'border-indigo-500 focus:border-indigo-500 shadow-lg shadow-indigo-500/20' 
                : 'border-gray-800 hover:border-gray-700'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />

        {/* Floating Label */}
        <motion.label
          htmlFor={id}
          animate={{
            top: isFloating ? '0.65rem' : '50%',
            translateY: isFloating ? '0%' : '-50%',
            fontSize: isFloating ? '0.75rem' : '0.875rem',
            color: error 
              ? 'rgb(239, 68, 68)' 
              : isFocused 
                ? 'rgb(99, 102, 241)' 
                : 'rgb(156, 163, 175)',
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`
            absolute ${Icon ? 'left-12' : 'left-4'} 
            pointer-events-none font-medium
            origin-left z-10
          `}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </motion.label>

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            {rightIcon}
          </div>
        )}

        {/* Focus Ring Effect */}
        <AnimatePresence>
          {isFocused && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 -z-10 blur-xl"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 mt-2 px-1">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"
              />
              <span className="text-sm text-red-400 font-medium">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Indicator (when no error and has value) */}
      <AnimatePresence>
        {!error && hasValue && !isFocused && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute right-4 top-5 text-emerald-400"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
