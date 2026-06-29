import React from 'react';
import { cn } from '@/utils/cn';

export interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'list' | 'avatar' | 'button';
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  count = 1,
  className,
}) => {
  const baseStyles = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]';

  const variants = {
    text: 'h-4 rounded-md w-full',
    card: 'h-48 rounded-xl w-full',
    list: 'h-16 rounded-lg w-full',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24 rounded-lg',
  };

  const items = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={cn(baseStyles, variants[variant], className)}
      style={{
        animation: 'shimmer 2s infinite',
      }}
    />
  ));

  if (variant === 'text') {
    return <div className="space-y-3">{items}</div>;
  }

  if (variant === 'card') {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{items}</div>;
  }

  if (variant === 'list') {
    return <div className="space-y-3">{items}</div>;
  }

  return <>{items}</>;
};

// Export individual skeleton components
export const SkeletonText: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('h-4 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse', className)} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('h-48 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse', className)} />
);

export const SkeletonAvatar: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse', className)} />
);

export default SkeletonLoader;

// Add keyframes to global styles if not already present
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('skeleton-shimmer')) {
  style.id = 'skeleton-shimmer';
  document.head.appendChild(style);
}
