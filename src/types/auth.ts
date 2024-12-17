export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: number;
  lastLogin: number;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark';
  notifications?: boolean;
  language?: string;
  healthGoals?: {
    dailySteps?: number;
    sleepHours?: number;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}