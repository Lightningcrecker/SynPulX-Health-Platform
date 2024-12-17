export interface HealthPrediction {
  overall: number;
  physical: number;
  mental: number;
  sleep: number;
}

export interface ModelConfig {
  inputShape: number[];
  hiddenLayers: number[];
  learningRate: number;
}