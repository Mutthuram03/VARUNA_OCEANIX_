// Firebase Cloud Functions for Ocean Hazard Platform
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { createHash } = require('crypto');

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

// NLP Processing for Social Media Posts
exports.processSocialMediaPost = functions.https.onCall(async (data, context) => {
  try {
    const { platform, postId, content, author, location } = data;
    
    // Basic keyword detection for ocean hazards
    const hazardKeywords = {
      tsunami: ['tsunami', 'tidal wave', 'seismic wave', 'ocean wave'],
      storm_surge: ['storm surge', 'storm tide', 'coastal flooding', 'surge'],
      high_waves: ['high waves', 'rough seas', 'big waves', 'wave height'],
      flood: ['flood', 'flooding', 'inundation', 'water level'],
      oil_spill: ['oil spill', 'oil leak', 'petroleum', 'contamination'],
      dead_fish: ['dead fish', 'fish kill', 'marine life', 'fish mortality'],
      abnormal_tide: ['abnormal tide', 'unusual tide', 'tide level', 'water level'],
      coastal_erosion: ['erosion', 'coastal erosion', 'beach erosion', 'shoreline']
    };

    // Sentiment analysis (basic implementation)
    const positiveWords = ['safe', 'calm', 'normal', 'good', 'fine', 'okay', 'stable'];
    const negativeWords = ['dangerous', 'emergency', 'urgent', 'flooding', 'damage', 'destruction', 'panic'];
    
    const text = content.text.toLowerCase();
    let sentimentScore = 0;
    let sentimentLabel = 'neutral';
    
    positiveWords.forEach(word => {
      if (text.includes(word)) sentimentScore += 1;
    });
    
    negativeWords.forEach(word => {
      if (text.includes(word)) sentimentScore -= 1;
    });
    
    if (sentimentScore > 0) sentimentLabel = 'positive';
    else if (sentimentScore < 0) sentimentLabel = 'negative';

    // Hazard relevance detection
    const detectedHazards = [];
    const detectedKeywords = [];
    
    Object.entries(hazardKeywords).forEach(([hazardType, keywords]) => {
      keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          detectedHazards.push(hazardType);
          detectedKeywords.push(keyword);
        }
      });
    });

    const isRelevant = detectedHazards.length > 0;
    const confidence = isRelevant ? Math.min(0.9, 0.5 + (detectedKeywords.length * 0.1)) : 0.1;

    // Create processed post document
    const processedPost = {
      platform,
      postId,
      author: {
        id: author.id || 'unknown',
        username: author.username || 'unknown',
        displayName: author.displayName || author.username || 'Unknown User',
        profileImage: author.profileImage || null,
        verified: author.verified || false,
        followers: author.followers || 0
      },
      content: {
        text: content.text,
        language: detectLanguage(content.text),
        hashtags: content.hashtags || [],
        mentions: content.mentions || [],
        urls: content.urls || []
      },
      media: content.media || { images: [], videos: [] },
      location: location || null,
      engagement: {
        likes: 0,
        shares: 0,
        comments: 0,
        views: 0
      },
      sentiment: {
        score: sentimentScore,
        label: sentimentLabel,
        confidence: Math.abs(sentimentScore) / Math.max(positiveWords.length, negativeWords.length)
      },
      hazardRelevance: {
        isRelevant,
        confidence,
        hazardTypes: [...new Set(detectedHazards)],
        keywords: [...new Set(detectedKeywords)]
      },
      isProcessed: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      publishedAt: admin.firestore.FieldValue.serverTimestamp(),
      processedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save to Firestore
    await db.collection('social_media_posts').add(processedPost);

    // If relevant, create alert if severity is high
    if (isRelevant && confidence > 0.7) {
      await createHazardAlert(processedPost);
    }

    return { success: true, processedPost };
  } catch (error) {
    console.error('Error processing social media post:', error);
    return { success: false, error: error.message };
  }
});

