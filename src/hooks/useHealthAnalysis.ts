import { useState, useCallback } from 'react';
import { AdvancedHealthAnalyzer } from '../services/ai/AdvancedHealthAnalyzer';
import { useToaster } from '../components/shared/Toaster';

export const useHealthAnalysis = () => {
  const [analyzer] = useState(() => new AdvancedHealthAnalyzer());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { showToast } = useToaster();

  const analyzeUserInput = useCallback(async (input: string) => {
    if (!input.trim()) {
      showToast('Please enter some text to analyze', 'error');
      return null;
    }

    setIsAnalyzing(true);
    try {
      await analyzer.initialize();
      const analysis = await analyzer.analyzeHealthData({ text: input });
      return analysis;
    } catch (error) {
      showToast('Failed to analyze input', 'error');
      console.error('Analysis error:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [analyzer, showToast]);

  return {
    analyzeUserInput,
    isAnalyzing
  };
};