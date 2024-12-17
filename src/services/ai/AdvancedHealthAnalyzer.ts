import * as tf from '@tensorflow/tfjs';
import { HealthNLP } from '../nlp/HealthNLP';
import { WHOStandards } from '../data/whoStandards';
import { EmotionalAnalyzer } from '../analysis/EmotionalAnalyzer';
import { SymptomAnalyzer } from '../analysis/SymptomAnalyzer';

export class AdvancedHealthAnalyzer {
  private model: tf.LayersModel | null = null;
  private nlp: HealthNLP;
  private emotionalAnalyzer: EmotionalAnalyzer;
  private symptomAnalyzer: SymptomAnalyzer;
  private initialized: boolean = false;

  constructor() {
    this.nlp = new HealthNLP();
    this.emotionalAnalyzer = new EmotionalAnalyzer();
    this.symptomAnalyzer = new SymptomAnalyzer();
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await tf.ready();
      await this.nlp.initialize();
      await this.loadModel();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize AdvancedHealthAnalyzer:', error);
      throw new Error('Health analyzer initialization failed');
    }
  }

  private async loadModel(): Promise<void> {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [128], units: 256, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 128, activation: 'relu' }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ units: 32, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
  }

  async analyzeHealthData(input: { text: string }): Promise<{
    sentiment: { sentiment: string; confidence: number };
    insights: {
      symptoms: Array<{ id: string; name: string; category: string; severity: string }>;
      severity: string;
      recommendations: string[];
      riskFactors: string[];
    };
  }> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Analyze emotional state
      const emotionalAnalysis = this.emotionalAnalyzer.analyzeEmotionalState(input.text);
      
      // Analyze symptoms
      const symptomAnalysis = this.symptomAnalyzer.analyzeSymptoms(input.text);
      
      // Extract health context
      const healthContext = this.nlp.extractHealthContext(input.text);

      return {
        sentiment: {
          sentiment: emotionalAnalysis.state,
          confidence: emotionalAnalysis.confidence
        },
        insights: {
          symptoms: symptomAnalysis.matchedSymptoms,
          severity: symptomAnalysis.severity,
          recommendations: [
            ...symptomAnalysis.recommendations,
            ...emotionalAnalysis.recommendations
          ],
          riskFactors: this.identifyRiskFactors(symptomAnalysis, healthContext)
        }
      };
    } catch (error) {
      console.error('Analysis error:', error);
      throw new Error('Failed to analyze health data');
    }
  }

  private identifyRiskFactors(
    symptomAnalysis: any,
    healthContext: any
  ): string[] {
    const riskFactors = new Set<string>();

    if (symptomAnalysis.severity === 'high') {
      riskFactors.add('Multiple severe symptoms detected');
    }

    if (healthContext.lifestyle?.stress === 'high') {
      riskFactors.add('High stress levels detected');
    }

    if (healthContext.lifestyle?.sleep === 'poor') {
      riskFactors.add('Poor sleep patterns identified');
    }

    return Array.from(riskFactors);
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}