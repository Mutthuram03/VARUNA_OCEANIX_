// Demo data seeder for VARUNA Ocean Hazard Platform
// This script populates the database with sample data for testing

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // You'll need to download this from Firebase Console

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample data
const sampleUsers = [
  {
    uid: 'user1',
    email: 'citizen1@example.com',
    displayName: 'Rajesh Kumar',
    role: 'citizen',
    phoneNumber: '+91-9876543210',
    location: {
      latitude: 13.0827,
      longitude: 80.2707,
      address: 'Chennai, Tamil Nadu',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India'
    },
    preferences: {
      language: 'en',
      notifications: true,
      alertRadius: 10,
      hazardTypes: ['tsunami', 'flood', 'high_waves']
    },
    isActive: true,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  },
  {
    uid: 'user2',
    email: 'analyst1@example.com',
    displayName: 'Dr. Priya Sharma',
    role: 'analyst',
    phoneNumber: '+91-9876543211',
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'Mumbai, Maharashtra',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    },
    preferences: {
      language: 'en',
      notifications: true,
      alertRadius: 50,
      hazardTypes: ['tsunami', 'storm_surge', 'high_waves', 'flood']
    },
    isActive: true,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  },
  {
    uid: 'user3',
    email: 'admin1@example.com',
    displayName: 'Captain Ravi Singh',
    role: 'admin',
    phoneNumber: '+91-9876543212',
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'Bangalore, Karnataka',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India'
    },
    preferences: {
      language: 'en',
      notifications: true,
      alertRadius: 100,
      hazardTypes: ['tsunami', 'storm_surge', 'high_waves', 'flood', 'oil_spill']
    },
    isActive: true,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  }
];

const sampleHazardReports = [
  {
    reporterId: 'user1',
    reporterName: 'Rajesh Kumar',
    reporterPhone: '+91-9876543210',
    hazardType: 'high_waves',
    title: 'Unusually High Waves at Marina Beach',
    description: 'Waves are much higher than normal today. Water is reaching the walking path. Several people had to move to higher ground. The waves seem to be getting stronger.',
    location: {
      latitude: 13.0827,
      longitude: 80.2707,
      address: 'Marina Beach, Chennai',
      accuracy: 5
    },
    media: {
      images: ['https://example.com/wave1.jpg', 'https://example.com/wave2.jpg'],
      videos: [],
      audio: []
    },
    severity: 'high',
    status: 'pending',
    isPublic: true,
    isEmergency: false,
    tags: ['beach', 'waves', 'coastal'],
    weatherConditions: {
      temperature: 32,
      humidity: 75,
      windSpeed: 25,
      visibility: 8
    },
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  },
  {
    reporterId: 'user1',
    reporterName: 'Rajesh Kumar',
    reporterPhone: '+91-9876543210',
    hazardType: 'flood',
    title: 'Coastal Flooding in Fishing Village',
    description: 'Heavy rainfall has caused flooding in the fishing village. Water level is rising rapidly. Several houses are affected. Emergency evacuation may be needed.',
    location: {
      latitude: 13.1000,
      longitude: 80.3000,
      address: 'Fishing Village, Chennai',
      accuracy: 10
    },
    media: {
      images: ['https://example.com/flood1.jpg'],
      videos: ['https://example.com/flood1.mp4'],
      audio: []
    },
    severity: 'critical',
    status: 'verified',
    verifiedBy: 'user3',
    verifiedAt: admin.firestore.Timestamp.now(),
    verificationNotes: 'Verified by emergency response team. Evacuation in progress.',
    isPublic: true,
    isEmergency: true,
    tags: ['flood', 'emergency', 'evacuation'],
    weatherConditions: {
      temperature: 28,
      humidity: 90,
      windSpeed: 35,
      visibility: 3
    },
    createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)), // 2 hours ago
    updatedAt: admin.firestore.Timestamp.now()
  },
  {
    reporterId: 'user2',
    reporterName: 'Dr. Priya Sharma',
    reporterPhone: '+91-9876543211',
    hazardType: 'oil_spill',
    title: 'Oil Spill Detected Near Port',
    description: 'Oil slick observed in the water near the port area. The spill appears to be spreading. Marine life may be affected. Immediate action required.',
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'Mumbai Port, Maharashtra',
      accuracy: 15
    },
    media: {
      images: ['https://example.com/oil1.jpg', 'https://example.com/oil2.jpg'],
      videos: [],
      audio: []
    },
    severity: 'high',
    status: 'investigating',
    verifiedBy: 'user3',
    verifiedAt: admin.firestore.Timestamp.now(),
    verificationNotes: 'Under investigation by environmental team.',
    isPublic: true,
    isEmergency: false,
    tags: ['oil', 'spill', 'environment', 'port'],
    weatherConditions: {
      temperature: 30,
      humidity: 80,
      windSpeed: 20,
      visibility: 6
    },
    createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 4 * 60 * 60 * 1000)), // 4 hours ago
    updatedAt: admin.firestore.Timestamp.now()
  }
];

