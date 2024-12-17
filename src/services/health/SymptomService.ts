export interface Symptom {
  id: string;
  name: string;
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Disease {
  id: string;
  name: string;
  symptoms: string[];
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  recommendations: string[];
}

export class SymptomService {
  private static instance: SymptomService;
  private symptoms: Map<string, Symptom>;
  private diseases: Map<string, Disease>;

  private constructor() {
    this.symptoms = new Map();
    this.diseases = new Map();
    this.initializeData();
  }

  public static getInstance(): SymptomService {
    if (!SymptomService.instance) {
      SymptomService.instance = new SymptomService();
    }
    return SymptomService.instance;
  }

  private initializeData() {
    // Initialize with comprehensive symptom data
    const symptomsData: Symptom[] = [
      {
        id: 'fever',
        name: 'Fever',
        category: 'General',
        description: 'Elevated body temperature above normal range',
        severity: 'medium'
      },
      {
        id: 'cough',
        name: 'Cough',
        category: 'Respiratory',
        description: 'Sudden expulsion of air from the lungs',
        severity: 'medium'
      },
      // Add more symptoms...
    ];

    const diseasesData: Disease[] = [
      {
        id: 'covid19',
        name: 'COVID-19',
        symptoms: ['fever', 'cough', 'fatigue'],
        description: 'Infectious disease caused by the SARS-CoV-2 virus',
        severity: 'severe',
        recommendations: [
          'Isolate immediately',
          'Contact healthcare provider',
          'Monitor oxygen levels'
        ]
      },
      // Add more diseases...
    ];

    symptomsData.forEach(symptom => this.symptoms.set(symptom.id, symptom));
    diseasesData.forEach(disease => this.diseases.set(disease.id, disease));
  }

  public getAllSymptoms(): Symptom[] {
    return Array.from(this.symptoms.values());
  }

  public getSymptomsByCategory(category: string): Symptom[] {
    return Array.from(this.symptoms.values())
      .filter(symptom => symptom.category === category);
  }

  public analyzeSymptoms(symptomIds: string[]): {
    possibleDiseases: Array<{ disease: Disease; probability: number }>;
    recommendations: string[];
    severity: 'mild' | 'moderate' | 'severe';
  } {
    const results = Array.from(this.diseases.values()).map(disease => {
      const matchingSymptoms = symptomIds.filter(id => disease.symptoms.includes(id));
      const probability = (matchingSymptoms.length / disease.symptoms.length) * 100;

      return {
        disease,
        probability: Math.round(probability)
      };
    });

    const sortedResults = results
      .filter(result => result.probability > 30)
      .sort((a, b) => b.probability - a.probability);

    const recommendations = new Set<string>();
    sortedResults.forEach(result => {
      result.disease.recommendations.forEach(rec => recommendations.add(rec));
    });

    const severity = this.calculateOverallSeverity(symptomIds);

    return {
      possibleDiseases: sortedResults,
      recommendations: Array.from(recommendations),
      severity
    };
  }

  private calculateOverallSeverity(symptomIds: string[]): 'mild' | 'moderate' | 'severe' {
    const severityScores = {
      low: 1,
      medium: 2,
      high: 3
    };

    const totalScore = symptomIds.reduce((score, id) => {
      const symptom = this.symptoms.get(id);
      return score + (symptom ? severityScores[symptom.severity] : 0);
    }, 0);

    const averageScore = totalScore / symptomIds.length;

    if (averageScore > 2.5) return 'severe';
    if (averageScore > 1.5) return 'moderate';
    return 'mild';
  }
}