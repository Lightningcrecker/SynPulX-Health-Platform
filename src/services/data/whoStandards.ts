export const WHOStandards = {
  bodySystems: [
    {
      name: 'Cardiovascular',
      keywords: ['heart', 'pulse', 'cardiac', 'circulation', 'blood pressure']
    },
    {
      name: 'Respiratory',
      keywords: ['lung', 'breathing', 'respiratory', 'oxygen', 'airway']
    },
    {
      name: 'Neurological',
      keywords: ['brain', 'neural', 'cognitive', 'consciousness', 'mental']
    },
    // Add more body systems...
  ],

  vitalSignRanges: {
    bloodPressure: {
      systolic: { low: 90, normal: 120, high: 140, critical: 180 },
      diastolic: { low: 60, normal: 80, high: 90, critical: 120 }
    },
    heartRate: { low: 60, normal: 80, high: 100, critical: 120 },
    temperature: { low: 35.5, normal: 37, high: 38.3, critical: 40 },
    respiratoryRate: { low: 12, normal: 16, high: 20, critical: 24 },
    oxygenSaturation: { low: 92, normal: 97, critical: 90 }
  },

  riskConditions: [
    {
      keyword: 'diabetes',
      riskDescription: 'History of diabetes requires careful monitoring',
      priority: 'high'
    },
    {
      keyword: 'hypertension',
      riskDescription: 'Hypertension increases cardiovascular risk',
      priority: 'high'
    },
    // Add more conditions...
  ],

  medicationInteractions: [
    {
      medications: ['warfarin', 'aspirin'],
      riskDescription: 'Increased bleeding risk with combined anticoagulants',
      priority: 'high'
    },
    // Add more interactions...
  ],

  recommendations: {
    Cardiovascular: [
      'Regular blood pressure monitoring',
      'Heart-healthy diet',
      'Regular cardiovascular exercise'
    ],
    Respiratory: [
      'Monitor oxygen saturation',
      'Breathing exercises',
      'Avoid respiratory irritants'
    ],
    // Add more system-specific recommendations...
  }
};