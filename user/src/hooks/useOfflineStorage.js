import { useState, useEffect } from 'react';
import { HazardReportService } from '../services/firebase.js';

export const useOfflineStorage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingReports, setPendingReports] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingReports();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending reports from localStorage on mount
    loadPendingReports();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load pending reports from localStorage
  const loadPendingReports = () => {
    try {
      const stored = localStorage.getItem('varuna-pending-reports');
      if (stored) {
        const reports = JSON.parse(stored);
        setPendingReports(reports);
      }
    } catch (error) {
      console.error('Error loading pending reports:', error);
    }
  };

  // Save pending reports to localStorage
  const savePendingReports = (reports) => {
    try {
      localStorage.setItem('varuna-pending-reports', JSON.stringify(reports));
      setPendingReports(reports);
    } catch (error) {
      console.error('Error saving pending reports:', error);
    }
  };

  // Add report to offline storage
  const addOfflineReport = (reportData) => {
    const offlineReport = {
      ...reportData,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isOffline: true,
      createdAt: new Date().toISOString(),
      status: 'pending_offline'
    };

    const updatedReports = [...pendingReports, offlineReport];
    savePendingReports(updatedReports);

    return { success: true, reportId: offlineReport.id };
  };

  // Remove report from offline storage
  const removeOfflineReport = (reportId) => {
    const updatedReports = pendingReports.filter(report => report.id !== reportId);
    savePendingReports(updatedReports);
  };

  // Sync pending reports when online
  const syncPendingReports = async () => {
    if (!isOnline || pendingReports.length === 0) return;

    setIsSyncing(true);
    const reportsToSync = [...pendingReports];
    const syncedReports = [];
    const failedReports = [];

    for (const report of reportsToSync) {
      try {
        // Remove offline-specific fields
        const { isOffline, status, ...cleanReport } = report;
        
        const result = await HazardReportService.createReport(cleanReport);
        
        if (result.success) {
          syncedReports.push(report.id);
          removeOfflineReport(report.id);
        } else {
          failedReports.push({ report, error: result.error });
        }
      } catch (error) {
        failedReports.push({ report, error: error.message });
      }
    }

    setIsSyncing(false);

    // Show sync results
    if (syncedReports.length > 0) {
      console.log(`✅ Synced ${syncedReports.length} reports`);
    }

    if (failedReports.length > 0) {
      console.error(`❌ Failed to sync ${failedReports.length} reports`);
      // You might want to show a notification to the user
    }

    return {
      synced: syncedReports.length,
      failed: failedReports.length,
      failedReports
    };
  };

  // Get offline report by ID
  const getOfflineReport = (reportId) => {
    return pendingReports.find(report => report.id === reportId);
  };

  // Update offline report
  const updateOfflineReport = (reportId, updates) => {
    const updatedReports = pendingReports.map(report => 
      report.id === reportId 
        ? { ...report, ...updates, updatedAt: new Date().toISOString() }
        : report
    );
    savePendingReports(updatedReports);
  };

  // Clear all offline data
  const clearOfflineData = () => {
    localStorage.removeItem('varuna-pending-reports');
    setPendingReports([]);
  };

  // Get storage usage info
  const getStorageInfo = () => {
    try {
      const reports = JSON.stringify(pendingReports);
      const sizeInBytes = new Blob([reports]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      
      return {
        reportCount: pendingReports.length,
        sizeInBytes,
        sizeInKB,
        maxSize: 5 * 1024 * 1024, // 5MB limit
        isNearLimit: sizeInBytes > 4 * 1024 * 1024 // 4MB warning
      };
    } catch (error) {
      return {
        reportCount: 0,
        sizeInBytes: 0,
        sizeInKB: '0',
        maxSize: 5 * 1024 * 1024,
        isNearLimit: false
      };
    }
  };

  return {
    isOnline,
    pendingReports,
    isSyncing,
    addOfflineReport,
    removeOfflineReport,
    syncPendingReports,
    getOfflineReport,
    updateOfflineReport,
    clearOfflineData,
    getStorageInfo
  };
};

