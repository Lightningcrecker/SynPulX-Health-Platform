import { SecureStorage } from '../encryption/SecureStorage';
import { v4 as uuidv4 } from 'uuid';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: number;
  lastLogin: number;
  subscription?: {
    plan: string;
    status: string;
    expiresAt: number;
  };
  healthData?: {
    lastSync: number;
    deviceId?: string;
    deviceName?: string;
  };
}

export class UserStorageService {
  private static instance: UserStorageService;
  private readonly USER_KEY = 'user_profile';
  private readonly SESSION_KEY = 'user_session';
  private secureStorage: SecureStorage;

  private constructor() {
    this.secureStorage = SecureStorage.getInstance();
    this.initializeFromLocalStorage();
  }

  public static getInstance(): UserStorageService {
    if (!UserStorageService.instance) {
      UserStorageService.instance = new UserStorageService();
    }
    return UserStorageService.instance;
  }

  private initializeFromLocalStorage(): void {
    try {
      const encryptedUser = localStorage.getItem(this.USER_KEY);
      if (encryptedUser) {
        const user = this.secureStorage.decrypt(encryptedUser);
        this.secureStorage.setItem(this.USER_KEY, user);
      }
    } catch (error) {
      console.error('Failed to initialize from localStorage:', error);
      // Clear potentially corrupted data
      localStorage.removeItem(this.USER_KEY);
      sessionStorage.removeItem(this.SESSION_KEY);
    }
  }

  public saveUser(user: UserProfile): void {
    try {
      if (!user.id) {
        user.id = uuidv4();
      }

      const encryptedUser = this.secureStorage.encrypt(user);
      localStorage.setItem(this.USER_KEY, encryptedUser);
      
      const sessionData = {
        id: user.id,
        name: user.name,
        email: user.email
      };
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      
      this.secureStorage.setItem(this.USER_KEY, user);
    } catch (error) {
      console.error('Failed to save user:', error);
      throw new Error('Failed to save user data');
    }
  }

  public getUser(): UserProfile | null {
    try {
      const user = this.secureStorage.getItem<UserProfile>(this.USER_KEY);
      if (user) return user;

      const encryptedUser = localStorage.getItem(this.USER_KEY);
      if (encryptedUser) {
        const user = this.secureStorage.decrypt(encryptedUser);
        this.secureStorage.setItem(this.USER_KEY, user);
        return user;
      }

      return null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  // ... rest of the class implementation remains the same
}