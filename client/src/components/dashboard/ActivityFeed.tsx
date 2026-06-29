import React from 'react';
import { ActivityPayload } from '../../types/socket';

interface ActivityFeedProps {
  activities: ActivityPayload[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Live activity feed</h2>
          <p className="mt-1 text-sm text-slate-500">Team updates delivered in real time.</p>
        </div>
      </div>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            No activity yet. Work updates and notifications will appear here.
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">{activity.title}</p>
                <span className="text-xs text-slate-500">{new Date(activity.createdAt).toLocaleTimeString()}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{activity.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

