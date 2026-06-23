import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationItem } from './NotificationItem';

export const NotificationPanel: React.FC = () => {
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();

  return (
    <div className="fixed right-4 top-20 z-50 w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
          <p className="text-sm text-slate-500">{unreadCount} unread</p>
        </div>
        <button
          type="button"
          onClick={clearAll}
          className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onClick={() => markAsRead(notification._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
