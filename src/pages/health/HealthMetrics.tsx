import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { AIInsights } from '../../components/analytics/AIInsights';
import { HealthSummary } from '../../components/dashboard/HealthSummary';
import { ActivityChart } from '../../components/dashboard/ActivityChart';
import { SymptomChecker } from '../../components/health/SymptomChecker';
import { MedicalReportUpload } from '../../components/health/MedicalReportUpload';
import { useNavigate } from 'react-router-dom';

export const HealthMetrics: React.FC = () => {
  const navigate = useNavigate();
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);

  const handleReportAnalysis = () => {
    navigate('/analytics');
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Health Metrics</h1>
          <p className="text-gray-400">
            Track and analyze your health data
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ActivityChart />
          <AIInsights />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SymptomChecker
            isOpen={showSymptomChecker}
            onClose={() => setShowSymptomChecker(false)}
          />
          <MedicalReportUpload onAnalysis={handleReportAnalysis} />
        </div>

        <HealthSummary />
      </div>
    </DashboardLayout>
  );
};