const sampleAlerts = [
  {
    title: 'High Wave Warning - Chennai Coast',
    description: 'High waves up to 4.5 meters expected along Chennai coast. Avoid fishing activities and stay away from the shoreline.',
    severity: 'high',
    hazardType: 'high_waves',
    location: {
      latitude: 13.0827,
      longitude: 80.2707,
      radius: 50,
      affectedAreas: [
        { name: 'Marina Beach', coordinates: { lat: 13.0827, lng: 80.2707 } },
        { name: 'Besant Nagar Beach', coordinates: { lat: 12.9989, lng: 80.2619 } }
      ]
    },
    source: 'official',
    isActive: true,
    isVerified: true,
    verifiedBy: 'user3',
    verifiedAt: admin.firestore.Timestamp.now(),
    targetAudience: ['citizen', 'analyst'],
    languages: ['en', 'hi', 'ta'],
    actions: [
      { action: 'Avoid coastal areas', description: 'Stay away from beaches and fishing areas' },
      { action: 'Monitor updates', description: 'Check for further updates every hour' }
    ],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    publishedAt: admin.firestore.Timestamp.now()
  },
  {
    title: 'Flood Alert - Coastal Areas',
    description: 'Heavy rainfall causing flooding in coastal areas. Water levels rising rapidly. Evacuation orders in effect for low-lying areas.',
    severity: 'critical',
    hazardType: 'flood',
    location: {
      latitude: 13.1000,
      longitude: 80.3000,
      radius: 25,
      affectedAreas: [
        { name: 'Fishing Village', coordinates: { lat: 13.1000, lng: 80.3000 } },
        { name: 'Coastal Settlement', coordinates: { lat: 13.1200, lng: 80.3200 } }
      ]
    },
    source: 'official',
    isActive: true,
    isVerified: true,
    verifiedBy: 'user3',
    verifiedAt: admin.firestore.Timestamp.now(),
    targetAudience: ['citizen', 'emergency_responder'],
    languages: ['en', 'hi', 'ta'],
    actions: [
      { action: 'Evacuate immediately', description: 'Move to higher ground or designated shelters' },
      { action: 'Call emergency services', description: 'Contact 108 for emergency assistance' }
    ],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    publishedAt: admin.firestore.Timestamp.now()
  }
];

const sampleSocialMediaPosts = [
  {
    platform: 'twitter',
    postId: 'tweet123',
    author: {
      id: 'twitter_user1',
      username: 'coastal_watcher',
      displayName: 'Coastal Watcher',
      profileImage: 'https://example.com/profile1.jpg',
      verified: false,
      followers: 1250
    },
    content: {
      text: 'Just saw massive waves at Marina Beach! Never seen them this high before. Stay safe everyone! #ChennaiWaves #OceanSafety',
      language: 'en',
      hashtags: ['ChennaiWaves', 'OceanSafety'],
      mentions: [],
      urls: []
    },
    media: {
      images: ['https://example.com/twitter_wave.jpg'],
      videos: []
    },
    location: {
      latitude: 13.0827,
      longitude: 80.2707,
      place: 'Marina Beach, Chennai',
      country: 'India'
    },
    engagement: {
      likes: 45,
      shares: 12,
      comments: 8,
      views: 1200
    },
    sentiment: {
      score: -0.3,
      label: 'negative',
      confidence: 0.8
    },
    hazardRelevance: {
      isRelevant: true,
      confidence: 0.9,
      hazardTypes: ['high_waves'],
      keywords: ['waves', 'beach', 'safety']
    },
    isProcessed: true,
    createdAt: admin.firestore.Timestamp.now(),
    publishedAt: admin.firestore.Timestamp.now(),
    processedAt: admin.firestore.Timestamp.now()
  },
  {
    platform: 'facebook',
    postId: 'fb_post456',
    author: {
      id: 'fb_user1',
      username: 'fisherman_raju',
      displayName: 'Raju Fisherman',
      profileImage: 'https://example.com/profile2.jpg',
      verified: false,
      followers: 500
    },
    content: {
      text: 'Oil spill near the port is spreading fast. Our fishing boats are covered in oil. This is a disaster for marine life! 😢',
      language: 'en',
      hashtags: ['OilSpill', 'MarineLife', 'Disaster'],
      mentions: [],
      urls: []
    },
    media: {
      images: ['https://example.com/fb_oil1.jpg', 'https://example.com/fb_oil2.jpg'],
      videos: []
    },
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      place: 'Mumbai Port',
      country: 'India'
    },
    engagement: {
      likes: 89,
      shares: 34,
      comments: 23,
      views: 2500
    },
    sentiment: {
      score: -0.8,
      label: 'negative',
      confidence: 0.9
    },
    hazardRelevance: {
      isRelevant: true,
      confidence: 0.95,
      hazardTypes: ['oil_spill'],
      keywords: ['oil spill', 'marine life', 'disaster']
    },
    isProcessed: true,
    createdAt: admin.firestore.Timestamp.now(),
    publishedAt: admin.firestore.Timestamp.now(),
    processedAt: admin.firestore.Timestamp.now()
  }
];

