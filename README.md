# VARUNA - Ocean Hazard Reporting Platform

A comprehensive platform for crowdsourced ocean hazard reporting and social media analytics, designed for INCOIS (Indian National Centre for Ocean Information Services) to enhance coastal disaster management and early warning systems.

## 🌊 Overview

VARUNA is an integrated software platform that enables citizens, coastal residents, volunteers, and disaster managers to report observations during hazardous ocean events and monitor public communication trends via social media. The platform provides real-time data visualization, automated analysis, and multi-role access for effective disaster response.

## 🚀 Features

### For Citizens (User App)
- **Hazard Reporting**: Submit geotagged reports with photos/videos
- **Real-time Alerts**: Receive location-based hazard notifications
- **Interactive Maps**: View live hazard data and alerts
- **Multi-language Support**: English, Hindi, Tamil
- **Offline Capability**: Submit reports when connectivity is restored
- **Emergency Mode**: Quick reporting for critical situations

### For Analysts (Analyst App)
- **Social Media Analytics**: Monitor hazard-related discussions
- **NLP Processing**: Automated sentiment and keyword analysis
- **Trend Analysis**: Identify patterns and emerging threats
- **Data Export**: Export analytics for research and reporting
- **Real-time Monitoring**: Live social media feed analysis

### for Administrators (Admin App)
- **Dashboard Management**: Comprehensive overview of all activities
- **Report Verification**: Review and validate citizen reports
- **Alert Management**: Create and manage emergency alerts
- **User Management**: Manage analysts and system users
- **System Monitoring**: Track platform performance and usage

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User App      │    │  Analyst App    │    │   Admin App     │
│  (React/Vite)   │    │ (React Router)  │    │ (React Router)  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │     Firebase Backend      │
                    │  ┌─────────────────────┐  │
                    │  │   Authentication    │  │
                    │  │   Firestore DB      │  │
                    │  │   Cloud Storage     │  │
                    │  │   Cloud Functions   │  │
                    │  │   Push Notifications│  │
                    │  └─────────────────────┘  │
                    └───────────────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - User interface framework
- **React Router** - Web application routing
- **React Native/Expo** - Mobile applications
- **Tailwind CSS** - Styling and responsive design
- **Framer Motion** - Animations and transitions
- **Recharts** - Data visualization
- **Google Maps API** - Interactive mapping

### Backend
- **Firebase Authentication** - User management
- **Cloud Firestore** - NoSQL database
- **Cloud Storage** - File and media storage
- **Cloud Functions** - Serverless backend processing
- **Firebase Analytics** - Usage tracking

### AI/ML
- **Natural Language Processing** - Social media analysis
- **Sentiment Analysis** - Public mood detection
- **Keyword Extraction** - Hazard identification
- **Geospatial Analysis** - Location-based insights

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase CLI
- Google Cloud account
- Google Maps API key

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/varuna-ocean-platform.git
cd varuna-ocean-platform
```

### 2. Firebase Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Deploy Cloud Functions
cd firebase-functions
npm install
firebase deploy --only functions
```

### 3. Environment Configuration
Create `.env` files in each app directory:

**user/.env**
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
```

**admin/web/.env**
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
```

**analyst/web/.env**
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
```

### 4. Install Dependencies
```bash
# User app
cd user
npm install

# Admin web app
cd ../admin/web
npm install

# Analyst web app
cd ../../analyst/web
npm install

# Mobile apps
cd ../../admin/mobile
npm install

cd ../../analyst/mobile
npm install
```

### 5. Run Development Servers
```bash
# User app
cd user
npm start

# Admin web app
cd admin/web
npm run dev

# Analyst web app
cd analyst/web
npm run dev

# Mobile apps (in separate terminals)
cd admin/mobile
npx expo start

cd analyst/mobile
npx expo start
```

## 🔧 Configuration

### Firebase Security Rules
Update your Firestore security rules:

```javascript
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
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'analyst'];
    }
    
    // Social media posts are readable by analysts and admins
    match /social_media_posts/{postId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'analyst'];
    }
  }
}
```

### Google Maps Setup
1. Enable the following APIs in Google Cloud Console:
   - Maps JavaScript API
   - Geocoding API
   - Places API
   - Geolocation API

2. Create API keys and restrict them by domain/IP

## 📱 Mobile App Setup

### Expo Configuration
```bash
# Install Expo CLI
npm install -g @expo/cli

# Login to Expo
expo login

# Build for development
expo build:android
expo build:ios
```

### EAS Build (for production)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for production
eas build --platform all
```

## 🚀 Deployment

### Web Applications
```bash
# User app
cd user
npm run build
# Deploy to your hosting service (Vercel, Netlify, etc.)

# Admin app
cd admin/web
npm run build
# Deploy to your hosting service

# Analyst app
cd analyst/web
npm run build
# Deploy to your hosting service
```

### Mobile Applications
```bash
# Build and submit to app stores
eas build --platform all
eas submit --platform all
```

## 📊 Data Flow

1. **Citizen Reports**: Users submit hazard reports with location and media
2. **Real-time Processing**: Reports are immediately stored in Firestore
3. **Verification Queue**: High-priority reports are queued for verification
4. **Social Media Monitoring**: Automated collection and analysis of social posts
5. **Alert Generation**: System generates alerts based on verified reports
6. **Dashboard Updates**: All stakeholders see real-time updates
7. **Analytics Processing**: Background analysis for insights and trends

## 🔐 Security Features

- **Role-based Access Control**: Different permissions for citizens, analysts, and admins
- **Data Encryption**: All data encrypted in transit and at rest
- **Geolocation Privacy**: Location data anonymized when possible
- **Media Validation**: Uploaded files scanned for security
- **Rate Limiting**: Prevents spam and abuse
- **Audit Logging**: All actions logged for compliance

## 🌐 Multi-language Support

The platform supports multiple Indian languages:
- **English** (Primary)
- **Hindi** (हिंदी)
- **Tamil** (தமிழ்)

Language detection and translation services can be integrated for additional languages.

## 📈 Analytics & Reporting

### Key Metrics Tracked
- Report volume and trends
- Verification rates and response times
- Social media sentiment analysis
- Geographic distribution of hazards
- User engagement and platform usage
- Alert accuracy and effectiveness

### Export Capabilities
- CSV/Excel data exports
- PDF reports generation
- API access for external systems
- Real-time data feeds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

## 🙏 Acknowledgments

- INCOIS (Indian National Centre for Ocean Information Services)
- Ministry of Earth Sciences, Government of India
- Open source community contributors
- Coastal communities and stakeholders

## 🔮 Future Enhancements

- **AI-powered Image Analysis**: Automatic hazard detection from photos
- **Satellite Data Integration**: Real-time satellite imagery analysis
- **IoT Sensor Integration**: Connect with coastal monitoring sensors
- **Blockchain Verification**: Immutable report verification
- **AR/VR Visualization**: Immersive hazard visualization
- **Advanced ML Models**: Improved prediction and classification
- **Multi-platform Apps**: Desktop and smart TV applications

---

**Built with ❤️ for coastal safety and disaster resilience**

