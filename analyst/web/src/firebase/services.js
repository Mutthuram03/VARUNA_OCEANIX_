// Firebase services for analyst app
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
  }
};

// Social Media Service
export const SocialMediaService = {
  getSocialMediaPosts: async (filters = {}) => {
    try {
      let q = collection(db, COLLECTIONS.SOCIAL_MEDIA_POSTS);
      
      if (filters.platform && filters.platform !== 'all') {
        q = query(q, where('platform', '==', filters.platform));
      }
      
      if (filters.sentiment && filters.sentiment !== 'all') {
        q = query(q, where('sentiment', '==', filters.sentiment));
      }
      
      if (filters.timeRange && filters.timeRange !== 'all') {
        const days = filters.timeRange === '24h' ? 1 : 
                    filters.timeRange === '7d' ? 7 : 
                    filters.timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        q = query(q, where('timestamp', '>=', startDate));
      }
      
      q = query(q, orderBy('timestamp', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      return { success: true, posts };
    } catch (error) {
      console.error('Error getting social media posts:', error);
      return { success: false, error: error.message };
    }
  }
};

