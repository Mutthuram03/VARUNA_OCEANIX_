@echo off
REM VARUNA Ocean Hazard Platform Setup Script for Windows
REM This script sets up the entire platform for development

echo 🌊 Setting up VARUNA Ocean Hazard Platform...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo [SUCCESS] Node.js is installed

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    exit /b 1
)

echo [SUCCESS] npm is installed

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Firebase CLI is not installed. Installing...
    npm install -g firebase-tools
)

echo [SUCCESS] Firebase CLI is available

REM Install dependencies for all apps
echo [INFO] Installing dependencies for all applications...

REM User app
echo [INFO] Installing user app dependencies...
cd user
call npm install
cd ..

REM Admin web app
echo [INFO] Installing admin web app dependencies...
cd admin\web
call npm install
cd ..\..

REM Analyst web app
echo [INFO] Installing analyst web app dependencies...
cd analyst\web
call npm install
cd ..\..

REM Admin mobile app
echo [INFO] Installing admin mobile app dependencies...
cd admin\mobile
call npm install
cd ..\..

REM Analyst mobile app
echo [INFO] Installing analyst mobile app dependencies...
cd analyst\mobile
call npm install
cd ..\..

REM Firebase functions
echo [INFO] Installing Firebase functions dependencies...
cd firebase-functions
call npm install
cd ..

echo [SUCCESS] All dependencies installed successfully

REM Create environment files
echo [INFO] Creating environment files...

REM User app .env
(
echo VITE_FIREBASE_API_KEY=your_api_key_here
echo VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
echo VITE_FIREBASE_PROJECT_ID=your_project_id
echo VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
echo VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
echo VITE_FIREBASE_APP_ID=your_app_id
echo VITE_GOOGLE_MAPS_API_KEY=your_maps_key
) > user\.env

REM Admin web app .env
(
echo VITE_FIREBASE_API_KEY=your_api_key_here
echo VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
echo VITE_FIREBASE_PROJECT_ID=your_project_id
echo VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
echo VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
echo VITE_FIREBASE_APP_ID=your_app_id
echo VITE_GOOGLE_MAPS_API_KEY=your_maps_key
) > admin\web\.env

REM Analyst web app .env
(
echo VITE_FIREBASE_API_KEY=your_api_key_here
echo VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
echo VITE_FIREBASE_PROJECT_ID=your_project_id
echo VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
echo VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
echo VITE_FIREBASE_APP_ID=your_app_id
echo VITE_GOOGLE_MAPS_API_KEY=your_maps_key
) > analyst\web\.env

echo [SUCCESS] Environment files created. Please update them with your Firebase configuration.

REM Create Firebase configuration
echo [INFO] Creating Firebase configuration...

REM Create firebase.json
(
echo {
echo   "firestore": {
echo     "rules": "firestore.rules",
echo     "indexes": "firestore.indexes.json"
echo   },
echo   "functions": {
echo     "source": "firebase-functions",
echo     "runtime": "nodejs18"
echo   },
echo   "hosting": {
echo     "public": "user/dist",
echo     "ignore": [
echo       "firebase.json",
echo       "**/.*",
echo       "**/node_modules/**"
echo     ],
echo     "rewrites": [
echo       {
echo         "source": "**",
echo         "destination": "/index.html"
echo       }
echo     ]
echo   },
echo   "storage": {
echo     "rules": "storage.rules"
echo   }
echo }
) > firebase.json

REM Create Firestore rules
(
echo rules_version = '2';
echo service cloud.firestore {
echo   match /databases/{database}/documents {
echo     // Users can read/write their own data
echo     match /users/{userId} {
echo       allow read, write: if request.auth != null ^&^& request.auth.uid == userId;
echo     }
echo     
echo     // Hazard reports are readable by all authenticated users
echo     match /hazard_reports/{reportId} {
echo       allow read: if request.auth != null;
echo       allow write: if request.auth != null;
echo     }
echo     
echo     // Alerts are readable by all
echo     match /alerts/{alertId} {
echo       allow read: if true;
echo       allow write: if request.auth != null ^&^& 
echo         get(/databases/$$(database)/documents/users/$$(request.auth.uid)).data.role in ['admin', 'analyst'];
echo     }
echo     
echo     // Social media posts are readable by analysts and admins
echo     match /social_media_posts/{postId} {
echo       allow read: if request.auth != null ^&^& 
echo         get(/databases/$$(database)/documents/users/$$(request.auth.uid)).data.role in ['admin', 'analyst'];
echo     }
echo     
echo     // Analytics are readable by analysts and admins
echo     match /analytics/{analyticsId} {
echo       allow read: if request.auth != null ^&^& 
echo         get(/databases/$$(database)/documents/users/$$(request.auth.uid)).data.role in ['admin', 'analyst'];
echo     }
echo     
echo     // Notifications are readable by the user they belong to
echo     match /notifications/{notificationId} {
echo       allow read, write: if request.auth != null ^&^& 
echo         resource.data.userId == request.auth.uid;
echo     }
echo   }
echo }
) > firestore.rules

