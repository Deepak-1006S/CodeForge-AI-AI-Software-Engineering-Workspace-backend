import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Todo', value: 35 },
  { name: 'In Progress', value: 28 },
  { name: 'Review', value: 18 },
  { name: 'Done', value: 19 },
];

const COLORS = ['#2563EB', '#F59E0B', '#8B5CF6', '#10B981'];

export const IssueStatusPieChart: React.FC = () => {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4} stroke="none">
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

