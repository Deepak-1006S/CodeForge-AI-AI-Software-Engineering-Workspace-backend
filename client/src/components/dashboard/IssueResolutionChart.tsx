import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const data = [
  { sprint: 'Sprint 1', opened: 42, resolved: 30 },
  { sprint: 'Sprint 2', opened: 38, resolved: 34 },
  { sprint: 'Sprint 3', opened: 46, resolved: 40 },
  { sprint: 'Sprint 4', opened: 32, resolved: 28 },
  { sprint: 'Sprint 5', opened: 30, resolved: 29 },
  { sprint: 'Sprint 6', opened: 28, resolved: 32 },
];

export const IssueResolutionChart: React.FC = () => {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="sprint" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="opened" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="resolved" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

