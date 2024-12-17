import React from 'react';
import { Activity, Heart, Brain } from 'lucide-react';

export const RecentMetrics: React.FC = () => {
  const metrics = [
    {
      icon: Heart,
      name: 'Heart Rate',
      value: '72 bpm',
      time: '2 mins ago',
      trend: 'up',
    },
    {
      icon: Activity,
      name: 'Steps',
      value: '8,432',
      time: '5 mins ago',
      trend: 'neutral',
    },
    {
      icon: Brain,
      name: 'Focus Score',
      value: '85/100',
      time: '15 mins ago',
      trend: 'down',
    },
  ];

  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Recent Metrics</h3>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="flex items-center justify-between p-4 rounded-lg bg-white/5"
          >
            <div className="flex items-center">
              <metric.icon className="h-5 w-5 text-blue-400 mr-3" />
              <div>
                <p className="text-white font-medium">{metric.name}</p>
                <p className="text-sm text-gray-400">{metric.time}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">{metric.value}</p>
              <p
                className={`text-sm ${
                  metric.trend === 'up'
                    ? 'text-green-400'
                    : metric.trend === 'down'
                    ? 'text-red-400'
                    : 'text-gray-400'
                }`}
              >
                {metric.trend === 'up'
                  ? '↑ Rising'
                  : metric.trend === 'down'
                  ? '↓ Falling'
                  : '→ Stable'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};