#!/bin/bash

# VARUNA Ocean Hazard Platform Setup Script
# This script sets up the entire platform for development

set -e

echo "🌊 Setting up VARUNA Ocean Hazard Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "npm $(npm -v) is installed"
}

# Check if Firebase CLI is installed
check_firebase() {
    if ! command -v firebase &> /dev/null; then
        print_warning "Firebase CLI is not installed. Installing..."
        npm install -g firebase-tools
    fi
    
    print_success "Firebase CLI is available"
}

# Install dependencies for all apps
install_dependencies() {
    print_status "Installing dependencies for all applications..."
    
    # User app
    print_status "Installing user app dependencies..."
    cd user
    npm install
    cd ..
    
    # Admin web app
    print_status "Installing admin web app dependencies..."
    cd admin/web
    npm install
    cd ../..
    
    # Analyst web app
    print_status "Installing analyst web app dependencies..."
    cd analyst/web
    npm install
    cd ../..
    
    # Admin mobile app
    print_status "Installing admin mobile app dependencies..."
    cd admin/mobile
    npm install
    cd ../..
    
    # Analyst mobile app
    print_status "Installing analyst mobile app dependencies..."
    cd analyst/mobile
    npm install
    cd ../..
    
    # Firebase functions
    print_status "Installing Firebase functions dependencies..."
    cd firebase-functions
    npm install
    cd ..
    
    print_success "All dependencies installed successfully"
}

# Create environment files
create_env_files() {
    print_status "Creating environment files..."
    
    # User app .env
    cat > user/.env << EOF
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
EOF

    # Admin web app .env
    cat > admin/web/.env << EOF
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
EOF

    # Analyst web app .env
    cat > analyst/web/.env << EOF
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
EOF

    print_success "Environment files created. Please update them with your Firebase configuration."
}

# Create Firebase configuration
create_firebase_config() {
    print_status "Creating Firebase configuration..."
    
    cat > firebase.json << EOF
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": {
    "source": "firebase-functions",
    "runtime": "nodejs18"
  },
  "hosting": {
    "public": "user/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "storage": {
    "rules": "storage.rules"
  }
}
EOF

    # Create Firestore rules
    cat > firestore.rules << EOF
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Hazard reports are readable by all authenticated users
    match /hazard_reports/{reportId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Alerts are readable by all
    match /alerts/{alertId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/\$(database)/documents/users/\$(request.auth.uid)).data.role in ['admin', 'analyst'];
    }
    
    // Social media posts are readable by analysts and admins
    match /social_media_posts/{postId} {
      allow read: if request.auth != null && 
        get(/databases/\$(database)/documents/users/\$(request.auth.uid)).data.role in ['admin', 'analyst'];
    }
    
    // Analytics are readable by analysts and admins
    match /analytics/{analyticsId} {
      allow read: if request.auth != null && 
        get(/databases/\$(database)/documents/users/\$(request.auth.uid)).data.role in ['admin', 'analyst'];
    }
    
    // Notifications are readable by the user they belong to
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
EOF

    # Create Firestore indexes
    cat > firestore.indexes.json << EOF
{
  "indexes": [
    {
      "collectionGroup": "hazard_reports",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "hazard_reports",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "hazardType",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "severity",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "social_media_posts",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "hazardRelevance.isRelevant",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
EOF

    # Create Storage rules
    cat > storage.rules << EOF
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload files to their own folder
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Hazard report media files
    match /hazard-reports/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Alert media files
    match /alerts/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/(default)/documents/users/$(request.auth.uid)).data.role in ['admin', 'analyst'];
    }
  }
}
EOF

    print_success "Firebase configuration files created"
}

# Create package.json for root
create_root_package() {
    print_status "Creating root package.json..."
    
    cat > package.json << EOF
{
  "name": "varuna-ocean-hazard-platform",
  "version": "1.0.0",
  "description": "Integrated platform for crowdsourced ocean hazard reporting and social media analytics",
  "scripts": {
    "install:all": "npm run install:user && npm run install:admin && npm run install:analyst && npm run install:mobile && npm run install:functions",
    "install:user": "cd user && npm install",
    "install:admin": "cd admin/web && npm install",
    "install:analyst": "cd analyst/web && npm install",
    "install:mobile": "cd admin/mobile && npm install && cd ../../analyst/mobile && npm install",
    "install:functions": "cd firebase-functions && npm install",
    "dev:user": "cd user && npm start",
    "dev:admin": "cd admin/web && npm run dev",
    "dev:analyst": "cd analyst/web && npm run dev",
    "dev:mobile:admin": "cd admin/mobile && npx expo start",
    "dev:mobile:analyst": "cd analyst/mobile && npx expo start",
    "build:user": "cd user && npm run build",
    "build:admin": "cd admin/web && npm run build",
    "build:analyst": "cd analyst/web && npm run build",
    "deploy:functions": "cd firebase-functions && firebase deploy --only functions",
    "deploy:all": "npm run build:user && npm run build:admin && npm run build:analyst && firebase deploy",
    "setup": "chmod +x scripts/setup.sh && ./scripts/setup.sh",
    "clean": "rm -rf user/node_modules admin/web/node_modules analyst/web/node_modules admin/mobile/node_modules analyst/mobile/node_modules firebase-functions/node_modules"
  },
  "keywords": [
    "ocean-hazards",
    "disaster-management",
    "crowdsourcing",
    "social-media-analytics",
    "firebase",
    "react",
    "react-native"
  ],
  "author": "VARUNA Development Team",
  "license": "MIT",
  "devDependencies": {
    "firebase-tools": "^12.0.0"
  }
}
EOF

    print_success "Root package.json created"
}

# Main setup function
main() {
    echo "🌊 VARUNA Ocean Hazard Platform Setup"
    echo "====================================="
    echo ""
    
    # Check prerequisites
    check_node
    check_npm
    check_firebase
    
    # Install dependencies
    install_dependencies
    
    # Create configuration files
    create_env_files
    create_firebase_config
    create_root_package
    
    echo ""
    print_success "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Update the .env files with your Firebase configuration"
    echo "2. Run 'firebase login' to authenticate with Firebase"
    echo "3. Run 'firebase init' to initialize your Firebase project"
    echo "4. Run 'npm run dev:user' to start the user app"
    echo "5. Run 'npm run dev:admin' to start the admin app"
    echo "6. Run 'npm run dev:analyst' to start the analyst app"
    echo ""
    echo "For mobile apps:"
    echo "1. Run 'npm run dev:mobile:admin' for admin mobile app"
    echo "2. Run 'npm run dev:mobile:analyst' for analyst mobile app"
    echo ""
    echo "For deployment:"
    echo "1. Run 'npm run deploy:functions' to deploy Cloud Functions"
    echo "2. Run 'npm run deploy:all' to deploy everything"
    echo ""
    print_warning "Don't forget to configure your Google Maps API key!"
}

# Run main function
main "$@"

