# Firebase Authentication Setup Guide

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "varuna-admin")
4. Follow the setup wizard

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Optionally enable other providers (Google, etc.)

## 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web (</>) icon
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 4. Update Environment Variables

Update your `.env` file with the actual Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-actual-app-id
```

## 5. Test the Integration

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:4000/admin/login`
3. Try creating a new account or signing in
4. Check the Firebase Console to see registered users

## 6. Security Rules (Optional)

For production, consider setting up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access only to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 7. Production Considerations

- Set up proper domain restrictions in Firebase Auth settings
- Configure OAuth redirect URIs for production domains
- Enable email verification if needed
- Set up proper error handling and logging
- Consider implementing role-based access control

## Features Included

✅ Email/Password authentication
✅ User registration
✅ User login
✅ Logout functionality
✅ Protected routes
✅ User session management
✅ Loading states
✅ Error handling
