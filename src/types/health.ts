export interface HealthMetric {
  id: string;
  timestamp: number;
  type: 'heart_rate' | 'steps' | 'sleep' | 'blood_pressure' | 'temperature';
  value: number;
  unit: string;
}

export interface HealthReport {
  id: string;
  timestamp: number;
  metrics: HealthMetric[];
  analysis: {
    score: number;
    insights: string[];
    recommendations: string[];
  };
}

export interface VitalSigns {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
}