const sampleAnalytics = {
  type: 'realtime',
  period: {
    start: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000)),
    end: admin.firestore.Timestamp.now()
  },
  metrics: {
    totalReports: 15,
    verifiedReports: 8,
    pendingReports: 5,
    activeAlerts: 3,
    socialMediaMentions: 45,
    userEngagement: 2.3,
    responseTime: 25
  },
  breakdown: {
    byHazardType: {
      'high_waves': 5,
      'flood': 4,
      'oil_spill': 3,
      'tsunami': 2,
      'storm_surge': 1
    },
    bySeverity: {
      'low': 2,
      'medium': 6,
      'high': 5,
      'critical': 2
    },
    byLocation: {
      'Tamil Nadu': 8,
      'Maharashtra': 4,
      'Kerala': 2,
      'Karnataka': 1
    },
    bySource: {
      'mobile_app': 10,
      'web_app': 3,
      'social_media': 2
    },
    byTime: [
      { time: '00:00', count: 1 },
      { time: '04:00', count: 0 },
      { time: '08:00', count: 2 },
      { time: '12:00', count: 4 },
      { time: '16:00', count: 3 },
      { time: '20:00', count: 2 }
    ]
  },
  trends: {
    reportVolume: 15.5,
    verificationRate: 8.2,
    alertAccuracy: 85.0,
    socialSentiment: -12.3
  },
  createdAt: admin.firestore.Timestamp.now()
};

// Function to seed data
async function seedData() {
  try {
    console.log('🌊 Starting VARUNA demo data seeding...');

    // Seed users
    console.log('👥 Seeding users...');
    for (const user of sampleUsers) {
      await db.collection('users').doc(user.uid).set(user);
    }
    console.log(`✅ Seeded ${sampleUsers.length} users`);

    // Seed hazard reports
    console.log('📋 Seeding hazard reports...');
    for (const report of sampleHazardReports) {
      await db.collection('hazard_reports').add(report);
    }
    console.log(`✅ Seeded ${sampleHazardReports.length} hazard reports`);

    // Seed alerts
    console.log('🚨 Seeding alerts...');
    for (const alert of sampleAlerts) {
      await db.collection('alerts').add(alert);
    }
    console.log(`✅ Seeded ${sampleAlerts.length} alerts`);

    // Seed social media posts
    console.log('📱 Seeding social media posts...');
    for (const post of sampleSocialMediaPosts) {
      await db.collection('social_media_posts').add(post);
    }
    console.log(`✅ Seeded ${sampleSocialMediaPosts.length} social media posts`);

    // Seed analytics
    console.log('📊 Seeding analytics...');
    await db.collection('analytics').add(sampleAnalytics);
    console.log('✅ Seeded analytics data');

    // Create verification queue entries
    console.log('⏳ Creating verification queue...');
    const reportsSnapshot = await db.collection('hazard_reports').get();
    for (const doc of reportsSnapshot.docs) {
      const report = doc.data();
      if (report.severity === 'critical' || report.isEmergency) {
        await db.collection('verification_queue').add({
          reportId: doc.id,
          priority: 'urgent',
          status: 'pending',
          createdAt: admin.firestore.Timestamp.now(),
          updatedAt: admin.firestore.Timestamp.now()
        });
      }
    }
    console.log('✅ Created verification queue entries');

    console.log('🎉 Demo data seeding completed successfully!');
    console.log('');
    console.log('You can now:');
    console.log('1. Start the user app: npm run dev:user');
    console.log('2. Start the admin app: npm run dev:admin');
    console.log('3. Start the analyst app: npm run dev:analyst');
    console.log('4. Login with: citizen1@example.com, analyst1@example.com, or admin1@example.com');
    console.log('5. Password: demo123 (you may need to create these users in Firebase Auth)');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Run the seeder
seedData().then(() => {
  console.log('Seeding process completed');
  process.exit(0);
}).catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});

