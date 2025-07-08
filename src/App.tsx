import React, { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { Scanner } from './components/scanner/Scanner';
import { ManufacturerDashboard } from './components/manufacturer/ManufacturerDashboard';
import { ProductView } from './components/product/ProductView';
import { useAppStore } from './store/useAppStore';

function App() {
  const { currentView, error, clearError, setUser, setConnected } = useAppStore();
  
  // Mock user connection on app start
  useEffect(() => {
    // Simulate wallet connection
    const mockUser = {
      address: '0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c',
      name: 'John Manufacturer',
      role: 'manufacturer' as const,
      company: 'TechCorp Industries',
      verified: true,
    };
    
    setUser(mockUser);
    setConnected(true);
  }, [setUser, setConnected]);
  
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'scanner':
        return <Scanner />;
      case 'manufacturer':
        return <ManufacturerDashboard />;
      case 'product':
        return <ProductView />;
      default:
        return <Dashboard />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Error notification */}
      {error && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-4 mt-4 rounded-r-lg">
          <div className="flex items-center justify-between">
            <p className="text-green-700">{error}</p>
            <button
              onClick={clearError}
              className="text-green-400 hover:text-green-600"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;