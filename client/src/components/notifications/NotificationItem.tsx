import React from 'react';
import type { Notification } from '../../context/NotificationContext';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  const timeLabel = new Date(notification.createdAt).toLocaleString();
  const isUnread = !notification.read;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
        isUnread
          ? 'border-blue-300 bg-blue-50 shadow-sm'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{notification.title || 'New notification'}</p>
          <p className="mt-2 text-sm text-slate-600">{notification.message}</p>
        </div>
        <span className="whitespace-nowrap text-xs text-slate-400">{timeLabel}</span>
      </div>
      {notification.link && (
        <p className="mt-3 text-xs text-blue-600">View details</p>
      )}
    </button>
  );
};
