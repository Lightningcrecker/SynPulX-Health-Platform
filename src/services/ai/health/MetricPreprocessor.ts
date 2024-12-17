import * as tf from '@tensorflow/tfjs';
import { HealthMetric } from '@/types';
import { HEALTH_METRICS } from '@/utils/constants';

export class MetricPreprocessor {
  static preprocessMetrics(metrics: HealthMetric[]): tf.Tensor2D {
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

  static normalizeMetric(metric: HealthMetric): number {
    const range = HEALTH_METRICS[metric.type as keyof typeof HEALTH_METRICS];
    if (!range) return metric.value;

    const { min, max } = range.normal;
    return (metric.value - min) / (max - min);
  }
}