import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { HealthSummary } from '../components/dashboard/HealthSummary';
import { ActivityChart } from '../components/dashboard/ActivityChart';
import { RecentMetrics } from '../components/dashboard/RecentMetrics';
import { WearableDeviceCard } from '../components/dashboard/WearableDeviceCard';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, {user?.name || 'Guest'}
          </h1>
          <p className="text-gray-400">
            Here's your real-time health metrics and activities
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <WearableDeviceCard />
          <RecentMetrics />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ActivityChart />
          <HealthSummary />
        </div>
      </div>
    </DashboardLayout>
  );
};