import {
  formatDistanceToNow,
  format,
  isToday,
  isYesterday,
  parseISO,
} from 'date-fns';

export const formatRelative = (dateStr: string): string => {
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    if (isToday(date)) return formatDistanceToNow(date, { addSuffix: true });
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
};

export const formatFull = (dateStr: string): string => {
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    return format(date, 'MMMM d, yyyy h:mm a');
  } catch {
    return dateStr;
  }
};

export const formatShort = (dateStr: string | Date): string => {
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(date, 'MMM d, yyyy');
  } catch {
    return typeof dateStr === 'string' ? dateStr : dateStr.toISOString();
  }
};

export const formatDate = (dateStr: string | Date): string => formatShort(dateStr);

export const formatTimeAgo = (dateStr: string | Date): string => {
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return typeof dateStr === 'string' ? dateStr : dateStr.toISOString();
  }
};
