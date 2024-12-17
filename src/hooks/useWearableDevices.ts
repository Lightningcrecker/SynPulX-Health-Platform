import { useState, useEffect, useCallback } from 'react';
import { WearableManager } from '../services/wearables/WearableManager';
import { WearableDevice, WearableMetrics } from '../services/wearables/types';
import { useToaster } from '../components/shared/Toaster';

export const useWearableDevices = () => {
  const [devices, setDevices] = useState<WearableDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [metrics, setMetrics] = useState<WearableMetrics | null>(null);
  const { showToast } = useToaster();
  const wearableManager = WearableManager.getInstance();

  useEffect(() => {
    const handleHealthData = (data: WearableMetrics) => {
      setMetrics(data);
    };

    wearableManager.on('healthData', handleHealthData);
    return () => {
      wearableManager.removeListener('healthData', handleHealthData);
    };
  }, []);

  const scanForDevices = useCallback(async () => {
    try {
      setIsScanning(true);
      const foundDevices = await wearableManager.scanForDevices();
      setDevices(foundDevices);
      showToast('Device scan complete', 'success');
    } catch (error) {
      showToast('Failed to scan for devices', 'error');
    } finally {
      setIsScanning(false);
    }
  }, [showToast]);

  const connectDevice = useCallback(async (deviceId: string) => {
    try {
      const success = await wearableManager.connectDevice(deviceId);
      if (success) {
        showToast('Device connected successfully', 'success');
        setDevices(wearableManager.getConnectedDevices());
      } else {
        showToast('Failed to connect device', 'error');
      }
      return success;
    } catch (error) {
      showToast('Error connecting device', 'error');
      return false;
    }
  }, [showToast]);

  return {
    devices,
    isScanning,
    metrics,
    scanForDevices,
    connectDevice
  };
};