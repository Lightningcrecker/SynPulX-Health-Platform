import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToasterProvider } from './components/shared/Toaster';
import { AuthProvider } from './contexts/AuthContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { DnaBackground } from './components/shared/DnaBackground';
import { AppRoutes } from './routes';
import { ScrollToTop } from './components/shared/ScrollToTop';
import { AdBanner } from './components/shared/AdBanner';
import { ErrorBoundary } from './components/shared/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ToasterProvider>
        <BrowserRouter>
          <AuthProvider>
            <DatabaseProvider>
              <div className="relative min-h-screen">
                <DnaBackground />
                <ScrollToTop />
                <AppRoutes />
                <AdBanner />
              </div>
            </DatabaseProvider>
          </AuthProvider>
        </BrowserRouter>
      </ToasterProvider>
    </ErrorBoundary>
  );
}

export default App;