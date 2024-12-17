import { SecureStorage } from '../encryption/SecureStorage';

export interface HealthData {
  userId: string;
  timestamp: number;
  metrics: {
    heartRate?: number;
    steps?: number;
    sleepScore?: number;
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    };
    weight?: number;
    temperature?: number;
  };
}

export class HealthDataStorage {
  private static readonly HEALTH_DATA_KEY = 'health_data_';
  private secureStorage: SecureStorage;

  constructor() {
    this.secureStorage = SecureStorage.getInstance();
  }

  private getKey(userId: string): string {
    return `${HealthDataStorage.HEALTH_DATA_KEY}${userId}`;
  }

  public saveHealthData(data: HealthData): void {
    const key = this.getKey(data.userId);
    const existingData = this.secureStorage.getItem<HealthData[]>(key) || [];
    existingData.push(data);
    this.secureStorage.setItem(key, existingData);
  }

  public getHealthData(userId: string): HealthData[] {
    const key = this.getKey(userId);
    return this.secureStorage.getItem<HealthData[]>(key) || [];
  }

  public clearHealthData(userId: string): void {
    const key = this.getKey(userId);
    this.secureStorage.removeItem(key);
  }

  public getLatestHealthData(userId: string): HealthData | null {
    const data = this.getHealthData(userId);
    return data.length > 0 ? data[data.length - 1] : null;
  }
}