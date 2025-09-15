// Firebase services for user app
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
  createReport: async (reportData) => {
    try {
      // Validate required fields
      if (!reportData.hazardType) {
        throw new Error('Hazard type is required');
      }
      
      if (!reportData.location || typeof reportData.location.latitude !== 'number' || typeof reportData.location.longitude !== 'number') {
        throw new Error('Valid location is required');
      }

      // Clean and validate data before sending to Firestore
      const cleanData = {
        hazardType: reportData.hazardType,
        description: reportData.description || '',
        location: {
          latitude: Number(reportData.location.latitude) || 0,
          longitude: Number(reportData.location.longitude) || 0,
          address: reportData.location.address || 'Unknown location'
        },
        mediaUrls: Array.isArray(reportData.mediaUrls) ? reportData.mediaUrls : [],
        severity: reportData.severity || 'medium',
        status: reportData.status || 'pending',
        reporterInfo: {
          name: reportData.reporterInfo?.name || 'Anonymous',
          contact: reportData.reporterInfo?.contact || '',
          isAnonymous: reportData.reporterInfo?.isAnonymous !== false
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.HAZARD_REPORTS), cleanData);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating report:', error);
      return { success: false, error: error.message };
    }
  },

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
      const reports = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          // Convert Firestore timestamps to JavaScript dates
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
        };
      });
      
      return { success: true, reports };
    } catch (error) {
      console.error('Error getting reports:', error);
      // Return empty array instead of failing completely
      return { success: true, reports: [] };
    }
  },

  updateReport: async (reportId, data) => {
    try {
      const docRef = doc(db, COLLECTIONS.HAZARD_REPORTS, reportId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating report:', error);
      return { success: false, error: error.message };
    }
  },

  deleteReport: async (reportId) => {
    try {
      const docRef = doc(db, COLLECTIONS.HAZARD_REPORTS, reportId);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting report:', error);
      return { success: false, error: error.message };
    }
  }
};

// Alert Service
export const AlertService = {
  getActiveAlerts: async (filters = {}) => {
    try {
      let q = collection(db, COLLECTIONS.ALERTS);
      q = query(q, where('active', '==', true));
      
      if (filters.severity) {
        q = query(q, where('severity', '==', filters.severity));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const alerts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          // Convert Firestore timestamps to JavaScript dates
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
        };
      });
      
      return { success: true, alerts };
    } catch (error) {
      console.error('Error getting alerts:', error);
      // Return empty array instead of failing completely
      return { success: true, alerts: [] };
    }
  },

  createAlert: async (alertData) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.ALERTS), {
        ...alertData,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating alert:', error);
      return { success: false, error: error.message };
    }
  }
};

// File Upload Service
export const FileUploadService = {
  uploadFile: async (file, path) => {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { success: true, downloadURL };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { success: false, error: error.message };
    }
  }
};

// Auth Service
export const AuthService = {
  signIn: async (email, password) => {
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('../firebase/config.js');

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      return {
        success: true,
        user: {
          uid: user.uid,
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          phone: user.phoneNumber,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          joinDate: user.metadata.creationTime
        }
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  },

  signUp: async (email, password, displayName) => {
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const { auth } = await import('../firebase/config.js');

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name if provided
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      return {
        success: true,
        user: {
          uid: user.uid,
          name: displayName || user.email.split('@')[0],
          email: user.email,
          phone: user.phoneNumber,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          joinDate: user.metadata.creationTime
        }
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  },

  signOut: async () => {
    try {
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('../firebase/config.js');

      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  },

  getCurrentUser: async () => {
    try {
      const { onAuthStateChanged } = await import('firebase/auth');
      const { auth } = await import('../firebase/config.js');

      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          if (user) {
            resolve({
              success: true,
              user: {
                uid: user.uid,
                name: user.displayName || user.email.split('@')[0],
                email: user.email,
                phone: user.phoneNumber,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                joinDate: user.metadata.creationTime
              }
            });
          } else {
            resolve({ success: false, error: 'No user signed in' });
          }
        });
      });
    } catch (error) {
      console.error('Get current user error:', error);
      return { success: false, error: error.message };
    }
  }
};

// Notification Service (placeholder)
export const NotificationService = {
  sendNotification: async (title, body, data) => {
    console.warn("NotificationService.sendNotification not implemented yet");
    return { success: false, error: "Not implemented" };
  }
};
