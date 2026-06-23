import React from 'react';
import { cn } from '@/utils/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  showStatus?: boolean;
  fallbackColor?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt,
      name = '',
      size = 'md',
      status,
      showStatus = false,
      fallbackColor,
      ...props
    },
    ref
  ) => {
    const [imgError, setImgError] = React.useState(false);

    const sizeClasses = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl',
      '2xl': 'h-20 w-20 text-2xl',
    };

    const statusSizes = {
      xs: 'h-1.5 w-1.5',
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-3.5 w-3.5',
      '2xl': 'h-4 w-4',
    };

    const statusColors = {
      online: 'bg-emerald-500',
      offline: 'bg-gray-400',
      away: 'bg-amber-500',
      busy: 'bg-red-500',
    };

    const getInitials = (name: string) => {
      const parts = name.trim().split(' ');
      if (parts.length === 0) return '?';
      if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?';
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const generateColorFromName = (name: string) => {
      const colors = [
        'bg-blue-500',
        'bg-emerald-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-orange-500',
        'bg-teal-500',
        'bg-indigo-500',
        'bg-cyan-500',
      ];
      const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return colors[hash % colors.length];
    };

    const showImage = src && !imgError;
    const initials = getInitials(name);
    const bgColor = fallbackColor || generateColorFromName(name);

    return (
      <div ref={ref} className={cn('relative inline-block', className)} {...props}>
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold overflow-hidden',
            sizeClasses[size],
            !showImage && bgColor,
            !showImage && 'text-white'
          )}
        >
          {showImage ? (
            <img
              src={src}
              alt={alt || name}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {showStatus && status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-800',
              statusSizes[size],
              statusColors[status]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
