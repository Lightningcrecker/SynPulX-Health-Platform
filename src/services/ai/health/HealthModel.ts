import * as tf from '@tensorflow/tfjs';
import { ModelConfig } from './types';

export class HealthModel {
  private model: tf.LayersModel | null = null;

  async initialize(config: ModelConfig): Promise<void> {
    await tf.ready();
    
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ 
          inputShape: config.inputShape,
          units: config.hiddenLayers[0],
          activation: 'relu'
        }),
        tf.layers.dropout({ rate: 0.3 }),
        ...config.hiddenLayers.slice(1).map(units => 
          tf.layers.dense({ units, activation: 'relu' })
        ),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(config.learningRate),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
  }

  async predict(features: tf.Tensor2D): Promise<number[]> {
    if (!this.model) throw new Error('Model not initialized');
    
    const prediction = this.model.predict(features) as tf.Tensor;
    const values = await prediction.data();
    prediction.dispose();
    
    return Array.from(values);
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}