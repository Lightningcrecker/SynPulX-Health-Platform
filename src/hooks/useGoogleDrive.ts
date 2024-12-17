import { useState, useCallback } from 'react';
import { GoogleDriveStorage } from '@services/storage/GoogleDriveStorage';
import { useToaster } from '@components/shared/Toaster';

export const useGoogleDrive = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToaster();
  const driveStorage = GoogleDriveStorage.getInstance();

  const connectDrive = useCallback(async () => {
    setIsConnecting(true);
    try {
      const success = await driveStorage.authenticate();
      if (success) {
        showToast('Successfully connected to Google Drive', 'success');
      } else {
        showToast('Failed to connect to Google Drive', 'error');
      }
      return success;
    } catch (error) {
      showToast('Error connecting to Google Drive', 'error');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [showToast]);

  const backupData = useCallback(async (data: any) => {
    setIsUploading(true);
    try {
      const success = await driveStorage.uploadEncryptedData(data);
      if (success) {
        showToast('Data backed up successfully', 'success');
      } else {
        showToast('Failed to backup data', 'error');
      }
      return success;
    } catch (error) {
      showToast('Error backing up data', 'error');
      return false;
    } finally {
      setIsUploading(false);
    }
  }, [showToast]);

  return {
    connectDrive,
    backupData,
    isConnecting,
    isUploading
  };
};