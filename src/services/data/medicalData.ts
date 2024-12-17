export const symptoms = [
  { id: 'fever', name: 'Fever', category: 'General' },
  { id: 'headache', name: 'Headache', category: 'Neurological' },
  { id: 'fatigue', name: 'Fatigue', category: 'General' },
  { id: 'cough', name: 'Cough', category: 'Respiratory' },
  { id: 'sore_throat', name: 'Sore Throat', category: 'Respiratory' },
  { id: 'muscle_pain', name: 'Muscle Pain', category: 'Musculoskeletal' },
  { id: 'shortness_breath', name: 'Shortness of Breath', category: 'Respiratory' },
  { id: 'loss_taste_smell', name: 'Loss of Taste or Smell', category: 'Neurological' },
  { id: 'nausea', name: 'Nausea', category: 'Gastrointestinal' },
  { id: 'diarrhea', name: 'Diarrhea', category: 'Gastrointestinal' },
  // Add more symptoms...
];

export const symptomCategories = [
  'General',
  'Respiratory',
  'Cardiovascular',
  'Gastrointestinal',
  'Neurological',
  'Musculoskeletal',
  'Psychological',
  'Dermatological'
];

export const diseases = [
  {
    id: 'common_cold',
    name: 'Common Cold',
    symptoms: ['cough', 'sore_throat', 'fever', 'fatigue'],
    severity: 'mild',
    urgency: 'low'
  },
  {
    id: 'flu',
    name: 'Influenza',
    symptoms: ['fever', 'headache', 'muscle_pain', 'fatigue', 'cough'],
    severity: 'moderate',
    urgency: 'medium'
  },
  {
    id: 'migraine',
    name: 'Migraine',
    symptoms: ['headache', 'nausea', 'sensitivity_light'],
    severity: 'moderate',
    urgency: 'medium'
  },
  // Add more diseases...
];

export const symptomDiseaseMap = new Map<string, string[]>();
diseases.forEach(disease => {
  disease.symptoms.forEach(symptom => {
    if (!symptomDiseaseMap.has(symptom)) {
      symptomDiseaseMap.set(symptom, []);
    }
    symptomDiseaseMap.get(symptom)?.push(disease.id);
  });
});