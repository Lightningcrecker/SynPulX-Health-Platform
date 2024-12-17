import { EventEmitter } from 'events';

interface WearableData {
  heartRate?: number;
  steps?: number;
  sleepScore?: number;
  temperature?: number;
  bloodOxygen?: number;
}

export class WearableService extends EventEmitter {
  private static instance: WearableService;
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private characteristics: Map<string, BluetoothRemoteGATTCharacteristic> = new Map();
  private connected: boolean = false;

  private constructor() {
    super();
  }

  public static getInstance(): WearableService {
    if (!WearableService.instance) {
      WearableService.instance = new WearableService();
    }
    return WearableService.instance;
  }

  async connect(): Promise<boolean> {
    try {
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { services: ['health_thermometer'] },
          { namePrefix: 'Fitbit' },
          { namePrefix: 'Apple Watch' },
          { namePrefix: 'Galaxy Watch' }
        ],
        optionalServices: [
          'battery_service',
          'health_thermometer',
          'heart_rate',
          'blood_oxygen'
        ]
      });

      if (!this.device) {
        throw new Error('No device selected');
      }

      this.server = await this.device.gatt?.connect();
      if (!this.server) {
        throw new Error('Failed to connect to device');
      }

      await this.setupServices();
      this.connected = true;
      this.startDataCollection();

      return true;
    } catch (error) {
      console.error('Connection failed:', error);
      return false;
    }
  }

  private async setupServices(): Promise<void> {
    if (!this.server) return;

    try {
      // Heart Rate Service
      const heartRateService = await this.server.getPrimaryService('heart_rate');
      const heartRateChar = await heartRateService.getCharacteristic('heart_rate_measurement');
      this.characteristics.set('heartRate', heartRateChar);

      // Other services can be added here
      // Temperature, Blood Oxygen, etc.
    } catch (error) {
      console.error('Error setting up services:', error);
    }
  }

  private startDataCollection(): void {
    // Heart Rate Monitoring
    const heartRateChar = this.characteristics.get('heartRate');
    if (heartRateChar) {
      heartRateChar.startNotifications();
      heartRateChar.addEventListener('characteristicvaluechanged', (event: Event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
        if (value) {
          const heartRate = value.getUint8(1);
          this.emit('data', { heartRate });
        }
      });
    }

    // Simulate other metrics for demo
    setInterval(() => {
      const simulatedData: WearableData = {
        steps: Math.floor(Math.random() * 1000),
        sleepScore: Math.floor(Math.random() * 100),
        temperature: 36.5 + Math.random(),
        bloodOxygen: 95 + Math.floor(Math.random() * 5)
      };
      this.emit('data', simulatedData);
    }, 5000);
  }

  async disconnect(): Promise<void> {
    if (this.device && this.device.gatt?.connected) {
      await this.device.gatt.disconnect();
    }
    this.connected = false;
    this.device = null;
    this.server = null;
    this.characteristics.clear();
  }

  isConnected(): boolean {
    return this.connected;
  }

  getDeviceName(): string | null {
    return this.device?.name || null;
  }
}