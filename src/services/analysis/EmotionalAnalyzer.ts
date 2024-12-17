export interface EmotionalAnalysis {
  state: string;
  confidence: number;
  recommendations: string[];
}

export class EmotionalAnalyzer {
  private readonly emotionalPatterns = {
    stressed: ['stressed', 'overwhelmed', 'anxiety', 'worried'],
    fatigued: ['tired', 'exhausted', 'fatigue', 'drained'],
    positive: ['happy', 'energetic', 'motivated', 'great'],
    frustrated: ['frustrated', 'angry', 'annoyed', 'upset'],
    depressed: ['sad', 'depressed', 'down', 'hopeless']
  };

  analyzeEmotionalState(text: string): EmotionalAnalysis {
    const words = text.toLowerCase().split(/\s+/);
    const matches = new Map<string, number>();

    Object.entries(this.emotionalPatterns).forEach(([state, patterns]) => {
      const count = patterns.filter(pattern => 
        words.some(word => word.includes(pattern))
      ).length;
      if (count > 0) matches.set(state, count);
    });

    if (matches.size === 0) {
      return {
        state: 'neutral',
        confidence: 100,
        recommendations: this.getGeneralRecommendations()
      };
    }

    const [state, count] = Array.from(matches.entries())
      .sort((a, b) => b[1] - a[1])[0];

    const confidence = Math.min(100, count * 25);
    const recommendations = this.getRecommendations(state);

    return { state, confidence, recommendations };
  }

  private getRecommendations(state: string): string[] {
    const recommendationMap: Record<string, string[]> = {
      stressed: [
        'Practice deep breathing exercises',
        'Try meditation or mindfulness',
        'Take regular breaks',
        'Consider stress management techniques'
      ],
      fatigued: [
        'Ensure adequate sleep',
        'Maintain a regular sleep schedule',
        'Consider energy management techniques',
        'Review your daily routine'
      ],
      frustrated: [
        'Take a break from the situation',
        'Practice calming techniques',
        'Express your feelings constructively',
        'Consider talking to someone'
      ],
      depressed: [
        'Reach out to a mental health professional',
        'Maintain social connections',
        'Establish a daily routine',
        'Practice self-care activities'
      ]
    };

    return recommendationMap[state] || this.getGeneralRecommendations();
  }

  private getGeneralRecommendations(): string[] {
    return [
      'Maintain a balanced lifestyle',
      'Practice regular exercise',
      'Ensure adequate sleep',
      'Stay connected with others'
    ];
  }
}