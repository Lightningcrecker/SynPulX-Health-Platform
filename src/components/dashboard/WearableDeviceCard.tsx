import React, { useState } from 'react';
import { BluetoothManager } from '../../services/wearables/BluetoothManager';

const WearableDeviceCard: React.FC = () => {
  const [deviceData, setDeviceData] = useState<{
    heartRate?: number;
    spo2?: number;
    activity?: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await BluetoothManager.scanAndConnect();
      setDeviceData(data);
    } catch (err) {
      setError('Failed to connect to the device. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wearable-device-card">
      <h3>Wearable Device</h3>

      {loading && <p>Scanning for devices...</p>}

      {deviceData ? (
        <div>
          <p><strong>Heart Rate:</strong> {deviceData.heartRate ? `${deviceData.heartRate} BPM` : 'Not available'}</p>
          <p><strong>SpO2:</strong> {deviceData.spo2 ? `${deviceData.spo2}%` : 'Not available'}</p>
          <p><strong>Activity:</strong> {deviceData.activity || 'Not available'}</p>
        </div>
      ) : (
        <p>No device connected.</p>
      )}

      {error && <p className="error">{error}</p>}

      <button onClick={handleConnect} disabled={loading}>
        {loading ? 'Connecting...' : 'Connect to Wearable'}
      </button>
    </div>
  );
};

export default WearableDeviceCard;
