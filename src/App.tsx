import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { BottomNavigation } from './components/ui/BottomNavigation';
import { FloatingActionButton } from './components/ui/FloatingActionButton';
import { ToastContainer } from './components/ui/Toast';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import { ManufacturerDashboard } from './pages/ManufacturerDashboard';
import { CheckpointScanner } from './pages/CheckpointScanner';
import { CustomerView } from './pages/CustomerView';
import { AdminDashboard } from './pages/AdminDashboard';
import { useToast } from './hooks/useToast';
import { useOfflineSync } from './hooks/useOfflineSync';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('customer');
  const { toasts, removeToast } = useToast();
  const { isOnline, pendingCheckpoints, syncPendingCheckpoints, hasPendingSync } = useOfflineSync();
  const [isSyncing, setIsSyncing] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'manufacturer':
        return <ManufacturerDashboard />;
      case 'scanner':
        return <CheckpointScanner />;
      case 'customer':
        return <CustomerView />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <CustomerView />;
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncPendingCheckpoints();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFABClick = () => {
    if (currentPage === 'customer') {
      // For customer page, trigger QR scanner directly
      const event = new CustomEvent('openQRScanner');
      window.dispatchEvent(event);
    } else if (currentPage === 'scanner') {
      // For scanner page, trigger QR scanner
      const event = new CustomEvent('openQRScanner');
      window.dispatchEvent(event);
    } else {
      setCurrentPage('manufacturer');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 flex flex-col">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <OfflineIndicator
        isOnline={isOnline}
        pendingSync={pendingCheckpoints.length}
        onSync={handleSync}
        isSyncing={isSyncing}
      />
      
      <main className="flex-1 pb-20 md:pb-0">
        {renderPage()}
      </main>
      
      <Footer />
      
      <BottomNavigation currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <FloatingActionButton
        onClick={handleFABClick}
        icon={currentPage === 'customer' || currentPage === 'scanner' ? 'camera' : 'add'}
      />
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;