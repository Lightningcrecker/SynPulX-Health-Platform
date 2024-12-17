import { SecureStorage } from '../encryption/SecureStorage';

export class GoogleDriveStorage {
  private static instance: GoogleDriveStorage;
  private secureStorage: SecureStorage;
  private isAuthenticated: boolean = false;

  private constructor() {
    this.secureStorage = SecureStorage.getInstance();
  }

  public static getInstance(): GoogleDriveStorage {
    if (!GoogleDriveStorage.instance) {
      GoogleDriveStorage.instance = new GoogleDriveStorage();
    }
    return GoogleDriveStorage.instance;
  }

  async authenticate(): Promise<boolean> {
    try {
      // Google OAuth implementation
      const response = await gapi.auth2.getAuthInstance().signIn();
      this.isAuthenticated = response.isSignedIn();
      return this.isAuthenticated;
    } catch (error) {
      console.error('Google Drive authentication failed:', error);
      return false;
    }
  }

  async uploadEncryptedData(data: any): Promise<boolean> {
    if (!this.isAuthenticated) return false;

    try {
      const encryptedData = this.secureStorage.encrypt(data);
      const file = new Blob([encryptedData], { type: 'application/json' });
      
      const metadata = {
        name: `synpulx_backup_${new Date().toISOString()}.json`,
        mimeType: 'application/json',
        parents: ['appDataFolder'] // Store in app-specific folder
      };

      await gapi.client.drive.files.create({
        resource: metadata,
        media: file,
        fields: 'id'
      });

      return true;
    } catch (error) {
      console.error('Failed to upload to Google Drive:', error);
      return false;
    }
  }

  async downloadEncryptedData(): Promise<any | null> {
    if (!this.isAuthenticated) return null;

    try {
      const response = await gapi.client.drive.files.list({
        spaces: 'appDataFolder',
        fields: 'files(id, name)',
        orderBy: 'modifiedTime desc'
      });

      const files = response.result.files;
      if (files && files.length > 0) {
        const fileId = files[0].id;
        const fileData = await gapi.client.drive.files.get({
          fileId: fileId,
          alt: 'media'
        });

        return this.secureStorage.decrypt(fileData.body);
      }
      return null;
    } catch (error) {
      console.error('Failed to download from Google Drive:', error);
      return null;
    }
  }
}