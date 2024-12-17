import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ActivityChart: React.FC = () => {
  const data = [
    { time: '00:00', heartRate: 62, steps: 0, sleep: 95 },
    { time: '03:00', heartRate: 58, steps: 0, sleep: 90 },
    { time: '06:00', heartRate: 65, steps: 200, sleep: 60 },
    { time: '09:00', heartRate: 75, steps: 2500, sleep: 0 },
    { time: '12:00', heartRate: 72, steps: 4800, sleep: 0 },
    { time: '15:00', heartRate: 78, steps: 6900, sleep: 0 },
    { time: '18:00', heartRate: 71, steps: 8200, sleep: 0 },
    { time: '21:00', heartRate: 68, steps: 8900, sleep: 40 },
  ];

  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Daily Activity</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="time"
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
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="steps"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="sleep"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
          <span className="text-gray-300">Heart Rate</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
          <span className="text-gray-300">Steps</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2" />
          <span className="text-gray-300">Sleep</span>
        </div>
      </div>
    </div>
  );
};