// Generate Analytics
exports.generateAnalytics = functions.https.onCall(async (data, context) => {
  try {
    const { period = 'daily' } = data;
    
    const now = new Date();
    let startDate, endDate;
    
    switch (period) {
      case 'hourly':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        endDate = now;
        break;
      case 'daily':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      case 'monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        endDate = now;
    }

    // Get reports data
    const reportsSnapshot = await db.collection('hazard_reports')
      .where('createdAt', '>=', startDate)
      .where('createdAt', '<=', endDate)
      .get();

    const reports = reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get social media data
    const socialSnapshot = await db.collection('social_media_posts')
      .where('createdAt', '>=', startDate)
      .where('createdAt', '<=', endDate)
      .get();

    const socialPosts = socialSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Calculate metrics
    const metrics = {
      totalReports: reports.length,
      verifiedReports: reports.filter(r => r.status === 'verified').length,
      pendingReports: reports.filter(r => r.status === 'pending').length,
      activeAlerts: 0, // Will be calculated separately
      socialMediaMentions: socialPosts.length,
      userEngagement: calculateEngagement(socialPosts),
      responseTime: calculateResponseTime(reports)
    };

    // Breakdown by categories
    const breakdown = {
      byHazardType: reports.reduce((acc, report) => {
        acc[report.hazardType] = (acc[report.hazardType] || 0) + 1;
        return acc;
      }, {}),
      bySeverity: reports.reduce((acc, report) => {
        acc[report.severity] = (acc[report.severity] || 0) + 1;
        return acc;
      }, {}),
      byLocation: reports.reduce((acc, report) => {
        const state = report.location?.state || 'Unknown';
        acc[state] = (acc[state] || 0) + 1;
        return acc;
      }, {}),
      bySource: reports.reduce((acc, report) => {
        const source = report.source || 'mobile_app';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {}),
      byTime: generateTimeSeries(reports, startDate, endDate)
    };

    // Calculate trends (simplified)
    const trends = {
      reportVolume: calculateTrend(reports, 'count'),
      verificationRate: calculateTrend(reports, 'verification'),
      alertAccuracy: 0.85, // Placeholder
      socialSentiment: calculateSentimentTrend(socialPosts)
    };

    const analytics = {
      type: period,
      period: {
        start: startDate,
        end: endDate
      },
      metrics,
      breakdown,
      trends,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save analytics
    await db.collection('analytics').add(analytics);

    return { success: true, analytics };
  } catch (error) {
    console.error('Error generating analytics:', error);
    return { success: false, error: error.message };
  }
});

// Send Push Notification
exports.sendPushNotification = functions.https.onCall(async (data, context) => {
  try {
    const { userId, notification } = data;
    
    // Get user's FCM token
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return { success: false, error: 'User not found' };
    }

    const userData = userDoc.data();
    const fcmToken = userData.fcmToken;

    if (!fcmToken) {
      return { success: false, error: 'No FCM token found' };
    }

    // Send notification
    const message = {
      token: fcmToken,
      notification: {
        title: notification.title,
        body: notification.message
      },
      data: {
        type: notification.type,
        ...notification.data
      }
    };

    await admin.messaging().send(message);
    return { success: true };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: error.message };
  }
});

// Helper Functions
function detectLanguage(text) {
  // Simple language detection based on common words
  const hindiWords = ['है', 'हैं', 'का', 'की', 'के', 'में', 'से', 'को', 'पर'];
  const tamilWords = ['ஆகும்', 'இருக்கிறது', 'உள்ளது', 'வருகிறது', 'செய்கிறது'];
  
  const lowerText = text.toLowerCase();
  
  if (hindiWords.some(word => lowerText.includes(word))) return 'hi';
  if (tamilWords.some(word => lowerText.includes(word))) return 'ta';
  return 'en';
}

function calculateEngagement(posts) {
  if (posts.length === 0) return 0;
  
  const totalEngagement = posts.reduce((sum, post) => {
    return sum + (post.engagement?.likes || 0) + 
           (post.engagement?.shares || 0) + 
           (post.engagement?.comments || 0);
  }, 0);
  
  return totalEngagement / posts.length;
}

function calculateResponseTime(reports) {
  const verifiedReports = reports.filter(r => r.verifiedAt);
  if (verifiedReports.length === 0) return 0;
  
  const totalResponseTime = verifiedReports.reduce((sum, report) => {
    const createdAt = report.createdAt?.toDate?.() || new Date(report.createdAt);
    const verifiedAt = report.verifiedAt?.toDate?.() || new Date(report.verifiedAt);
    return sum + (verifiedAt - createdAt);
  }, 0);
  
  return totalResponseTime / verifiedReports.length / (1000 * 60); // Convert to minutes
}

