import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { UserStorageService } from '../services/storage/UserStorageService';
import { SecureStorage } from '../services/encryption/SecureStorage';
import { useToaster } from '../components/shared/Toaster';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { showToast } = useToaster();
  
  const userStorage = UserStorageService.getInstance();
  const secureStorage = SecureStorage.getInstance();

  useEffect(() => {
    // Check for existing session
    const storedUser = userStorage.getUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const storedHash = secureStorage.getItem<string>(`password_${email}`);
      if (!storedHash) throw new Error('Invalid credentials');

      const isValid = await secureStorage.verifyPassword(password, storedHash);
      if (!isValid) throw new Error('Invalid credentials');

      const storedUser = userStorage.getUser();
      if (!storedUser) throw new Error('User data not found');

      setUser(storedUser);
      setIsAuthenticated(true);
      showToast('Successfully logged in', 'success');
    } catch (error) {
      showToast('Login failed', 'error');
      throw error;
    }
  }, [secureStorage, userStorage, showToast]);

  const logout = useCallback(async () => {
    try {
      userStorage.clearUser();
      setUser(null);
      setIsAuthenticated(false);
      showToast('Successfully logged out', 'success');
    } catch (error) {
      showToast('Logout failed', 'error');
      throw error;
    }
  }, [userStorage, showToast]);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      const hashedPassword = await secureStorage.hashPassword(password);
      const newUser = {
        id: crypto.randomUUID(),
        email,
        name,
        createdAt: Date.now(),
        lastLogin: Date.now()
      };

      secureStorage.setItem(`password_${email}`, hashedPassword);
      userStorage.saveUser(newUser);
      setUser(newUser);
      setIsAuthenticated(true);
      showToast('Account created successfully', 'success');
    } catch (error) {
      showToast('Signup failed', 'error');
      throw error;
    }
  }, [secureStorage, userStorage, showToast]);

  const updateProfile = useCallback(async (updates: any) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updatedUser = { ...user, ...updates };
      userStorage.saveUser(updatedUser);
      setUser(updatedUser);
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      showToast('Profile update failed', 'error');
      throw error;
    }
  }, [user, userStorage, showToast]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      signup,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};