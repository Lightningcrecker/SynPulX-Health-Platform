import React, { useState } from 'react';
import { Watch, Smartphone, Loader } from 'lucide-react';

interface WearableDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WearableDeviceModal: React.FC<WearableDeviceModalProps> = ({ isOpen, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);

  const startScan = async () => {
    setScanning(true);
    try {
      // Request Bluetooth device
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { services: ['health_thermometer'] },
          { namePrefix: 'Fitbit' },
          { namePrefix: 'Apple Watch' },
          { namePrefix: 'Galaxy Watch' }
        ],
        optionalServices: ['battery_service']
      });

      setDevices(prev => [...prev, device]);
    } catch (error) {
      console.error('Error scanning for devices:', error);
    } finally {
      setScanning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl border border-white/20 p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">Connect Wearable Device</h2>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={startScan}
            disabled={scanning}
            className="w-full p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2"
          >
            {scanning ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Watch className="h-5 w-5" />
            )}
            {scanning ? 'Scanning...' : 'Scan for Devices'}
          </button>

          {devices.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-white font-medium mb-2">Available Devices</h3>
              {devices.map((device, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <Watch className="h-5 w-5 text-blue-400" />
                    <span className="text-white">{device.name || 'Unknown Device'}</span>
                  </div>
                  <button className="text-sm text-blue-400 hover:text-blue-300">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};