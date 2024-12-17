import React, { createContext, useContext, useEffect, useState } from 'react';
import { openDB, IDBPDatabase } from 'idb';

interface DatabaseContextType {
  db: IDBPDatabase | null;
  isLoading: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
  db: null,
  isLoading: true,
  error: null,
});

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<IDBPDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await openDB('synpulx-db', 1, {
          upgrade(db) {
            // Health data store
            if (!db.objectStoreNames.contains('healthData')) {
              db.createObjectStore('healthData', { keyPath: 'id', autoIncrement: true });
            }
            
            // User preferences store
            if (!db.objectStoreNames.contains('preferences')) {
              db.createObjectStore('preferences', { keyPath: 'userId' });
            }
            
            // Analytics store
            if (!db.objectStoreNames.contains('analytics')) {
              db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
            }
          },
        });
        
        setDb(database);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize database'));
      } finally {
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isLoading, error }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};