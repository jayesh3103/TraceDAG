import React from 'react';
import { WifiOff, Wifi, CloudOff, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface OfflineIndicatorProps {
  isOnline: boolean;
  pendingSync: number;
  onSync?: () => void;
  isSyncing?: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  isOnline,
  pendingSync,
  onSync,
  isSyncing = false,
}) => {
  if (isOnline && pendingSync === 0) return null;

  return (
    <div className={`fixed top-20 left-4 right-4 z-40 mx-auto max-w-md ${
      !isOnline ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200' :
      'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200'
    } backdrop-blur-lg rounded-2xl shadow-xl border p-4 animate-in slide-in-from-top-2 duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {!isOnline ? (
            <WifiOff className="w-5 h-5" />
          ) : (
            <CloudOff className="w-5 h-5" />
          )}
          <div>
            <p className="font-medium text-sm">
              {!isOnline ? 'You\'re offline' : 'Pending sync'}
            </p>
            <p className="text-xs opacity-90">
              {!isOnline 
                ? 'Changes will be saved locally' 
                : `${pendingSync} checkpoint${pendingSync !== 1 ? 's' : ''} waiting to sync`
              }
            </p>
          </div>
        </div>
        
        {isOnline && pendingSync > 0 && onSync && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSync}
            loading={isSyncing}
            className="bg-white/50 hover:bg-white/70 border-current"
          >
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Wifi className="w-4 h-4 mr-1" />
                Sync
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};