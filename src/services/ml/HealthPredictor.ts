import * as tf from '@tensorflow/tfjs';
import { Matrix } from 'ml-matrix';
import { RandomForestRegression as RandomForest } from 'ml-random-forest';

export class HealthPredictor {
  private model: tf.LayersModel | null = null;
  private forestModel: RandomForest | null = null;

  async initialize() {
    // Initialize TensorFlow model for health score prediction
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [10], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    // Initialize Random Forest for trend analysis
    const options = {
      seed: 3,
      maxFeatures: 0.8,
      replacement: true,
      nEstimators: 25
    };

    this.forestModel = new RandomForest(options);
  }

  async predictHealthScore(metrics: number[]): Promise<number> {
    if (!this.model) throw new Error('Model not initialized');

    const input = tf.tensor2d([metrics]);
    const prediction = this.model.predict(input) as tf.Tensor;
    const score = await prediction.data();
    
    input.dispose();
    prediction.dispose();
    
    return score[0] * 100;
  }

  async analyzeTrends(historicalData: number[][]): Promise<{
    trend: 'improving' | 'declining' | 'stable';
    confidence: number;
    prediction: number[];
  }> {
    if (!this.forestModel) throw new Error('Forest model not initialized');

    const matrix = new Matrix(historicalData);
    const features = matrix.subMatrix(0, matrix.rows - 2, 0, matrix.columns - 1);
    const labels = matrix.subMatrix(1, matrix.rows - 1, matrix.columns - 1, matrix.columns - 1);

    this.forestModel.train(features.to2DArray(), labels.to2DArray().map(r => r[0]));

    const latestFeatures = historicalData[historicalData.length - 1].slice(0, -1);
    const prediction = this.forestModel.predict([latestFeatures]);
    
    const trend = this.calculateTrend(historicalData.map(d => d[d.length - 1]));
    const confidence = this.calculateConfidence(prediction[0], historicalData);

    return {
      trend,
      confidence,
      prediction: Array.isArray(prediction) ? prediction : [prediction]
    };
  }

  private calculateTrend(values: number[]): 'improving' | 'declining' | 'stable' {
    const recentValues = values.slice(-5);
    const average = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    const latestValue = recentValues[recentValues.length - 1];
    
    const threshold = 0.05;
    const percentChange = Math.abs((latestValue - average) / average);
    
    if (percentChange < threshold) return 'stable';
    return latestValue > average ? 'improving' : 'declining';
  }

  private calculateConfidence(prediction: number, historicalData: number[][]): number {
    const actualValues = historicalData.map(d => d[d.length - 1]);
    const mse = actualValues.reduce((acc, val) => acc + Math.pow(val - prediction, 2), 0) / actualValues.length;
    return Math.max(0, 100 * (1 - Math.sqrt(mse) / prediction));
  }
}