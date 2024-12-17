import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const TrendAnalysis: React.FC = () => {
  const data = [
    { date: 'Mon', physical: 80, mental: 85, sleep: 75 },
    { date: 'Tue', physical: 82, mental: 83, sleep: 78 },
    { date: 'Wed', physical: 79, mental: 88, sleep: 80 },
    { date: 'Thu', physical: 85, mental: 82, sleep: 82 },
    { date: 'Fri', physical: 83, mental: 85, sleep: 85 },
    { date: 'Sat', physical: 87, mental: 86, sleep: 83 },
    { date: 'Sun', physical: 90, mental: 88, sleep: 87 },
  ];

  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-6">Weekly Trends</h3>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPhysical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMental" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
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
            <Area
              type="monotone"
              dataKey="physical"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorPhysical)"
            />
            <Area
              type="monotone"
              dataKey="mental"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorMental)"
            />
            <Area
              type="monotone"
              dataKey="sleep"
              stroke="#ec4899"
              fillOpacity={1}
              fill="url(#colorSleep)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
          <span className="text-gray-300">Physical Health</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2" />
          <span className="text-gray-300">Mental Health</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-pink-500 mr-2" />
          <span className="text-gray-300">Sleep Quality</span>
        </div>
      </div>
    </div>
  );
};