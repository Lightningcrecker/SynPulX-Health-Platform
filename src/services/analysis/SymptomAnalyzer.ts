import { symptoms, symptomCategories } from '../data/symptoms';

export interface SymptomAnalysis {
  matchedSymptoms: Array<{
    id: string;
    name: string;
    category: string;
    severity: string;
  }>;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export class SymptomAnalyzer {
  analyzeSymptoms(text: string): SymptomAnalysis {
    const matchedSymptoms = this.findSymptoms(text);
    const severity = this.calculateSeverity(matchedSymptoms);
    const recommendations = this.generateRecommendations(matchedSymptoms, severity);

    return {
      matchedSymptoms,
      severity,
      recommendations
    };
  }

  private findSymptoms(text: string) {
    const words = text.toLowerCase().split(/\s+/);
    return symptoms.filter(symptom => 
      words.some(word => word.includes(symptom.name.toLowerCase()))
    );
  }

  private calculateSeverity(matchedSymptoms: typeof symptoms) {
    const severityScores = {
      low: 1,
      medium: 2,
      high: 3
    };

    const avgScore = matchedSymptoms.reduce((sum, symptom) => 
      sum + severityScores[symptom.severity as keyof typeof severityScores], 0
    ) / matchedSymptoms.length;

    if (avgScore >= 2.5) return 'high';
    if (avgScore >= 1.5) return 'medium';
    return 'low';
  }

  private generateRecommendations(
    matchedSymptoms: typeof symptoms,
    severity: string
  ): string[] {
    const recommendations = new Set<string>();

    // Severity-based recommendations
    if (severity === 'high') {
      recommendations.add('Seek immediate medical attention');
      recommendations.add('Document all symptoms and their progression');
    }

    // Category-specific recommendations
    const categories = new Set(matchedSymptoms.map(s => s.category));
    categories.forEach(category => {
      recommendations.add(...this.getCategoryRecommendations(category));
    });

    return Array.from(recommendations);
  }

  private getCategoryRecommendations(category: string): string[] {
    const recommendationMap: Record<string, string[]> = {
      General: [
        'Get adequate rest',
        'Stay hydrated',
        'Monitor symptoms'
      ],
      Respiratory: [
        'Practice deep breathing exercises',
        'Use a humidifier if needed',
        'Avoid respiratory irritants'
      ],
      Cardiovascular: [
        'Monitor blood pressure',
        'Limit sodium intake',
        'Stay physically active as tolerated'
      ],
      // Add more categories...
    };

    return recommendationMap[category] || [];
  }
}