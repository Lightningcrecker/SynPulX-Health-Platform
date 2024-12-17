export interface WearableDevice {
  id: string;
  name: string;
  type: 'fitbit' | 'apple_watch' | 'samsung' | 'other';
  connected: boolean;
  lastSync?: number;
  batteryLevel?: number;
}

export interface WearableMetrics {
  deviceId: string;
  timestamp: number;
  metrics: {
    heartRate?: number;
    steps?: number;
    calories?: number;
    distance?: number;
    activeMinutes?: number;
    sleepScore?: number;
  };
}