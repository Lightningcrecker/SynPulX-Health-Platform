export class HealthNLP {
  private readonly emotionalPatterns = {
    positive: [
      'energetic', 'well-rested', 'great', 'better', 'good', 'happy',
      'improving', 'strong', 'focused', 'relaxed'
    ],
    negative: [
      'tired', 'fatigue', 'pain', 'weak', 'stressed', 'anxious',
      'worried', 'difficulty', 'trouble', 'poor'
    ]
  };

  private readonly symptomPatterns = {
    Respiratory: ['cough', 'breathing', 'shortness of breath', 'wheezing'],
    Cardiovascular: ['chest pain', 'palpitations', 'heart racing'],
    Neurological: ['headache', 'dizziness', 'migraine', 'confusion'],
    Gastrointestinal: ['nausea', 'stomach', 'digestion', 'appetite']
  };

  async initialize(): Promise<void> {
    // Initialize any required resources
    return Promise.resolve();
  }

  analyzeSentiment(text: string): {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
  } {
    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;

    words.forEach(word => {
      if (this.emotionalPatterns.positive.some(pattern => word.includes(pattern))) {
        positiveScore++;
      }
      if (this.emotionalPatterns.negative.some(pattern => word.includes(pattern))) {
        negativeScore++;
      }
    });

    const totalScore = positiveScore + negativeScore;
    if (totalScore === 0) return { sentiment: 'neutral', confidence: 100 };

    const sentiment = positiveScore > negativeScore ? 'positive' : 
                     negativeScore > positiveScore ? 'negative' : 'neutral';
    
    const confidence = Math.round((Math.max(positiveScore, negativeScore) / totalScore) * 100);

    return { sentiment, confidence };
  }

  extractHealthContext(text: string): {
    symptoms: Array<{ name: string; category: string; severity: string }>;
    emotionalState: string | null;
    lifestyle: {
      sleep: string;
      activity: string;
      stress: string;
    };
  } {
    const words = text.toLowerCase().split(/\s+/);
    const symptoms: Array<{ name: string; category: string; severity: string }> = [];
    
    // Extract symptoms
    Object.entries(this.symptomPatterns).forEach(([category, patterns]) => {
      patterns.forEach(pattern => {
        if (text.includes(pattern)) {
          symptoms.push({
            name: pattern,
            category,
            severity: this.determineSeverity(text, pattern)
          });
        }
      });
    });

    // Determine emotional state
    const emotionalState = this.determineEmotionalState(words);

    // Analyze lifestyle factors
    const lifestyle = this.analyzeLifestyleFactors(text);

    return {
      symptoms,
      emotionalState,
      lifestyle
    };
  }

  private determineSeverity(text: string, symptom: string): string {
    const severityIndicators = {
      high: ['severe', 'intense', 'extreme', 'unbearable'],
      medium: ['moderate', 'noticeable', 'uncomfortable'],
      low: ['mild', 'slight', 'minor']
    };

    const context = text.toLowerCase().split(/[.!?]/).find(sentence => 
      sentence.includes(symptom)
    ) || '';

    for (const [level, indicators] of Object.entries(severityIndicators)) {
      if (indicators.some(indicator => context.includes(indicator))) {
        return level;
      }
    }

    return 'medium';
  }

  private determineEmotionalState(words: string[]): string | null {
    const emotionalStates = {
      stressed: ['stressed', 'overwhelmed', 'anxiety', 'worried'],
      fatigued: ['tired', 'exhausted', 'fatigue', 'drained'],
      positive: ['happy', 'energetic', 'motivated', 'great']
    };

    for (const [state, indicators] of Object.entries(emotionalStates)) {
      if (words.some(word => indicators.includes(word))) {
        return state;
      }
    }

    return null;
  }

  private analyzeLifestyleFactors(text: string): {
    sleep: string;
    activity: string;
    stress: string;
  } {
    const sleepPatterns = {
      poor: ['trouble sleeping', 'insomnia', 'poor sleep'],
      good: ['well rested', 'good sleep', 'sleeping well']
    };

    const activityPatterns = {
      low: ['sedentary', 'inactive', 'not exercising'],
      high: ['active', 'exercise', 'working out']
    };

    const stressPatterns = {
      high: ['stressed', 'anxiety', 'overwhelmed'],
      low: ['relaxed', 'calm', 'peaceful']
    };

    return {
      sleep: this.matchPatterns(text, sleepPatterns),
      activity: this.matchPatterns(text, activityPatterns),
      stress: this.matchPatterns(text, stressPatterns)
    };
  }

  private matchPatterns(text: string, patterns: Record<string, string[]>): string {
    for (const [level, indicators] of Object.entries(patterns)) {
      if (indicators.some(indicator => text.includes(indicator))) {
        return level;
      }
    }
    return 'normal';
  }
}