import { symptoms, diseases, symptomDiseaseMap } from '../data/medicalData';

export class SymptomAnalyzer {
  private symptoms: Set<string> = new Set();
  
  analyzeSymptoms(selectedSymptoms: string[]): {
    possibleConditions: Array<{ name: string; probability: number }>;
    recommendations: string[];
    severity: 'mild' | 'moderate' | 'severe';
    shouldSeekCare: boolean;
  } {
    this.symptoms = new Set(selectedSymptoms);
    const conditions = this.calculatePossibleConditions();
    const severity = this.determineSeverity(conditions);
    
    return {
      possibleConditions: conditions,
      recommendations: this.generateRecommendations(conditions, severity),
      severity,
      shouldSeekCare: severity === 'severe' || conditions[0]?.probability > 0.8
    };
  }

  private calculatePossibleConditions(): Array<{ name: string; probability: number }> {
    const results = diseases.map(disease => {
      const matchingSymptoms = disease.symptoms.filter(s => this.symptoms.has(s));
      const probability = matchingSymptoms.length / disease.symptoms.length;
      
      return {
        name: disease.name,
        probability: Number((probability * 100).toFixed(2))
      };
    });

    return results
      .filter(r => r.probability > 20)
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5);
  }

  private determineSeverity(conditions: Array<{ name: string; probability: number }>): 'mild' | 'moderate' | 'severe' {
    const highestProbability = conditions[0]?.probability || 0;
    const symptomCount = this.symptoms.size;
    
    if (highestProbability > 80 || symptomCount > 5) return 'severe';
    if (highestProbability > 60 || symptomCount > 3) return 'moderate';
    return 'mild';
  }

  private generateRecommendations(
    conditions: Array<{ name: string; probability: number }>,
    severity: 'mild' | 'moderate' | 'severe'
  ): string[] {
    const recommendations: string[] = [];
    
    if (severity === 'severe') {
      recommendations.push('Seek immediate medical attention');
      recommendations.push('Document all symptoms and their onset times');
    } else if (severity === 'moderate') {
      recommendations.push('Schedule an appointment with your healthcare provider');
      recommendations.push('Monitor symptoms closely for any changes');
      recommendations.push('Rest and stay hydrated');
    } else {
      recommendations.push('Monitor symptoms for 24-48 hours');
      recommendations.push('Get adequate rest and maintain hydration');
      recommendations.push('Over-the-counter remedies may help relieve symptoms');
    }

    // Add condition-specific recommendations
    const topCondition = conditions[0]?.name;
    if (topCondition) {
      const conditionRecs = this.getConditionSpecificRecommendations(topCondition);
      recommendations.push(...conditionRecs);
    }

    return recommendations;
  }

  private getConditionSpecificRecommendations(condition: string): string[] {
    const recommendationMap: Record<string, string[]> = {
      'Common Cold': [
        'Use saline nasal drops',
        'Get plenty of rest',
        'Stay warm and hydrated'
      ],
      'Influenza': [
        'Rest in isolation to prevent spread',
        'Consider antiviral medications if caught early',
        'Monitor temperature regularly'
      ],
      'Migraine': [
        'Rest in a quiet, dark room',
        'Apply cold or warm compress',
        'Practice stress management techniques'
      ],
      // Add more conditions and their specific recommendations
    };

    return recommendationMap[condition] || [];
  }
}