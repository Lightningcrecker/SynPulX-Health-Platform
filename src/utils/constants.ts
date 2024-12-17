export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  HEALTH: '/api/health',
  WEARABLES: '/api/wearables',
  ANALYTICS: '/api/analytics'
};

export const HEALTH_METRICS = {
  HEART_RATE: {
    normal: { min: 60, max: 100 },
    unit: 'bpm'
  },
  BLOOD_PRESSURE: {
    normal: { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 } },
    unit: 'mmHg'
  },
  TEMPERATURE: {
    normal: { min: 36.1, max: 37.2 },
    unit: '°C'
  },
  OXYGEN_SATURATION: {
    normal: { min: 95, max: 100 },
    unit: '%'
  }
};

export const STORAGE_KEYS = {
  USER: 'user_data',
  AUTH_TOKEN: 'auth_token',
  PREFERENCES: 'user_preferences',
  HEALTH_DATA: 'health_data'
};

export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    SESSION_EXPIRED: 'Your session has expired. Please login again',
    UNAUTHORIZED: 'You are not authorized to perform this action'
  },
  HEALTH: {
    DATA_SYNC_FAILED: 'Failed to sync health data',
    DEVICE_CONNECTION_FAILED: 'Failed to connect to device',
    ANALYSIS_FAILED: 'Failed to analyze health data'
  }
};