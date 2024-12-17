import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { TrendAnalysis } from '../../components/analytics/TrendAnalysis';
import { HealthScore } from '../../components/analytics/HealthScore';
import { PredictiveInsights } from '../../components/analytics/PredictiveInsights';
import { ComparisonChart } from '../../components/analytics/ComparisonChart';

export const Analytics: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Health Analytics</h1>
          <p className="text-gray-400">
            Advanced insights and trends based on your health data
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HealthScore />
          <PredictiveInsights />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <TrendAnalysis />
          <ComparisonChart />
        </div>
      </div>
    </DashboardLayout>
  );
};