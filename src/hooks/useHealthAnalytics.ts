import { useState, useEffect } from 'react';
import { HealthAnalyzer } from '../services/ai/HealthAnalyzer';
import { WearableManager } from '../services/wearables/WearableManager';
import { useToaster } from '../components/shared/Toaster';

export const useHealthAnalytics = () => {
  const [analyzer] = useState(() => new HealthAnalyzer());
  const [isInitialized, setIsInitialized] = useState(false);
  const wearableManager = WearableManager.getInstance();
  const { showToast } = useToaster();

  useEffect(() => {
    const initialize = async () => {
      try {
        await analyzer.initialize();
        setIsInitialized(true);
      } catch (error) {
        showToast('Failed to initialize health analytics', 'error');
      }
    };

    initialize();
  }, [analyzer, showToast]);

  const analyzeSymptoms = async (selectedSymptoms: string[]) => {
    if (!isInitialized) {
      throw new Error('Health analyzer not initialized');
    }

    return analyzer.analyzeSymptoms(selectedSymptoms);
  };

  const analyzeMedicalReport = async (file: File) => {
    if (!isInitialized) {
      throw new Error('Health analyzer not initialized');
    }

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a PDF, image, or document file.');
    }

    // Analyze the report
    return analyzer.analyzeMedicalReport(file);
  };

  const getWearableMetrics = () => {
    return wearableManager.getLatestMetrics();
  };

  return {
    isInitialized,
    analyzeSymptoms,
    analyzeMedicalReport,
    getWearableMetrics
  };
};