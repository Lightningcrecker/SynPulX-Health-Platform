import React from 'react';
import { Heart, Activity, Brain, Moon } from 'lucide-react';

export const HealthScore: React.FC = () => {
  const score = 85;
  const categories = [
    { name: 'Physical', icon: Activity, score: 88, color: 'blue' },
    { name: 'Cardiovascular', icon: Heart, score: 82, color: 'red' },
    { name: 'Sleep', icon: Moon, score: 90, color: 'purple' },
    { name: 'Cognitive', icon: Brain, score: 80, color: 'green' },
  ];

  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-6">Overall Health Score</h3>
      
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          <svg className="w-32 h-32">
            <circle
              className="text-gray-700"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="58"
              cx="64"
              cy="64"
            />
            <circle
              className="text-blue-500"
              strokeWidth="8"
              strokeDasharray={`${(score / 100) * 365} 365`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="58"
              cx="64"
              cy="64"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{score}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.name} className="p-4 rounded-lg bg-white/5">
            <div className="flex items-center mb-2">
              <category.icon className={`h-5 w-5 text-${category.color}-400 mr-2`} />
              <span className="text-white font-medium">{category.name}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`bg-${category.color}-400 h-2 rounded-full`}
                style={{ width: `${category.score}%` }}
              />
            </div>
            <span className="text-sm text-gray-400 mt-1">{category.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};