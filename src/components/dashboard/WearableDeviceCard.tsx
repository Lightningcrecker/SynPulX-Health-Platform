import React from 'react';
import { Watch, Activity, Heart } from 'lucide-react';
import { useWearableDevices } from '../../hooks/useWearableDevices';

export const WearableDeviceCard: React.FC = () => {
  const { devices, isScanning, metrics, scanForDevices, connectDevice } = useWearableDevices();

  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Watch className="h-6 w-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Wearable Devices</h3>
        </div>
        <button
          onClick={scanForDevices}
          disabled={isScanning}
          className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors disabled:opacity-50"
        >
          {isScanning ? 'Scanning...' : 'Scan for Devices'}
        </button>
      </div>

      {devices.length > 0 ? (
        <div className="space-y-4">
          {devices.map(device => (
            <div
              key={device.id}
              className="p-4 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Watch className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-medium">{device.name}</span>
                </div>
                {!device.connected && (
                  <button
                    onClick={() => connectDevice(device.id)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Connect
                  </button>
                )}
              </div>
              {device.connected && metrics?.deviceId === device.id && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-400" />
                    <span className="text-gray-300">
                      {metrics.metrics.heartRate} BPM
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">
                      {metrics.metrics.steps} steps
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          No devices found. Click scan to search for nearby devices.
        </div>
      )}
    </div>
  );
};