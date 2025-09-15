// Shared Firebase services and utilities for all applications
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  Timestamp,
  GeoPoint
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable,
  getMetadata
} from 'firebase/storage';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { db, storage, auth, functions } from './firebase-config.js';
import { COLLECTIONS, USER_ROLES, HAZARD_TYPES, REPORT_STATUS, ALERT_SEVERITY } from './firestore-schemas.js';

// Authentication Services
export class AuthService {
  static async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async signUp(email, password, displayName, role = USER_ROLES.CITIZEN) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document in Firestore
      await this.createUserProfile(userCredential.user.uid, {
        email,
        displayName,
        role,
        createdAt: serverTimestamp()
      });
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async createUserProfile(uid, userData) {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, userData);
  }

  static async getUserProfile(uid) {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  }

  static async updateUserProfile(uid, updates) {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, { ...updates, updatedAt: serverTimestamp() });
  }
}

// Hazard Report Services
export class HazardReportService {
  static async createReport(reportData) {
    try {
      const reportRef = await addDoc(collection(db, COLLECTIONS.HAZARD_REPORTS), {
        ...reportData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: REPORT_STATUS.PENDING
      });
      
      // Add to verification queue if high priority
      if (reportData.severity === ALERT_SEVERITY.CRITICAL || reportData.isEmergency) {
        await this.addToVerificationQueue(reportRef.id, 'urgent');
      }
      
      return { success: true, reportId: reportRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getReports(filters = {}, limitCount = 50) {
    try {
      let q = collection(db, COLLECTIONS.HAZARD_REPORTS);
      
      // Apply filters
      if (filters.hazardType) {
        q = query(q, where('hazardType', '==', filters.hazardType));
      }
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.severity) {
        q = query(q, where('severity', '==', filters.severity));
      }
      if (filters.location) {
        // Add geospatial query logic here
        q = query(q, where('location.latitude', '>=', filters.location.southwest.lat));
        q = query(q, where('location.latitude', '<=', filters.location.northeast.lat));
        q = query(q, where('location.longitude', '>=', filters.location.southwest.lng));
        q = query(q, where('location.longitude', '<=', filters.location.northeast.lng));
      }
      
      q = query(q, orderBy('createdAt', 'desc'), limit(limitCount));
      
      const querySnapshot = await getDocs(q);
      const reports = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { success: true, reports };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getReport(reportId) {
    try {
      const reportRef = doc(db, COLLECTIONS.HAZARD_REPORTS, reportId);
      const reportSnap = await getDoc(reportRef);
      
      if (reportSnap.exists()) {
        return { success: true, report: { id: reportSnap.id, ...reportSnap.data() } };
      } else {
        return { success: false, error: 'Report not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async updateReportStatus(reportId, status, verifierId, notes = '') {
    try {
      const reportRef = doc(db, COLLECTIONS.HAZARD_REPORTS, reportId);
      const updates = {
        status,
        updatedAt: serverTimestamp()
      };
      
      if (status === REPORT_STATUS.VERIFIED) {
        updates.verifiedBy = verifierId;
        updates.verifiedAt = serverTimestamp();
        updates.verificationNotes = notes;
      }
      
      await updateDoc(reportRef, updates);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async addToVerificationQueue(reportId, priority = 'medium') {
    try {
      await addDoc(collection(db, COLLECTIONS.VERIFICATION_QUEUE), {
        reportId,
        priority,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async subscribeToReports(callback, filters = {}) {
    let q = collection(db, COLLECTIONS.HAZARD_REPORTS);
    
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    q = query(q, orderBy('createdAt', 'desc'), limit(100));
    
    return onSnapshot(q, (snapshot) => {
      const reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(reports);
    });
  }
}

// Alert Services
export class AlertService {
  static async createAlert(alertData) {
    try {
      const alertRef = await addDoc(collection(db, COLLECTIONS.ALERTS), {
        ...alertData,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishedAt: serverTimestamp()
      });
      
      return { success: true, alertId: alertRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getActiveAlerts() {
    try {
      const q = query(
        collection(db, COLLECTIONS.ALERTS),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const alerts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { success: true, alerts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async updateAlert(alertId, updates) {
    try {
      const alertRef = doc(db, COLLECTIONS.ALERTS, alertId);
      await updateDoc(alertRef, { ...updates, updatedAt: serverTimestamp() });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async subscribeToAlerts(callback) {
    const q = query(
      collection(db, COLLECTIONS.ALERTS),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const alerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(alerts);
    });
  }
}

// Social Media Services
export class SocialMediaService {
  static async processSocialMediaPost(postData) {
    try {
      // Call Cloud Function for NLP processing
      const processPost = httpsCallable(functions, 'processSocialMediaPost');
      const result = await processPost(postData);
      
      return { success: true, processedPost: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getSocialMediaPosts(filters = {}) {
    try {
      let q = collection(db, COLLECTIONS.SOCIAL_MEDIA_POSTS);
      
      if (filters.platform) {
        q = query(q, where('platform', '==', filters.platform));
      }
      if (filters.isRelevant) {
        q = query(q, where('hazardRelevance.isRelevant', '==', true));
      }
      
      q = query(q, orderBy('createdAt', 'desc'), limit(100));
      
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { success: true, posts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async subscribeToSocialMediaPosts(callback, filters = {}) {
    let q = collection(db, COLLECTIONS.SOCIAL_MEDIA_POSTS);
    
    if (filters.isRelevant) {
      q = query(q, where('hazardRelevance.isRelevant', '==', true));
    }
    
    q = query(q, orderBy('createdAt', 'desc'), limit(50));
    
    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(posts);
    });
  }
}

// File Upload Services
export class FileUploadService {
  static async uploadFile(file, path, metadata = {}) {
    try {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      
      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            // Progress tracking
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            reject({ success: false, error: error.message });
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({ success: true, downloadURL });
            } catch (error) {
              reject({ success: false, error: error.message });
            }
          }
        );
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async uploadMultipleFiles(files, basePath) {
    try {
      const uploadPromises = files.map((file, index) => {
        const filePath = `${basePath}/${Date.now()}_${index}_${file.name}`;
        return this.uploadFile(file, filePath);
      });
      
      const results = await Promise.all(uploadPromises);
      const successful = results.filter(result => result.success);
      const failed = results.filter(result => !result.success);
      
      return {
        success: failed.length === 0,
        uploads: successful,
        errors: failed
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async deleteFile(downloadURL) {
    try {
      const fileRef = ref(storage, downloadURL);
      await deleteObject(fileRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Analytics Services
export class AnalyticsService {
  static async getDashboardMetrics(period = 'daily') {
    try {
      const q = query(
        collection(db, COLLECTIONS.ANALYTICS),
        where('type', '==', period),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return { success: true, metrics: null };
      }
      
      const metrics = querySnapshot.docs[0].data();
      return { success: true, metrics };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async generateAnalytics(period = 'daily') {
    try {
      const generateAnalytics = httpsCallable(functions, 'generateAnalytics');
      const result = await generateAnalytics({ period });
      return { success: true, analytics: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Notification Services
export class NotificationService {
  static async sendNotification(userId, notification) {
    try {
      await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
        userId,
        ...notification,
        isRead: false,
        createdAt: serverTimestamp()
      });
      
      // Trigger push notification
      const sendPushNotification = httpsCallable(functions, 'sendPushNotification');
      await sendPushNotification({ userId, notification });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getUserNotifications(userId, limitCount = 50) {
    try {
      const q = query(
        collection(db, COLLECTIONS.NOTIFICATIONS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { success: true, notifications };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async markAsRead(notificationId) {
    try {
      const notificationRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        readAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Utility functions
export const utils = {
  // Convert Firestore timestamp to JavaScript Date
  timestampToDate: (timestamp) => {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  },

  // Convert JavaScript Date to Firestore timestamp
  dateToTimestamp: (date) => {
    return Timestamp.fromDate(new Date(date));
  },

  // Create GeoPoint from lat/lng
  createGeoPoint: (latitude, longitude) => {
    return new GeoPoint(latitude, longitude);
  },

  // Calculate distance between two points (Haversine formula)
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  // Format date for display
  formatDate: (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
  },

  // Generate unique ID
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};

// Re-export all services
export { AlertService } from './alert-services.js';
export { AnalyticsService } from './analytics-services.js';
export { SocialMediaService } from './social-media-services.js';
