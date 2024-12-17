export const symptoms = [
  // General
  { id: 'fever', name: 'Fever', category: 'General', severity: 'medium' },
  { id: 'fatigue', name: 'Fatigue', category: 'General', severity: 'medium' },
  { id: 'weakness', name: 'Weakness', category: 'General', severity: 'medium' },
  { id: 'malaise', name: 'General Discomfort', category: 'General', severity: 'low' },
  
  // Respiratory
  { id: 'cough', name: 'Cough', category: 'Respiratory', severity: 'medium' },
  { id: 'shortness_breath', name: 'Shortness of Breath', category: 'Respiratory', severity: 'high' },
  { id: 'chest_pain', name: 'Chest Pain', category: 'Respiratory', severity: 'high' },
  { id: 'wheezing', name: 'Wheezing', category: 'Respiratory', severity: 'medium' },
  
  // Add 90+ more symptoms here covering all major categories
  // This is just a sample, the full list should be much more comprehensive
  
  // Cardiovascular
  { id: 'palpitations', name: 'Heart Palpitations', category: 'Cardiovascular', severity: 'high' },
  { id: 'irregular_heartbeat', name: 'Irregular Heartbeat', category: 'Cardiovascular', severity: 'high' },
  { id: 'chest_pressure', name: 'Chest Pressure', category: 'Cardiovascular', severity: 'high' },
  { id: 'edema', name: 'Swelling in Extremities', category: 'Cardiovascular', severity: 'medium' },
  
  // Neurological
  { id: 'headache', name: 'Headache', category: 'Neurological', severity: 'medium' },
  { id: 'dizziness', name: 'Dizziness', category: 'Neurological', severity: 'medium' },
  { id: 'confusion', name: 'Confusion', category: 'Neurological', severity: 'high' },
  { id: 'memory_loss', name: 'Memory Loss', category: 'Neurological', severity: 'high' },
  
  // Continue with more symptoms...
];

export const symptomCategories = [
  'General',
  'Respiratory',
  'Cardiovascular',
  'Neurological',
  'Gastrointestinal',
  'Musculoskeletal',
  'Psychological',
  'Dermatological',
  'Endocrine',
  'Immune',
  'Reproductive',
  'Sensory'
];

export const getSymptomsByCategory = (category: string) =>
  symptoms.filter(s => s.category === category);

export const searchSymptoms = (query: string) =>
  symptoms.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.category.toLowerCase().includes(query.toLowerCase())
  );