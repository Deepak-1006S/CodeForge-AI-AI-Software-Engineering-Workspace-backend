import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Loader2 } from 'lucide-react';

interface PremiumButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  children,
  onClick,
  className = '',
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40',
    secondary: 'text-white bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70 backdrop-blur-sm',
    ghost: 'text-gray-300 hover:text-white hover:bg-gray-800/50',
  };

  const sizeClasses = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {/* Primary Gradient Background */}
      {variant === 'primary' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </>
      )}

      {/* Shine Effect */}
      {!isDisabled && variant === 'primary' && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.2) 45%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.2) 55%, transparent 100%)',
          }}
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: 'linear',
          }}
        />
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : Icon ? (
          <Icon className="w-5 h-5" />
        ) : null}
        {children}
      </span>

      {/* Glow Effect on Hover */}
      {variant === 'primary' && !isDisabled && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-xl -z-10"
          style={{
            background: 'linear-gradient(to right, rgb(99, 102, 241), rgb(168, 85, 247), rgb(236, 72, 153))',
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};
