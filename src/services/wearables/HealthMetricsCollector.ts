import { EventEmitter } from 'events';
import { HealthMetrics } from '../types/health';

export class HealthMetricsCollector extends EventEmitter {
  private collectionIntervals: Map<string, NodeJS.Timer> = new Map();

  async startCollection(device: BluetoothDevice): Promise<void> {
    try {
      const server = await device.gatt?.connect();
      if (!server) return;

      // Set up services and characteristics
      await this.setupHealthServices(server, device.id);
    } catch (error) {
      console.error('Error starting health metrics collection:', error);
      this.emit('collectionError', { deviceId: device.id, error });
    }
  }

  private async setupHealthServices(
    server: BluetoothRemoteGATTServer,
    deviceId: string
  ): Promise<void> {
    try {
      // Heart rate monitoring
      const heartRateService = await server.getPrimaryService('heart_rate');
      const heartRateChar = await heartRateService.getCharacteristic('heart_rate_measurement');
      
      await heartRateChar.startNotifications();
      heartRateChar.addEventListener('characteristicvaluechanged', (event: Event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
        if (value) {
          const heartRate = value.getUint8(1);
          this.emit('healthData', {
            deviceId,
            metrics: { heartRate, timestamp: Date.now() }
          });
        }
      });

      // Simulate other metrics for demo
      const interval = setInterval(() => {
        this.emit('healthData', {
          deviceId,
          metrics: {
            steps: Math.floor(Math.random() * 1000),
            calories: Math.floor(Math.random() * 100),
            distance: Math.random() * 1,
            activeMinutes: Math.floor(Math.random() * 60),
            sleepScore: Math.floor(Math.random() * 100),
            timestamp: Date.now()
          }
        });
      }, 5000);

      this.collectionIntervals.set(deviceId, interval);
    } catch (error) {
      console.error('Error setting up health services:', error);
      this.emit('serviceError', { deviceId, error });
    }
  }

  stopCollection(deviceId: string): void {
    const interval = this.collectionIntervals.get(deviceId);
    if (interval) {
      clearInterval(interval);
      this.collectionIntervals.delete(deviceId);
    }
  }
}