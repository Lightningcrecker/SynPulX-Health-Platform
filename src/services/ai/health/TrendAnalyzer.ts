import { HealthMetric } from '@/types';
import { MetricPreprocessor } from './MetricPreprocessor';

export interface TrendAnalysis {
  direction: 'improving' | 'stable' | 'declining';
  confidence: number;
}

export class TrendAnalyzer {
  static analyzeTrends(metrics: HealthMetric[]): TrendAnalysis {
    const recentMetrics = metrics.slice(-7); // Last week
    const values = recentMetrics.map(m => MetricPreprocessor.normalizeMetric(m));
    
    const trend = this.calculateTrend(values);
    const confidence = this.calculateConfidence(values);

    return { direction: trend, confidence };
  }

  private static calculateTrend(values: number[]): TrendAnalysis['direction'] {
    const slope = this.calculateSlope(values);
    const threshold = 0.1;

    if (Math.abs(slope) < threshold) return 'stable';
    return slope > 0 ? 'improving' : 'declining';
  }

  private static calculateSlope(values: number[]): number {
    const n = values.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    
    const sumX = indices.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
    const sumXX = indices.reduce((sum, x) => sum + x * x, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  private static calculateConfidence(values: number[]): number {
    const variance = this.calculateVariance(values);
    const consistency = Math.exp(-variance);
    return Math.min(consistency * 100, 100);
  }

  private static calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(x => Math.pow(x - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }
}