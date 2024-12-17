import { SecureStorage } from '../encryption/SecureStorage';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: number;
  lastLogin: number;
  preferences?: {
    theme?: string;
    notifications?: boolean;
    language?: string;
  };
}

export class UserStorage {
  private static instance: UserStorage;
  private secureStorage: SecureStorage;
  private readonly USER_KEY = 'user_profile';
  private readonly SESSION_KEY = 'user_session';

  private constructor() {
    this.secureStorage = SecureStorage.getInstance();
  }

  public static getInstance(): UserStorage {
    if (!UserStorage.instance) {
      UserStorage.instance = new UserStorage();
    }
    return UserStorage.instance;
  }

  public saveUser(user: UserProfile): void {
    try {
      // Store in both secure storage and session storage
      this.secureStorage.setItem(this.USER_KEY, user);
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email
      }));
      // Also store in localStorage for persistence
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  public getUser(): UserProfile | null {
    try {
      // Try secure storage first
      const secureUser = this.secureStorage.getItem<UserProfile>(this.USER_KEY);
      if (secureUser) return secureUser;

      // Fall back to localStorage
      const storedUser = localStorage.getItem(this.USER_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // Sync with secure storage
        this.secureStorage.setItem(this.USER_KEY, user);
        return user;
      }

      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  public updateUser(updates: Partial<UserProfile>): void {
    const currentUser = this.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      this.saveUser(updatedUser);
    }
  }

  public clearUser(): void {
    try {
      this.secureStorage.removeItem(this.USER_KEY);
      sessionStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  }

  public isAuthenticated(): boolean {
    return !!this.getUser();
  }

  public getSession(): Partial<UserProfile> | null {
    try {
      const session = sessionStorage.getItem(this.SESSION_KEY);
      if (session) return JSON.parse(session);

      const user = this.getUser();
      if (user) {
        const sessionData = {
          id: user.id,
          name: user.name,
          email: user.email
        };
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
        return sessionData;
      }

      return null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }
}