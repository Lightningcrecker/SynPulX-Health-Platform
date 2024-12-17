import React from 'react';
import { Download, FileText } from 'lucide-react';
import { useHealthAnalytics } from '../../hooks/useHealthAnalytics';
import { generatePDF } from '../../utils/pdfGenerator';

export const WeeklyReport: React.FC = () => {
  const { getWearableMetrics } = useHealthAnalytics();
  const metrics = getWearableMetrics();

  const handleDownload = async () => {
    if (!metrics) return;
    
    const reportData = {
      metrics,
      date: new Date().toISOString(),
      recommendations: [
        'Maintain consistent physical activity',
        'Focus on quality sleep',
        'Monitor heart rate variations'
      ]
    };

    await generatePDF(reportData);
  };

  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Weekly Health Report</h3>
        </div>
        <button
          onClick={handleDownload}
          disabled={!metrics}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Download Report
        </button>
      </div>

      {metrics ? (
        <div className="space-y-4">
          {/* Report preview content */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h4 className="text-lg font-medium text-white mb-2">Summary</h4>
            <p className="text-gray-300">
              Your weekly health metrics show {metrics.heartRate > 80 ? 'elevated' : 'normal'} heart rate patterns
              and {metrics.steps > 70000 ? 'excellent' : 'moderate'} activity levels.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          Connect a wearable device to generate your weekly health report.
        </div>
      )}
    </div>
  );
};