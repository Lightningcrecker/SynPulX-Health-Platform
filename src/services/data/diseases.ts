export const diseases = [
  {
    id: 'common_cold',
    name: 'Common Cold',
    symptoms: ['cough', 'sore_throat', 'fever', 'fatigue'],
    severity: 'mild',
    urgency: 'low',
    recommendations: [
      'Rest and stay hydrated',
      'Over-the-counter cold medications may help',
      'Monitor symptoms for worsening'
    ]
  },
  {
    id: 'flu',
    name: 'Influenza',
    symptoms: ['fever', 'headache', 'muscle_pain', 'fatigue', 'cough'],
    severity: 'moderate',
    urgency: 'medium',
    recommendations: [
      'Rest and isolate to prevent spread',
      'Stay hydrated and monitor temperature',
      'Consider antiviral medications if caught early'
    ]
  },
  {
    id: 'covid19',
    name: 'COVID-19',
    symptoms: ['fever', 'cough', 'shortness_breath', 'fatigue', 'loss_taste_smell'],
    severity: 'severe',
    urgency: 'high',
    recommendations: [
      'Isolate immediately',
      'Contact healthcare provider',
      'Monitor oxygen levels',
      'Seek emergency care if breathing becomes difficult'
    ]
  },
  // Add more diseases with detailed information
];

export const diseaseCategories = {
  respiratory: ['common_cold', 'flu', 'covid19', 'pneumonia'],
  cardiovascular: ['hypertension', 'arrhythmia', 'heart_disease'],
  neurological: ['migraine', 'tension_headache', 'vertigo'],
  // Add more categories
};