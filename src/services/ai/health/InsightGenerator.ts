import { HealthPrediction } from './types';
import { TrendAnalysis } from './TrendAnalyzer';

export class InsightGenerator {
  static generateInsights(
    predictions: HealthPrediction,
    trends: TrendAnalysis
  ): string[] {
    const insights: string[] = [];

    // Add overall health insights
    if (predictions.overall > 80) {
      insights.push('Your overall health metrics are excellent');
    } else if (predictions.overall < 60) {
      insights.push('Your health metrics indicate room for improvement');
    }

    // Add trend-based insights
    if (trends.direction === 'improving' && trends.confidence > 70) {
      insights.push('Your health metrics show consistent improvement');
    } else if (trends.direction === 'declining' && trends.confidence > 70) {
      insights.push('Your health metrics indicate a declining trend');
    }

    return insights;
  }

  static generateRecommendations(
    predictions: HealthPrediction,
    trends: TrendAnalysis
  ): string[] {
    const recommendations: string[] = [];

    // Add metric-specific recommendations
    Object.entries(predictions).forEach(([metric, value]) => {
      if (value < 70) {
        recommendations.push(...this.getMetricRecommendations(metric));
      }
    });

    // Add trend-based recommendations
    if (trends.direction === 'declining' && trends.confidence > 70) {
      recommendations.push('Schedule a health check-up');
      recommendations.push('Review and adjust your daily routine');
    }

    return [...new Set(recommendations)]; // Remove duplicates
  }

  private static getMetricRecommendations(metric: string): string[] {
    const recommendationMap: Record<string, string[]> = {
      physical: [
        'Increase daily physical activity',
        'Consider adding strength training'
      ],
      mental: [
        'Practice stress management techniques',
        'Consider mindfulness exercises'
      ],
      sleep: [
        'Improve sleep hygiene',
        'Maintain consistent sleep schedule'
      ]
    };

    return recommendationMap[metric] || [];
  }
}