import { useState, useEffect } from 'react';
import { WearableService } from '../services/wearables/WearableService';

interface WearableData {
  heartRate: number;
  heartRateChange: number;
  steps: number;
  stepsChange: number;
  sleepScore: number;
  sleepChange: number;
  weeklyScore: number;
  weeklyChange: number;
  bloodOxygen?: number;
  temperature?: number;
}

export const useWearableData = () => {
  const [latestData, setLatestData] = useState<WearableData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wearableService = WearableService.getInstance();

  useEffect(() => {
    const handleData = (data: Partial<WearableData>) => {
      setLatestData(prev => {
        if (!prev) {
          return {
            heartRate: data.heartRate || 70,
            heartRateChange: 0,
            steps: data.steps || 0,
            stepsChange: 0,
            sleepScore: data.sleepScore || 80,
            sleepChange: 0,
            weeklyScore: 85,
            weeklyChange: 0,
            bloodOxygen: data.bloodOxygen,
            temperature: data.temperature
          };
        }
        
        const newData = { ...prev };
        
        if (data.heartRate) {
          newData.heartRate = data.heartRate;
          newData.heartRateChange = data.heartRate - prev.heartRate;
        }
        
        if (data.steps) {
          newData.steps = data.steps;
          newData.stepsChange = data.steps - prev.steps;
        }
        
        if (data.sleepScore) {
          newData.sleepScore = data.sleepScore;
          newData.sleepChange = data.sleepScore - prev.sleepScore;
        }

        if (data.bloodOxygen) {
          newData.bloodOxygen = data.bloodOxygen;
        }

        if (data.temperature) {
          newData.temperature = data.temperature;
        }

        // Calculate weekly score based on all metrics
        const metrics = [
          newData.heartRate / 100,
          newData.steps / 10000,
          newData.sleepScore / 100,
          (newData.bloodOxygen || 95) / 100,
          ((newData.temperature || 36.5) - 35) / 3
        ];
        
        newData.weeklyScore = Math.round(
          metrics.reduce((acc, val) => acc + val, 0) / metrics.length * 100
        );
        newData.weeklyChange = newData.weeklyScore - prev.weeklyScore;

        return newData;
      });
    };

    wearableService.on('data', handleData);
    setIsConnected(wearableService.isConnected());
    
    return () => {
      wearableService.removeListener('data', handleData);
    };
  }, []);

  const connect = async () => {
    try {
      setError(null);
      const success = await wearableService.connect();
      setIsConnected(success);
      if (!success) {
        setError('Failed to connect to device');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setIsConnected(false);
    }
  };

  const disconnect = async () => {
    try {
      await wearableService.disconnect();
      setIsConnected(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Disconnection failed');
    }
  };

  return {
    latestData,
    isConnected,
    error,
    connect,
    disconnect,
    deviceName: wearableService.getDeviceName()
  };
};