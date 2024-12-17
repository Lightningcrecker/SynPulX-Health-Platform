import { HealthMetric, HealthAnalysis } from '@/types';
import { MetricPreprocessor } from './MetricPreprocessor';
import { TrendAnalyzer } from './TrendAnalyzer';
import { InsightGenerator } from './InsightGenerator';
import { HealthModel } from './HealthModel';
import { HealthPrediction, ModelConfig } from './types';

export class HealthAnalyzer {
  private healthModel: HealthModel;

  constructor() {
    this.healthModel = new HealthModel();
  }

  async initialize(): Promise<void> {
    const config: ModelConfig = {
      inputShape: [10],
      hiddenLayers: [128, 64, 32, 16],
      learningRate: 0.001
    };

    await this.healthModel.initialize(config);
  }

  async analyzeMetrics(metrics: HealthMetric[]): Promise<HealthAnalysis> {
    const features = MetricPreprocessor.preprocessMetrics(metrics);
    const predictions = await this.predictHealth(features);
    const trends = TrendAnalyzer.analyzeTrends(metrics);

    return {
      userId: metrics[0]?.id.split('_')[0] || '',
      timestamp: Date.now(),
      metrics: predictions,
      trends,
      insights: InsightGenerator.generateInsights(predictions, trends),
      recommendations: InsightGenerator.generateRecommendations(predictions, trends)
    };
  }

  private async predictHealth(features: tf.Tensor2D): Promise<HealthPrediction> {
    const values = await this.healthModel.predict(features);
    
    return {
      overall: values[0] * 100,
      physical: values[1] * 100,
      mental: values[2] * 100,
      sleep: values[3] * 100
    };
  }

  dispose(): void {
    this.healthModel.dispose();
  }
}