function generateTimeSeries(reports, startDate, endDate) {
  const interval = endDate - startDate;
  const numPoints = Math.min(24, Math.floor(interval / (60 * 60 * 1000))); // Max 24 points
  const step = interval / numPoints;
  
  const series = [];
  for (let i = 0; i < numPoints; i++) {
    const time = new Date(startDate.getTime() + i * step);
    const count = reports.filter(report => {
      const reportTime = report.createdAt?.toDate?.() || new Date(report.createdAt);
      return reportTime >= time && reportTime < new Date(time.getTime() + step);
    }).length;
    
    series.push({
      time: time.toISOString(),
      count
    });
  }
  
  return series;
}

function calculateTrend(data, type) {
  if (data.length < 2) return 0;
  
  const mid = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, mid);
  const secondHalf = data.slice(mid);
  
  let firstValue, secondValue;
  
  switch (type) {
    case 'count':
      firstValue = firstHalf.length;
      secondValue = secondHalf.length;
      break;
    case 'verification':
      firstValue = firstHalf.filter(r => r.status === 'verified').length / firstHalf.length;
      secondValue = secondHalf.filter(r => r.status === 'verified').length / secondHalf.length;
      break;
    default:
      return 0;
  }
  
  return ((secondValue - firstValue) / firstValue) * 100;
}

function calculateSentimentTrend(posts) {
  if (posts.length < 2) return 0;
  
  const mid = Math.floor(posts.length / 2);
  const firstHalf = posts.slice(0, mid);
  const secondHalf = posts.slice(mid);
  
  const firstSentiment = firstHalf.reduce((sum, post) => sum + (post.sentiment?.score || 0), 0) / firstHalf.length;
  const secondSentiment = secondHalf.reduce((sum, post) => sum + (post.sentiment?.score || 0), 0) / secondHalf.length;
  
  return ((secondSentiment - firstSentiment) / Math.abs(firstSentiment)) * 100;
}

async function createHazardAlert(post) {
  try {
    const alert = {
      title: `Social Media Alert: ${post.hazardRelevance.hazardTypes[0].replace('_', ' ').toUpperCase()}`,
      description: `Potential ${post.hazardRelevance.hazardTypes[0].replace('_', ' ')} mentioned on ${post.platform}`,
      severity: post.sentiment.label === 'negative' ? 'high' : 'medium',
      hazardType: post.hazardRelevance.hazardTypes[0],
      location: post.location || {
        latitude: 0,
        longitude: 0,
        radius: 5
      },
      source: 'social_media',
      sourceId: post.id,
      isActive: true,
      isVerified: false,
      targetAudience: ['admin', 'analyst'],
      languages: ['en'],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      publishedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('alerts').add(alert);
  } catch (error) {
    console.error('Error creating hazard alert:', error);
  }
}

// Scheduled function to clean up old data
exports.cleanupOldData = functions.pubsub.schedule('0 2 * * *').onRun(async (context) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Clean up old social media posts
    const oldPostsSnapshot = await db.collection('social_media_posts')
      .where('createdAt', '<', thirtyDaysAgo)
      .limit(100)
      .get();

    const batch = db.batch();
    oldPostsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Cleaned up ${oldPostsSnapshot.docs.length} old social media posts`);
  } catch (error) {
    console.error('Error cleaning up old data:', error);
  }
});

// Trigger function when new report is created
exports.onReportCreated = functions.firestore
  .document('hazard_reports/{reportId}')
  .onCreate(async (snap, context) => {
    try {
      const report = snap.data();
      
      // Add to verification queue if high priority
      if (report.severity === 'critical' || report.isEmergency) {
        await db.collection('verification_queue').add({
          reportId: context.params.reportId,
          priority: 'urgent',
          status: 'pending',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      // Send notification to admins
      const adminsSnapshot = await db.collection('users')
        .where('role', '==', 'admin')
        .get();

      const notifications = adminsSnapshot.docs.map(doc => ({
        userId: doc.id,
        type: 'report',
        title: 'New Hazard Report',
        message: `${report.hazardType.replace('_', ' ').toUpperCase()} reported by ${report.reporterName}`,
        data: { reportId: context.params.reportId },
        isRead: false,
        priority: report.isEmergency ? 'urgent' : 'medium',
        channels: ['push', 'in_app'],
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }));

      const batch = db.batch();
      notifications.forEach(notification => {
        const ref = db.collection('notifications').doc();
        batch.set(ref, notification);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error processing new report:', error);
    }
  });

