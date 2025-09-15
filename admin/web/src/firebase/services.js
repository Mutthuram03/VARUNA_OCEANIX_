// Firebase services for admin app
import { db, storage } from './config.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Collection names
const COLLECTIONS = {
  HAZARD_REPORTS: 'hazardReports',
  ALERTS: 'alerts',
  USERS: 'users',
  SOCIAL_MEDIA_POSTS: 'socialMediaPosts',
};

// Hazard Report Service
export const HazardReportService = {
  getReports: async (filters = {}) => {
    try {
      let q = collection(db, COLLECTIONS.HAZARD_REPORTS);
      
      // Apply filters
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      
      if (filters.severity) {
        q = query(q, where('severity', '==', filters.severity));
      }
      
      if (filters.timeRange) {
        const days = filters.timeRange === '24h' ? 1 : 
                    filters.timeRange === '7d' ? 7 : 
                    filters.timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        q = query(q, where('createdAt', '>=', startDate));
      }
      
      // Order by creation date
      q = query(q, orderBy('createdAt', 'desc'));
      
      // Apply limit
      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }
      
      const querySnapshot = await getDocs(q);
      const reports = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      return { success: true, reports };
    } catch (error) {
      console.error('Error getting reports:', error);
      return { success: false, error: error.message };
    }
  },

  updateReportStatus: async (reportId, status, updatedBy, comment) => {
    try {
      const docRef = doc(db, COLLECTIONS.HAZARD_REPORTS, reportId);
      await updateDoc(docRef, {
        status,
        updatedBy,
        comment,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating report status:', error);
      return { success: false, error: error.message };
    }
  }
};

// Alert Service
export const AlertService = {
  createAlert: async (alertData) => {
    try {
      // Validate required fields
      if (!alertData.title || !alertData.message) {
        throw new Error('Title and message are required');
      }

      const cleanData = {
        title: alertData.title,
        message: alertData.message,
        severity: alertData.severity || 'medium',
        region: alertData.region || '',
        active: alertData.active !== false,
        channels: Array.isArray(alertData.channels) ? alertData.channels : [],
        expiresAt: alertData.expiresAt || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: 'admin', // You can update this based on authentication
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.ALERTS), cleanData);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating alert:', error);
      return { success: false, error: error.message };
    }
  },

  getActiveAlerts: async (filters = {}) => {
    try {
      let q = collection(db, COLLECTIONS.ALERTS);
      q = query(q, where('active', '==', true));

      if (filters.severity) {
        q = query(q, where('severity', '==', filters.severity));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      const alerts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { success: true, alerts };
    } catch (error) {
      console.error('Error getting alerts:', error);
      return { success: false, error: error.message };
    }
  },

  getAllAlerts: async (filters = {}) => {
    try {
      let q = collection(db, COLLECTIONS.ALERTS);

      if (filters.active !== undefined) {
        q = query(q, where('active', '==', filters.active));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      const alerts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { success: true, alerts };
    } catch (error) {
      console.error('Error getting alerts:', error);
      return { success: false, error: error.message };
    }
  }
};

// Analytics Service
export const AnalyticsService = {
  getDashboardMetrics: async (type = 'realtime') => {
    try {
      let conditions = [];
      
      if (type === 'realtime') {
        // Get data from last 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        conditions.push({ field: 'createdAt', operator: '>=', value: yesterday });
      }

      // Get hazard reports
      const reportsResult = await HazardReportService.getReports({ timeRange: '24h' });
      const reports = reportsResult.success ? reportsResult.reports : [];

      // Get alerts
      const alertsResult = await AlertService.getActiveAlerts();
      const alerts = alertsResult.success ? alertsResult.alerts : [];

      // Calculate metrics
      const metrics = {
        totalReports: reports.length,
        verifiedReports: reports.filter(r => r.status === 'verified').length,
        pendingReports: reports.filter(r => r.status === 'pending').length,
        investigatingReports: reports.filter(r => r.status === 'investigating').length,
        rejectedReports: reports.filter(r => r.status === 'rejected').length,
        activeAlerts: alerts.length,
        criticalReports: reports.filter(r => r.severity === 'critical').length,
        highSeverityReports: reports.filter(r => r.severity === 'high').length,
        mediumSeverityReports: reports.filter(r => r.severity === 'medium').length,
        lowSeverityReports: reports.filter(r => r.severity === 'low').length,
        lastUpdated: new Date()
      };

      return { success: true, metrics };
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      return { success: false, error: error.message };
    }
  }
};

