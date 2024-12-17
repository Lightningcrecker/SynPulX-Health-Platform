export interface HealthMetric {
  value: number;
  unit: string;
  timestamp: number;
  category: 'heart' | 'activity' | 'sleep' | 'nutrition';
}

export const calculateHealthScore = (metrics: HealthMetric[]): number => {
  const weights = {
    heart: 0.3,
    activity: 0.25,
    sleep: 0.25,
    nutrition: 0.2
  };

  const categoryScores = Object.entries(weights).map(([category, weight]) => {
    const categoryMetrics = metrics.filter(m => m.category === category);
    if (!categoryMetrics.length) return 0;

    const normalizedValues = categoryMetrics.map(m => normalizeMetric(m));
    const avgScore = normalizedValues.reduce((sum, val) => sum + val, 0) / normalizedValues.length;
    
    return avgScore * weight;
  });

  return Math.round(categoryScores.reduce((sum, score) => sum + score, 0) * 100);
};

const normalizeMetric = (metric: HealthMetric): number => {
  const ranges = {
    heart: { min: 60, max: 100, ideal: 70 },
    activity: { min: 0, max: 10000, ideal: 8000 },
    sleep: { min: 0, max: 10, ideal: 8 },
    nutrition: { min: 0, max: 100, ideal: 80 }
  };

  const range = ranges[metric.category];
  const normalized = (metric.value - range.min) / (range.max - range.min);
  const distance = Math.abs(metric.value - range.ideal) / (range.max - range.min);
  
  return Math.max(0, 1 - distance);
};

export const analyzeHealthTrends = (metrics: HealthMetric[]): {
  trend: 'improving' | 'stable' | 'declining';
  details: string[];
  recommendations: string[];
} => {
  const recentMetrics = metrics.slice(-7); // Last 7 days
  const scores = recentMetrics.map(m => normalizeMetric(m));
  
  const trend = calculateTrend(scores);
  const details = generateTrendDetails(recentMetrics);
  const recommendations = generateRecommendations(trend, recentMetrics);

  return { trend, details, recommendations };
};

const calculateTrend = (scores: number[]): 'improving' | 'stable' | 'declining' => {
  if (scores.length < 2) return 'stable';
  
  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const secondHalf = scores.slice(Math.floor(scores.length / 2));
  
  const firstAvg = average(firstHalf);
  const secondAvg = average(secondHalf);
  const difference = secondAvg - firstAvg;
  
  if (difference > 0.1) return 'improving';
  if (difference < -0.1) return 'declining';
  return 'stable';
};

const average = (numbers: number[]): number => 
  numbers.reduce((sum, num) => sum + num, 0) / numbers.length;

const generateTrendDetails = (metrics: HealthMetric[]): string[] => {
  const details: string[] = [];
  const categories = ['heart', 'activity', 'sleep', 'nutrition'] as const;
  
  categories.forEach(category => {
    const categoryMetrics = metrics.filter(m => m.category === category);
    if (categoryMetrics.length > 0) {
      const trend = calculateTrend(categoryMetrics.map(m => normalizeMetric(m)));
      details.push(`${category.charAt(0).toUpperCase() + category.slice(1)} metrics are ${trend}`);
    }
  });

  return details;
};

const generateRecommendations = (
  trend: 'improving' | 'stable' | 'declining',
  metrics: HealthMetric[]
): string[] => {
  const recommendations: string[] = [];

  if (trend === 'declining') {
    recommendations.push('Consider consulting with a healthcare professional');
    recommendations.push('Review and adjust your daily routine');
  }

  // Category-specific recommendations
  metrics.forEach(metric => {
    const normalized = normalizeMetric(metric);
    if (normalized < 0.6) {
      switch (metric.category) {
        case 'heart':
          recommendations.push('Focus on cardiovascular exercises');
          recommendations.push('Practice stress management techniques');
          break;
        case 'activity':
          recommendations.push('Increase daily physical activity');
          recommendations.push('Set achievable step count goals');
          break;
        case 'sleep':
          recommendations.push('Establish a consistent sleep schedule');
          recommendations.push('Create a relaxing bedtime routine');
          break;
        case 'nutrition':
          recommendations.push('Track and balance your daily nutrition');
          recommendations.push('Consider consulting a nutritionist');
          break;
      }
    }
  });

  return [...new Set(recommendations)]; // Remove duplicates
};