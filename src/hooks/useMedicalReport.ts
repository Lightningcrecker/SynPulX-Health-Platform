import { useState } from 'react';
import { MedicalReportAnalyzer } from '../services/analysis/MedicalReportAnalyzer';
import { useToaster } from '../components/shared/Toaster';
import { PDFParser } from '../utils/pdfParser';
import { ImageOCR } from '../utils/imageOCR';

export const useMedicalReport = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { showToast } = useToaster();
  const analyzer = new MedicalReportAnalyzer();

  const analyzeReport = async (file: File) => {
    setIsAnalyzing(true);
    try {
      let text = '';
      
      // Extract text based on file type
      if (file.type === 'application/pdf') {
        text = await PDFParser.extractText(file);
      } else if (file.type.startsWith('image/')) {
        text = await ImageOCR.extractText(file);
      } else {
        text = await file.text();
      }

      // Initialize analyzer and analyze report
      const reportAnalysis = await analyzer.analyzeReport(text);
      setAnalysis(reportAnalysis);
      showToast('Report analysis completed', 'success');
      
      return reportAnalysis;
    } catch (error) {
      showToast('Failed to analyze report', 'error');
      console.error('Report analysis error:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeReport,
    isAnalyzing,
    analysis
  };
};