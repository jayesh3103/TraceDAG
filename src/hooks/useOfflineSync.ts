import { useState, useEffect, useCallback } from 'react';

interface OfflineCheckpoint {
  id: string;
  productId: string;
  location: string;
  handler: string;
  notes?: string;
  timestamp: string;
  synced: boolean;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCheckpoints, setPendingCheckpoints] = useState<OfflineCheckpoint[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending checkpoints from localStorage
    const stored = localStorage.getItem('pendingCheckpoints');
    if (stored) {
      setPendingCheckpoints(JSON.parse(stored));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveOfflineCheckpoint = useCallback((checkpoint: Omit<OfflineCheckpoint, 'id' | 'synced'>) => {
    const newCheckpoint: OfflineCheckpoint = {
      ...checkpoint,
      id: `offline-${Date.now()}`,
      synced: false,
    };

    const updated = [...pendingCheckpoints, newCheckpoint];
    setPendingCheckpoints(updated);
    localStorage.setItem('pendingCheckpoints', JSON.stringify(updated));
  }, [pendingCheckpoints]);

  const syncPendingCheckpoints = useCallback(async () => {
    if (!isOnline || pendingCheckpoints.length === 0) return;

    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const synced = pendingCheckpoints.map(cp => ({ ...cp, synced: true }));
    setPendingCheckpoints([]);
    localStorage.removeItem('pendingCheckpoints');

    return synced;
  }, [isOnline, pendingCheckpoints]);

  return {
    isOnline,
    pendingCheckpoints,
    saveOfflineCheckpoint,
    syncPendingCheckpoints,
    hasPendingSync: pendingCheckpoints.length > 0,
  };
};