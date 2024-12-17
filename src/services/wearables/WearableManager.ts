import { EventEmitter } from 'events';
import { WearableDevice } from './types';
import { BluetoothManager } from './BluetoothManager';
import { HealthMetricsCollector } from './HealthMetricsCollector';
import { analytics } from '../../utils/analytics';

export class WearableManager extends EventEmitter {
  private static instance: WearableManager;
  private connectedDevices: Map<string, WearableDevice> = new Map();
  private bluetoothManager: BluetoothManager;
  private metricsCollector: HealthMetricsCollector;

  private constructor() {
    super();
    this.bluetoothManager = BluetoothManager.getInstance();
    this.metricsCollector = new HealthMetricsCollector();
    this.setupEventListeners();
  }

  public static getInstance(): WearableManager {
    if (!WearableManager.instance) {
      WearableManager.instance = new WearableManager();
    }
    return WearableManager.instance;
  }

  private setupEventListeners(): void {
    this.bluetoothManager.on('scanStart', () => {
      this.emit('scanning', true);
    });

    this.bluetoothManager.on('scanEnd', () => {
      this.emit('scanning', false);
    });

    this.bluetoothManager.on('scanCancelled', () => {
      this.emit('scanCancelled');
    });

    this.bluetoothManager.on('deviceConnected', (device: BluetoothDevice) => {
      this.handleDeviceConnection(device);
    });
  }

  async scanForDevices(): Promise<WearableDevice[]> {
    try {
      const device = await this.bluetoothManager.requestDevice();
      
      if (device) {
        const wearableDevice: WearableDevice = {
          id: device.id,
          name: device.name || 'Unknown Device',
          type: this.determineDeviceType(device.name || ''),
          connected: false
        };

        this.connectedDevices.set(device.id, wearableDevice);
        analytics.trackEvent({
          category: 'Wearables',
          action: 'DeviceFound',
          label: wearableDevice.type
        });

        return Array.from(this.connectedDevices.values());
      }

      return [];
    } catch (error) {
      analytics.trackEvent({
        category: 'Wearables',
        action: 'ScanError',
        label: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private determineDeviceType(name: string): string {
    if (name.includes('Fitbit')) return 'Fitbit';
    if (name.includes('Apple')) return 'Apple Watch';
    if (name.includes('Galaxy')) return 'Samsung';
    return 'Unknown';
  }

  private async handleDeviceConnection(device: BluetoothDevice): Promise<void> {
    const wearableDevice = this.connectedDevices.get(device.id);
    if (!wearableDevice) return;

    wearableDevice.connected = true;
    this.emit('deviceConnected', wearableDevice);
    
    // Start collecting metrics
    this.metricsCollector.startCollection(device);
    
    analytics.trackEvent({
      category: 'Wearables',
      action: 'DeviceConnected',
      label: wearableDevice.type
    });
  }

  getConnectedDevices(): WearableDevice[] {
    return Array.from(this.connectedDevices.values());
  }
}