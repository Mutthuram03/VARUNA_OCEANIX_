import React from 'react';
import { useOfflineStorage } from '../hooks/useOfflineStorage.js';
import Icon from './AppIcon';

const OfflineIndicator = () => {
  const { isOnline, pendingReports, isSyncing, syncPendingReports, getStorageInfo } = useOfflineStorage();
  const storageInfo = getStorageInfo();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg">
        <div className="flex items-center">
          <Icon name="WifiOff" className="w-5 h-5 mr-2" />
          <div className="flex-1">
            <h3 className="font-semibold">You're offline</h3>
            <p className="text-sm">
              {pendingReports.length} report{pendingReports.length !== 1 ? 's' : ''} pending sync
            </p>
            {storageInfo.isNearLimit && (
              <p className="text-xs text-yellow-700 mt-1">
                Storage almost full ({storageInfo.sizeInKB}KB used)
              </p>
            )}
          </div>
          <button
            onClick={syncPendingReports}
            disabled={isSyncing || pendingReports.length === 0}
            className="ml-2 p-1 rounded hover:bg-yellow-200 disabled:opacity-50"
          >
            <Icon 
              name={isSyncing ? "Loader2" : "RefreshCw"} 
              className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;

