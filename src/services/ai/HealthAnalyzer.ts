import * as tf from '@tensorflow/tfjs';
import { Matrix } from 'ml-matrix';
import { RandomForestRegression } from 'ml-random-forest';
import { HealthMetric, HealthAnalysis } from '@/types';
import { HEALTH_METRICS } from '@/utils/constants';

export class HealthAnalyzer {
  private model: tf.LayersModel | null = null;
  private forestModel: RandomForestRegression | null = null;

  async initialize(): Promise<void> {
    await tf.ready();
    
    // Initialize deep learning model
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [10], units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    // Initialize random forest for trend analysis
    this.forestModel = new RandomForestRegression({
      nEstimators: 100,
      maxDepth: 15,
      minSamplesSplit: 2
    });
  }

  async analyzeMetrics(metrics: HealthMetric[]): Promise<HealthAnalysis> {
    if (!this.model || !this.forestModel) {
      throw new Error('Models not initialized');
    }

    const features = this.preprocessMetrics(metrics);
    const predictions = await this.predictHealth(features);
    const trends = this.analyzeTrends(metrics);

    return {
      userId: metrics[0]?.id.split('_')[0] || '',
      timestamp: Date.now(),
      metrics: {
        overall: predictions.overall,
        physical: predictions.physical,
        mental: predictions.mental,
        sleep: predictions.sleep
      },
      trends,
      insights: this.generateInsights(predictions, trends),
      recommendations: this.generateRecommendations(predictions, trends)
    };
  }

  private preprocessMetrics(metrics: HealthMetric[]): tf.Tensor2D {
    // Convert metrics to normalized feature vectors
    const features = metrics.map(metric => {
      const normalizedValue = this.normalizeMetric(metric);
      return [
        normalizedValue,
        metric.timestamp,
        // Add more features as needed
      ];
    });

    return tf.tensor2d(features);
  }

  private normalizeMetric(metric: HealthMetric): number {
    const range = HEALTH_METRICS[metric.type as keyof typeof HEALTH_METRICS];
    if (!range) return metric.value;

    const { min, max } = range.normal;
    return (metric.value - min) / (max - min);
  }

  private async predictHealth(features: tf.Tensor2D): Promise<{
    overall: number;
    physical: number;
    mental: number;
    sleep: number;
  }> {
    const prediction = this.model!.predict(features) as tf.Tensor;
    const values = await prediction.data();

    return {
      overall: values[0] * 100,
      physical: values[1] * 100,
      mental: values[2] * 100,
      sleep: values[3] * 100
    };
  }

  private analyzeTrends(metrics: HealthMetric[]): {
    direction: 'improving' | 'stable' | 'declining';
    confidence: number;
  } {
    const recentMetrics = metrics.slice(-7); // Last week
    const values = recentMetrics.map(m => this.normalizeMetric(m));
    
    const trend = this.calculateTrend(values);
    const confidence = this.calculateConfidence(values);

    return {
      direction: trend,
      confidence
    };
  }

  private calculateTrend(values: number[]): 'improving' | 'stable' | 'declining' {
    const slope = this.calculateSlope(values);
    const threshold = 0.1;

    if (Math.abs(slope) < threshold) return 'stable';
    return slope > 0 ? 'improving' : 'declining';
  }

  private calculateSlope(values: number[]): number {
    const n = values.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    
    const sumX = indices.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
    const sumXX = indices.reduce((sum, x) => sum + x * x, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  private calculateConfidence(values: number[]): number {
    const variance = this.calculateVariance(values);
    const consistency = Math.exp(-variance);
    return Math.min(consistency * 100, 100);
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(x => Math.pow(x - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  private generateInsights(
    predictions: { [key: string]: number },
    trends: { direction: string; confidence: number }
  ): string[] {
    const insights: string[] = [];

    // Add overall health insights
    if (predictions.overall > 80) {
      insights.push('Your overall health metrics are excellent');
    } else if (predictions.overall < 60) {
      insights.push('Your health metrics indicate room for improvement');
    }

    // Add trend-based insights
    if (trends.direction === 'improving' && trends.confidence > 70) {
      insights.push('Your health metrics show consistent improvement');
    } else if (trends.direction === 'declining' && trends.confidence > 70) {
      insights.push('Your health metrics indicate a declining trend');
    }

    return insights;
  }

  private generateRecommendations(
    predictions: { [key: string]: number },
    trends: { direction: string; confidence: number }
  ): string[] {
    const recommendations: string[] = [];

    // Add metric-specific recommendations
    Object.entries(predictions).forEach(([metric, value]) => {
      if (value < 70) {
        switch (metric) {
          case 'physical':
            recommendations.push('Increase daily physical activity');
            recommendations.push('Consider adding strength training');
            break;
          case 'mental':
            recommendations.push('Practice stress management techniques');
            recommendations.push('Consider mindfulness exercises');
            break;
          case 'sleep':
            recommendations.push('Improve sleep hygiene');
            recommendations.push('Maintain consistent sleep schedule');
            break;
        }
      }
    });

    // Add trend-based recommendations
    if (trends.direction === 'declining' && trends.confidence > 70) {
      recommendations.push('Schedule a health check-up');
      recommendations.push('Review and adjust your daily routine');
    }

    return [...new Set(recommendations)]; // Remove duplicates
  }
}