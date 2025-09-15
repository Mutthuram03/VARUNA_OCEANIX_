// Firebase configuration for admin app
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCa_M3HlJpnyiWepNPHEdkQWdYHPm2b65U",
  authDomain: "vigyaan-d5969.firebaseapp.com",
  projectId: "vigyaan-d5969",
  storageBucket: "vigyaan-d5969.firebasestorage.app",
  messagingSenderId: "720466193807",
  appId: "1:720466193807:web:dc4d5d62ce249191cceffa",
  measurementId: "G-05PE08PBWT"
};

// Initialize Firebase only if no app exists
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;