REM Create Firestore indexes
(
echo {
echo   "indexes": [
echo     {
echo       "collectionGroup": "hazard_reports",
echo       "queryScope": "COLLECTION",
echo       "fields": [
echo         {
echo           "fieldPath": "status",
echo           "order": "ASCENDING"
echo         },
echo         {
echo           "fieldPath": "createdAt",
echo           "order": "DESCENDING"
echo         }
echo       ]
echo     },
echo     {
echo       "collectionGroup": "hazard_reports",
echo       "queryScope": "COLLECTION",
echo       "fields": [
echo         {
echo           "fieldPath": "hazardType",
echo           "order": "ASCENDING"
echo         },
echo         {
echo           "fieldPath": "severity",
echo           "order": "ASCENDING"
echo         },
echo         {
echo           "fieldPath": "createdAt",
echo           "order": "DESCENDING"
echo         }
echo       ]
echo     },
echo     {
echo       "collectionGroup": "social_media_posts",
echo       "queryScope": "COLLECTION",
echo       "fields": [
echo         {
echo           "fieldPath": "hazardRelevance.isRelevant",
echo           "order": "ASCENDING"
echo         },
echo         {
echo           "fieldPath": "createdAt",
echo           "order": "DESCENDING"
echo         }
echo       ]
echo     }
echo   ],
echo   "fieldOverrides": []
echo }
) > firestore.indexes.json

REM Create Storage rules
(
echo rules_version = '2';
echo service firebase.storage {
echo   match /b/{bucket}/o {
echo     // Users can upload files to their own folder
echo     match /users/{userId}/{allPaths=**} {
echo       allow read, write: if request.auth != null ^&^& request.auth.uid == userId;
echo     }
echo     
echo     // Hazard report media files
echo     match /hazard-reports/{allPaths=**} {
echo       allow read: if true;
echo       allow write: if request.auth != null;
echo     }
echo     
echo     // Alert media files
echo     match /alerts/{allPaths=**} {
echo       allow read: if true;
echo       allow write: if request.auth != null ^&^& 
echo         get(/databases/(default)/documents/users/$$(request.auth.uid)).data.role in ['admin', 'analyst'];
echo     }
echo   }
echo }
) > storage.rules

echo [SUCCESS] Firebase configuration files created

REM Create package.json for root
echo [INFO] Creating root package.json...

(
echo {
echo   "name": "varuna-ocean-hazard-platform",
echo   "version": "1.0.0",
echo   "description": "Integrated platform for crowdsourced ocean hazard reporting and social media analytics",
echo   "scripts": {
echo     "install:all": "npm run install:user ^&^& npm run install:admin ^&^& npm run install:analyst ^&^& npm run install:mobile ^&^& npm run install:functions",
echo     "install:user": "cd user ^&^& npm install",
echo     "install:admin": "cd admin/web ^&^& npm install",
echo     "install:analyst": "cd analyst/web ^&^& npm install",
echo     "install:mobile": "cd admin/mobile ^&^& npm install ^&^& cd ../../analyst/mobile ^&^& npm install",
echo     "install:functions": "cd firebase-functions ^&^& npm install",
echo     "dev:user": "cd user ^&^& npm start",
echo     "dev:admin": "cd admin/web ^&^& npm run dev",
echo     "dev:analyst": "cd analyst/web ^&^& npm run dev",
echo     "dev:mobile:admin": "cd admin/mobile ^&^& npx expo start",
echo     "dev:mobile:analyst": "cd analyst/mobile ^&^& npx expo start",
echo     "build:user": "cd user ^&^& npm run build",
echo     "build:admin": "cd admin/web ^&^& npm run build",
echo     "build:analyst": "cd analyst/web ^&^& npm run build",
echo     "deploy:functions": "cd firebase-functions ^&^& firebase deploy --only functions",
echo     "deploy:all": "npm run build:user ^&^& npm run build:admin ^&^& npm run build:analyst ^&^& firebase deploy",
echo     "setup": "scripts\setup.bat",
echo     "clean": "rmdir /s /q user\node_modules admin\web\node_modules analyst\web\node_modules admin\mobile\node_modules analyst\mobile\node_modules firebase-functions\node_modules"
echo   },
echo   "keywords": [
echo     "ocean-hazards",
echo     "disaster-management",
echo     "crowdsourcing",
echo     "social-media-analytics",
echo     "firebase",
echo     "react",
echo     "react-native"
echo   ],
echo   "author": "VARUNA Development Team",
echo   "license": "MIT",
echo   "devDependencies": {
echo     "firebase-tools": "^12.0.0"
echo   }
echo }
) > package.json

echo [SUCCESS] Root package.json created

echo.
echo [SUCCESS] 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Update the .env files with your Firebase configuration
echo 2. Run 'firebase login' to authenticate with Firebase
echo 3. Run 'firebase init' to initialize your Firebase project
echo 4. Run 'npm run dev:user' to start the user app
echo 5. Run 'npm run dev:admin' to start the admin app
echo 6. Run 'npm run dev:analyst' to start the analyst app
echo.
echo For mobile apps:
echo 1. Run 'npm run dev:mobile:admin' for admin mobile app
echo 2. Run 'npm run dev:mobile:analyst' for analyst mobile app
echo.
echo For deployment:
echo 1. Run 'npm run deploy:functions' to deploy Cloud Functions
echo 2. Run 'npm run deploy:all' to deploy everything
echo.
echo [WARNING] Don't forget to configure your Google Maps API key!
echo.
pause

