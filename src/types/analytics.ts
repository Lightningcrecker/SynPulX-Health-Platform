export interface HealthAnalysis {
  userId: string;
  timestamp: number;
  metrics: {
    overall: number;
    physical: number;
    mental: number;
    sleep: number;
  };
  trends: {
    direction: 'improving' | 'stable' | 'declining';
    confidence: number;
  };
  insights: string[];
  recommendations: string[];
}

export interface MedicalReport {
  id: string;
  timestamp: number;
  type: 'lab_result' | 'diagnosis' | 'prescription';
  content: string;
  analysis: {
    findings: string[];
    recommendations: string[];
    urgency: 'low' | 'medium' | 'high';
    followUp?: string;
  };
}