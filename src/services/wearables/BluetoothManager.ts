// src/services/wearables/BluetoothManager.ts

export class BluetoothManager {
  /**
   * Scans for Bluetooth devices, connects to the selected device,
   * and reads heart rate, SpO2, and activity data.
   */
  static async scanAndConnect() {
    try {
      // Request a Bluetooth device
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          'heart_rate',
          'oximeter', // Custom service for SpO2 (if supported by the device)
          'activity_monitor', // Custom service for activity data
        ],
      });

      console.log(`Device selected: ${device.name}`);

      // Connect to the device's GATT server
      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error('Failed to connect to GATT server.');
      }
      console.log('Connected to GATT server.');

      // Data Object to Store Results
      const results: { heartRate?: number; spo2?: number; activity?: string } = {};

      // Heart Rate Service
      const heartRateService = await server.getPrimaryService('heart_rate');
      const heartRateCharacteristic = await heartRateService.getCharacteristic('heart_rate_measurement');
      const heartRateValue = await heartRateCharacteristic.readValue();
      const heartRate = heartRateValue.getUint8(1); // Assuming value is in the 2nd byte
      results.heartRate = heartRate;
      console.log(`Heart Rate: ${heartRate} BPM`);

      // SpO2 (Oxygen Saturation) Service
      try {
        const oximeterService = await server.getPrimaryService('oximeter');
        const spo2Characteristic = await oximeterService.getCharacteristic('oximeter_measurement');
        const spo2Value = await spo2Characteristic.readValue();
        const spo2 = spo2Value.getUint8(1); // Assuming value is in the 2nd byte
        results.spo2 = spo2;
        console.log(`SpO2: ${spo2}%`);
      } catch (error) {
        console.warn('SpO2 service not available on this device.');
      }

      // Activity Monitor Service
      try {
        const activityService = await server.getPrimaryService('activity_monitor');
        const activityCharacteristic = await activityService.getCharacteristic('activity_data');
        const activityValue = await activityCharacteristic.readValue();
        const activity = new TextDecoder().decode(activityValue); // Assuming string data
        results.activity = activity;
        console.log(`Activity: ${activity}`);
      } catch (error) {
        console.warn('Activity monitor service not available on this device.');
      }

      return results;
    } catch (error) {
      console.error('Error during Bluetooth scan and connection:', error);
      throw error;
    }
  }
}
