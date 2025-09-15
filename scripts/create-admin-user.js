// Create admin user script
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail } = require('firebase/auth');

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');

    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@varuna.com',
      'admin123456'
    );

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@varuna.com');
    console.log('Password: admin123456');
    console.log('User ID:', userCredential.user.uid);

    // Send password reset email (optional)
    console.log('Sending password reset email...');
    await sendPasswordResetEmail(auth, 'admin@varuna.com');
    console.log('✅ Password reset email sent!');

    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ Admin user already exists. Sending password reset email...');

      try {
        await sendPasswordResetEmail(auth, 'admin@varuna.com');
        console.log('✅ Password reset email sent to admin@varuna.com');
        console.log('📧 Check your email for password reset instructions');
      } catch (resetError) {
        console.error('❌ Error sending password reset:', resetError.message);
      }
    } else {
      console.error('❌ Error creating admin user:', error.message);
    }

    process.exit(1);
  }
}

createAdminUser();
