import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const data = [
  { week: 'Week 1', Dev: 12, QA: 8, Ops: 5 },
  { week: 'Week 2', Dev: 18, QA: 11, Ops: 8 },
  { week: 'Week 3', Dev: 22, QA: 15, Ops: 10 },
  { week: 'Week 4', Dev: 20, QA: 16, Ops: 12 },
  { week: 'Week 5', Dev: 26, QA: 18, Ops: 14 },
  { week: 'Week 6', Dev: 30, QA: 20, Ops: 17 },
];

export const ProductivityChart: React.FC = () => {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="devGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="qaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="week" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Area type="monotone" dataKey="Dev" stroke="#2563EB" fill="url(#devGradient)" strokeWidth={2} />
          <Area type="monotone" dataKey="QA" stroke="#14B8A6" fill="url(#qaGradient)" strokeWidth={2} />
          <Area type="monotone" dataKey="Ops" stroke="#F59E0B" fill="url(#qaGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

