import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ComparisonChart: React.FC = () => {
  const data = [
    {
      category: 'Steps',
      you: 8500,
      average: 7000,
      goal: 10000,
    },
    {
      category: 'Sleep',
      you: 7.5,
      average: 7,
      goal: 8,
    },
    {
      category: 'Exercise',
      you: 45,
      average: 30,
      goal: 60,
    },
    {
      category: 'Water',
      you: 2000,
      average: 1800,
      goal: 2500,
    },
  ];

  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-6">Performance Comparison</h3>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="category"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.5)' }}
            />
            <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
              }}
            />
            <Legend />
            <Bar dataKey="you" name="You" fill="#3b82f6" />
            <Bar dataKey="average" name="Average" fill="#8b5cf6" />
            <Bar dataKey="goal" name="Goal" fill="#ec4899" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};