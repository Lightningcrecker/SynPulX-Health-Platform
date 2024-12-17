import * as tf from '@tensorflow/tfjs';
import { Matrix } from 'ml-matrix';
import { RandomForestRegression as RandomForest } from 'ml-random-forest';

export class AIService {
  private static instance: AIService;
  private model: tf.LayersModel | null = null;
  private forestModel: RandomForest | null = null;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Initialize TensorFlow model
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

      // Initialize Random Forest
      this.forestModel = new RandomForest({
        seed: 3,
        maxFeatures: 0.8,
        replacement: true,
        nEstimators: 25
      });

      await this.trainModels();
    } catch (error) {
      console.error('Error initializing AI models:', error);
      throw error;
    }
  }

  private async trainModels(): Promise<void> {
    // Train with sample data
    const sampleData = this.generateSampleData();
    const matrix = new Matrix(sampleData);
    
    if (this.forestModel) {
      const features = matrix.subMatrix(0, matrix.rows - 1, 0, matrix.columns - 2);
      const labels = matrix.subMatrix(0, matrix.rows - 1, matrix.columns - 1, matrix.columns - 1);
      this.forestModel.train(features.to2DArray(), labels.to2DArray().map(r => r[0]));
    }
  }

  private generateSampleData(): number[][] {
    // Generate synthetic training data
    return Array.from({ length: 1000 }, () => {
      const heartRate = 60 + Math.random() * 40;
      const steps = Math.random() * 10000;
      const sleepHours = 5 + Math.random() * 4;
      const healthScore = (heartRate / 100 + steps / 10000 + sleepHours / 8) / 3;
      return [heartRate, steps, sleepHours, healthScore];
    });
  }

  async analyzeSentiment(text: string): Promise<{
    sentiment: string;
    confidence: number;
  }> {
    const words = text.toLowerCase().split(/\s+/);
    const positiveWords = ['good', 'better', 'great', 'improved', 'well', 'happy'];
    const negativeWords = ['bad', 'worse', 'poor', 'pain', 'tired', 'sick'];

    let score = 0;
    let relevantWords = 0;

    words.forEach(word => {
      if (positiveWords.includes(word)) {
        score++;
        relevantWords++;
      } else if (negativeWords.includes(word)) {
        score--;
        relevantWords++;
      }
    });

    const confidence = relevantWords > 0 ? Math.min(1, relevantWords / 5) : 0.5;
    const sentiment = score >= 0 ? 'positive' : 'negative';

    return { sentiment, confidence: confidence * 100 };
  }

  async analyzeSymptoms(description: string): Promise<{
    category: string;
    confidence: number;
    predictions: Array<{ condition: string; probability: number }>;
  }> {
    const symptoms = this.extractSymptoms(description);
    const category = this.categorizeSymptoms(symptoms);
    const predictions = this.predictConditions(symptoms);

    return {
      category,
      confidence: 0.7 + Math.random() * 0.3, // Simplified confidence calculation
      predictions
    };
  }

  private extractSymptoms(text: string): string[] {
    const commonSymptoms = [
      'headache', 'fever', 'cough', 'fatigue',
      'pain', 'nausea', 'dizziness', 'weakness'
    ];
    return text.toLowerCase()
      .split(/\s+/)
      .filter(word => commonSymptoms.includes(word));
  }

  private categorizeSymptoms(symptoms: string[]): string {
    const categories = {
      neurological: ['headache', 'dizziness'],
      respiratory: ['cough', 'breath'],
      general: ['fever', 'fatigue', 'weakness']
    };

    let maxCategory = 'general';
    let maxCount = 0;

    Object.entries(categories).forEach(([category, categorySymptoms]) => {
      const count = symptoms.filter(s => categorySymptoms.includes(s)).length;
      if (count > maxCount) {
        maxCount = count;
        maxCategory = category;
      }
    });

    return maxCategory;
  }

  private predictConditions(symptoms: string[]): Array<{ condition: string; probability: number }> {
    const conditions = [
      { name: 'Common Cold', symptoms: ['cough', 'fever', 'fatigue'] },
      { name: 'Migraine', symptoms: ['headache', 'nausea', 'dizziness'] },
      { name: 'Flu', symptoms: ['fever', 'cough', 'weakness'] }
    ];

    return conditions.map(condition => ({
      condition: condition.name,
      probability: this.calculateProbability(symptoms, condition.symptoms)
    })).sort((a, b) => b.probability - a.probability);
  }

  private calculateProbability(userSymptoms: string[], conditionSymptoms: string[]): number {
    const matchingSymptoms = userSymptoms.filter(s => conditionSymptoms.includes(s)).length;
    return matchingSymptoms / conditionSymptoms.length;
  }

  async analyzeMedicalReport(file: File): Promise<{
    findings: string[];
    recommendations: string[];
    riskFactors: string[];
  }> {
    // Simplified report analysis
    return {
      findings: ['Sample finding 1', 'Sample finding 2'],
      recommendations: ['Sample recommendation 1', 'Sample recommendation 2'],
      riskFactors: ['Sample risk factor 1']
    };
  }
}