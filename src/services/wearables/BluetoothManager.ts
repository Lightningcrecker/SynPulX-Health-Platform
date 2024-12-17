import { EventEmitter } from 'events';
import { WearableDevice } from './types';

export class BluetoothManager extends EventEmitter {
  private static instance: BluetoothManager;
  private isScanning: boolean = false;

  private constructor() {
    super();
  }

  public static getInstance(): BluetoothManager {
    if (!BluetoothManager.instance) {
      BluetoothManager.instance = new BluetoothManager();
    }
    return BluetoothManager.instance;
  }

  async requestDevice(): Promise<BluetoothDevice | null> {
    if (this.isScanning) {
      throw new Error('Already scanning for devices');
    }

    try {
      this.isScanning = true;
      this.emit('scanStart');

      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { services: ['health_thermometer'] },
          { namePrefix: 'Fitbit' },
          { namePrefix: 'Apple Watch' },
          { namePrefix: 'Galaxy Watch' }
        ],
        optionalServices: ['battery_service', 'device_information']
      });

      return device;
    } catch (error) {
      // Handle user cancellation gracefully
      if (error instanceof Error && error.name === 'NotFoundError') {
        this.emit('scanCancelled');
        return null;
      }
      throw error;
    } finally {
      this.isScanning = false;
      this.emit('scanEnd');
    }
  }

  async connectToDevice(device: BluetoothDevice): Promise<boolean> {
    try {
      const server = await device.gatt?.connect();
      if (!server) return false;

      // Successfully connected
      this.emit('deviceConnected', device);
      return true;
    } catch (error) {
      this.emit('connectionError', error);
      return false;
    }
  }
}