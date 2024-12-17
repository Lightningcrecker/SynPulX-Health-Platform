import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToasterContextType {
  showToast: (message: string, type: Toast['type']) => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export const ToasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToasterContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-green-500/20 border border-green-500/50 text-green-200'
                : toast.type === 'error'
                ? 'bg-red-500/20 border border-red-500/50 text-red-200'
                : 'bg-blue-500/20 border border-blue-500/50 text-blue-200'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToasterContext.Provider>
  );
};

export const useToaster = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider');
  }
  return context;
};