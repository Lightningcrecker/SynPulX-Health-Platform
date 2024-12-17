import React from 'react';
import { Heart, Activity, Brain, Moon } from 'lucide-react';

export const HealthSummary: React.FC = () => {
  const healthData = [
    {
      category: 'Cardiovascular',
      icon: Heart,
      metrics: [
        { name: 'Resting Heart Rate', value: '68 bpm', status: 'normal' },
        { name: 'Blood Pressure', value: '120/80', status: 'normal' },
        { name: 'Heart Rate Variability', value: '45 ms', status: 'good' },
      ],
    },
    {
      category: 'Activity',
      icon: Activity,
      metrics: [
        { name: 'Daily Steps', value: '8,432', status: 'good' },
        { name: 'Active Minutes', value: '45 mins', status: 'warning' },
        { name: 'Distance', value: '5.2 km', status: 'normal' },
      ],
    },
    {
      category: 'Sleep',
      icon: Moon,
      metrics: [
        { name: 'Total Sleep', value: '7h 20m', status: 'normal' },
        { name: 'Deep Sleep', value: '1h 45m', status: 'good' },
        { name: 'Sleep Score', value: '85/100', status: 'good' },
      ],
    },
    {
      category: 'Cognitive',
      icon: Brain,
      metrics: [
        { name: 'Focus Score', value: '82/100', status: 'good' },
        { name: 'Stress Level', value: 'Medium', status: 'warning' },
        { name: 'Recovery', value: '90%', status: 'good' },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {healthData.map((category) => (
        <div
          key={category.category}
          className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
        >
          <div className="flex items-center mb-4">
            <category.icon className="h-6 w-6 text-blue-400 mr-2" />
            <h3 className="text-xl font-semibold text-white">{category.category}</h3>
          </div>
          <div className="space-y-4">
            {category.metrics.map((metric) => (
              <div key={metric.name} className="flex items-center justify-between">
                <span className="text-gray-300">{metric.name}</span>
                <div className="flex items-center">
                  <span className="text-white font-medium mr-2">{metric.value}</span>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      metric.status === 'good'
                        ? 'bg-green-400'
                        : metric.status === 'warning'
                        ? 'bg-yellow-400'
                        : 'bg-blue-400'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};