import * as tf from '@tensorflow/tfjs';

export class MedicalReportAnalyzer {
  private model: tf.LayersModel | null = null;

  async initialize(): Promise<void> {
    // Initialize TensorFlow model for medical report analysis
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [512], units: 256, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 128, activation: 'relu' }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ units: 32, activation: 'sigmoid' })
      ]
    });
  }

  async analyzeReport(file: File): Promise<{
    findings: string[];
    recommendations: string[];
    riskFactors: string[];
    metrics: {
      confidence: number;
      severity: 'low' | 'moderate' | 'high';
      urgency: 'routine' | 'soon' | 'immediate';
    };
  }> {
    try {
      const text = await this.extractTextFromFile(file);
      const analysis = await this.processText(text);
      
      return {
        findings: this.extractFindings(analysis),
        recommendations: this.generateRecommendations(analysis),
        riskFactors: this.identifyRiskFactors(analysis),
        metrics: this.calculateMetrics(analysis)
      };
    } catch (error) {
      console.error('Error analyzing medical report:', error);
      throw new Error('Failed to analyze medical report');
    }
  }

  private async extractTextFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  private async processText(text: string): Promise<any> {
    // Process text using NLP techniques
    const keywords = this.extractKeywords(text);
    const sections = this.identifySections(text);
    const values = this.extractNumericValues(text);
    
    return {
      keywords,
      sections,
      values
    };
  }

  private extractKeywords(text: string): string[] {
    const medicalTerms = [
      'diagnosis', 'treatment', 'symptoms', 'medication',
      'chronic', 'acute', 'condition', 'disease',
      'patient', 'history', 'examination', 'results'
    ];

    return text.toLowerCase()
      .split(/\W+/)
      .filter(word => medicalTerms.includes(word));
  }

  private identifySections(text: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const sectionPatterns = [
      { name: 'diagnosis', pattern: /diagnosis:?(.*?)(?=\n|$)/i },
      { name: 'symptoms', pattern: /symptoms:?(.*?)(?=\n|$)/i },
      { name: 'treatment', pattern: /treatment:?(.*?)(?=\n|$)/i },
      { name: 'medications', pattern: /medications?:?(.*?)(?=\n|$)/i }
    ];

    sectionPatterns.forEach(({ name, pattern }) => {
      const match = text.match(pattern);
      if (match) {
        sections[name] = match[1].trim();
      }
    });

    return sections;
  }

  private extractNumericValues(text: string): Record<string, number> {
    const values: Record<string, number> = {};
    const patterns = [
      { name: 'bloodPressure', pattern: /(\d{2,3}\/\d{2,3})\s*(?:mmHg)?/i },
      { name: 'heartRate', pattern: /heart rate:?\s*(\d{2,3})/i },
      { name: 'temperature', pattern: /temperature:?\s*(\d{2,3}(?:\.\d)?)/i }
    ];

    patterns.forEach(({ name, pattern }) => {
      const match = text.match(pattern);
      if (match) {
        values[name] = parseFloat(match[1]);
      }
    });

    return values;
  }

  private extractFindings(analysis: any): string[] {
    const findings: string[] = [];
    
    if (analysis.sections.diagnosis) {
      findings.push(`Diagnosis: ${analysis.sections.diagnosis}`);
    }
    
    if (analysis.sections.symptoms) {
      findings.push(`Reported Symptoms: ${analysis.sections.symptoms}`);
    }

    if (analysis.values.bloodPressure) {
      findings.push(`Blood Pressure: ${analysis.values.bloodPressure} mmHg`);
    }

    return findings;
  }

  private generateRecommendations(analysis: any): string[] {
    const recommendations: string[] = [];
    
    // Add general recommendations
    recommendations.push('Schedule a follow-up appointment');
    recommendations.push('Maintain a symptom diary');
    
    // Add condition-specific recommendations
    if (analysis.sections.treatment) {
      recommendations.push(`Follow prescribed treatment: ${analysis.sections.treatment}`);
    }
    
    if (analysis.sections.medications) {
      recommendations.push(`Take medications as prescribed: ${analysis.sections.medications}`);
    }

    return recommendations;
  }

  private identifyRiskFactors(analysis: any): string[] {
    const riskFactors: string[] = [];
    const riskKeywords = ['chronic', 'severe', 'history', 'recurring'];
    
    analysis.keywords.forEach((keyword: string) => {
      if (riskKeywords.includes(keyword)) {
        riskFactors.push(`Identified ${keyword} condition`);
      }
    });

    // Check vital signs
    if (analysis.values.bloodPressure) {
      const [systolic, diastolic] = analysis.values.bloodPressure.split('/').map(Number);
      if (systolic > 140 || diastolic > 90) {
        riskFactors.push('Elevated blood pressure');
      }
    }

    return riskFactors;
  }

  private calculateMetrics(analysis: any): {
    confidence: number;
    severity: 'low' | 'moderate' | 'high';
    urgency: 'routine' | 'soon' | 'immediate';
  } {
    const confidence = this.calculateConfidence(analysis);
    const severity = this.calculateSeverity(analysis);
    const urgency = this.calculateUrgency(analysis, severity);

    return { confidence, severity, urgency };
  }

  private calculateConfidence(analysis: any): number {
    let score = 0;
    
    // Add points for each identified section
    score += Object.keys(analysis.sections).length * 20;
    
    // Add points for numeric values
    score += Object.keys(analysis.values).length * 15;
    
    // Add points for keywords
    score += analysis.keywords.length * 5;
    
    return Math.min(Math.round(score), 100);
  }

  private calculateSeverity(analysis: any): 'low' | 'moderate' | 'high' {
    const severeKeywords = ['severe', 'critical', 'emergency', 'urgent'];
    const moderateKeywords = ['moderate', 'concerning', 'elevated'];
    
    const text = JSON.stringify(analysis).toLowerCase();
    
    if (severeKeywords.some(keyword => text.includes(keyword))) {
      return 'high';
    }
    
    if (moderateKeywords.some(keyword => text.includes(keyword))) {
      return 'moderate';
    }
    
    return 'low';
  }

  private calculateUrgency(
    analysis: any,
    severity: 'low' | 'moderate' | 'high'
  ): 'routine' | 'soon' | 'immediate' {
    if (severity === 'high') return 'immediate';
    if (severity === 'moderate') return 'soon';
    return 'routine';
  }
}