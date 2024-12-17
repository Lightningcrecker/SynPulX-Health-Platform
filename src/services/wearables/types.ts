export interface WearableDevice {
  id: string;
  name: string;
  type: string;
  connected: boolean;
}

export interface WearableMetrics {
  deviceId: string;
  metrics: {
    heartRate?: number;
    steps?: number;
    calories?: number;
    distance?: number;
    activeMinutes?: number;
    sleepScore?: number;
    timestamp: number;
  };
}