import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export const PredictiveInsights: React.FC = () => {
  const insights = [
    {
      metric: 'Sleep Pattern',
      prediction: 'Improving',
      trend: 'up',
      message: 'Your sleep quality is expected to improve by 15% next week',
      action: 'Maintain current sleep schedule',
    },
    {
      metric: 'Stress Level',
      prediction: 'Warning',
      trend: 'warning',
      message: 'Potential stress increase due to irregular exercise patterns',
      action: 'Consider adding meditation sessions',
    },
    {
      metric: 'Physical Activity',
      prediction: 'Declining',
      trend: 'down',
      message: 'Activity level shows a downward trend',
      action: 'Increase daily step count by 2000',
    },
  ];

  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-6">Predictive Insights</h3>
      
      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.metric}
            className="p-4 rounded-lg bg-white/5 border border-white/10"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-white font-medium">{insight.metric}</span>
              {insight.trend === 'up' ? (
                <TrendingUp className="h-5 w-5 text-green-400" />
              ) : insight.trend === 'down' ? (
                <TrendingDown className="h-5 w-5 text-red-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              )}
            </div>
            <p className="text-gray-400 text-sm mb-2">{insight.message}</p>
            <div className="text-sm font-medium text-blue-400">
              Recommended: {insight.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};