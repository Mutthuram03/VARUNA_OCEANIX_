// Firestore collection schemas and validation for the Ocean Hazard Platform

export const COLLECTIONS = {
  USERS: 'users',
  HAZARD_REPORTS: 'hazard_reports',
  ALERTS: 'alerts',
  SOCIAL_MEDIA_POSTS: 'social_media_posts',
  ANALYTICS: 'analytics',
  NOTIFICATIONS: 'notifications',
  LOCATIONS: 'locations',
  VERIFICATION_QUEUE: 'verification_queue',
  EMERGENCY_CONTACTS: 'emergency_contacts',
  SYSTEM_LOGS: 'system_logs'
};

export const USER_ROLES = {
  CITIZEN: 'citizen',
  ANALYST: 'analyst',
  ADMIN: 'admin',
  EMERGENCY_RESPONDER: 'emergency_responder',
  VERIFIER: 'verifier'
};

export const HAZARD_TYPES = {
  TSUNAMI: 'tsunami',
  STORM_SURGE: 'storm_surge',
  HIGH_WAVES: 'high_waves',
  FLOOD: 'flood',
  OIL_SPILL: 'oil_spill',
  DEAD_FISH: 'dead_fish',
  ABNORMAL_TIDE: 'abnormal_tide',
  COASTAL_EROSION: 'coastal_erosion',
  OTHER: 'other'
};

export const REPORT_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved'
};

export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// User schema
export const userSchema = {
  uid: 'string',
  email: 'string',
  displayName: 'string',
  role: 'string', // USER_ROLES
  phoneNumber: 'string?',
  profileImage: 'string?',
  location: {
    latitude: 'number',
    longitude: 'number',
    address: 'string?',
    city: 'string?',
    state: 'string?',
    country: 'string?'
  },
  preferences: {
    language: 'string', // 'en', 'hi', 'ta'
    notifications: 'boolean',
    alertRadius: 'number', // km
    hazardTypes: 'array' // HAZARD_TYPES[]
  },
  isActive: 'boolean',
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
  lastLoginAt: 'timestamp?'
};

// Hazard Report schema
export const hazardReportSchema = {
  id: 'string',
  reporterId: 'string', // user uid
  reporterName: 'string',
  reporterPhone: 'string?',
  hazardType: 'string', // HAZARD_TYPES
  title: 'string',
  description: 'string',
  location: {
    latitude: 'number',
    longitude: 'number',
    address: 'string?',
    accuracy: 'number?', // GPS accuracy in meters
    altitude: 'number?'
  },
  media: {
    images: 'array', // URLs
    videos: 'array', // URLs
    audio: 'array' // URLs
  },
  severity: 'string', // ALERT_SEVERITY
  status: 'string', // REPORT_STATUS
  verifiedBy: 'string?', // verifier uid
  verifiedAt: 'timestamp?',
  verificationNotes: 'string?',
  tags: 'array', // string[]
  isPublic: 'boolean',
  isEmergency: 'boolean',
  affectedArea: {
    radius: 'number?', // km
    population: 'number?'
  },
  weatherConditions: {
    temperature: 'number?',
    humidity: 'number?',
    windSpeed: 'number?',
    windDirection: 'number?',
    visibility: 'number?'
  },
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
  resolvedAt: 'timestamp?'
};

// Alert schema
export const alertSchema = {
  id: 'string',
  title: 'string',
  description: 'string',
  severity: 'string', // ALERT_SEVERITY
  hazardType: 'string', // HAZARD_TYPES
  location: {
    latitude: 'number',
    longitude: 'number',
    radius: 'number', // km
    affectedAreas: 'array' // {name, coordinates}[]
  },
  source: 'string', // 'official', 'crowdsourced', 'sensor', 'social_media'
  sourceId: 'string?', // reference to report or external source
  isActive: 'boolean',
  isVerified: 'boolean',
  verifiedBy: 'string?', // verifier uid
  verifiedAt: 'timestamp?',
  expiresAt: 'timestamp?',
  actions: 'array', // {action, description, url}[]
  targetAudience: 'array', // USER_ROLES[]
  languages: 'array', // ['en', 'hi', 'ta']
  media: {
    images: 'array', // URLs
    videos: 'array', // URLs
    documents: 'array' // URLs
  },
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
  publishedAt: 'timestamp?'
};

// Social Media Post schema
export const socialMediaPostSchema = {
  id: 'string',
  platform: 'string', // 'twitter', 'facebook', 'youtube', 'instagram'
  postId: 'string', // platform-specific ID
  author: {
    id: 'string',
    username: 'string',
    displayName: 'string',
    profileImage: 'string?',
    verified: 'boolean',
    followers: 'number?'
  },
  content: {
    text: 'string',
    language: 'string',
    hashtags: 'array', // string[]
    mentions: 'array', // string[]
    urls: 'array' // string[]
  },
  media: {
    images: 'array', // URLs
    videos: 'array', // URLs
  },
  location: {
    latitude: 'number?',
    longitude: 'number?',
    place: 'string?',
    country: 'string?'
  },
  engagement: {
    likes: 'number',
    shares: 'number',
    comments: 'number',
    views: 'number?'
  },
  sentiment: {
    score: 'number', // -1 to 1
    label: 'string', // 'positive', 'negative', 'neutral'
    confidence: 'number' // 0 to 1
  },
  hazardRelevance: {
    isRelevant: 'boolean',
    confidence: 'number', // 0 to 1
    hazardTypes: 'array', // HAZARD_TYPES[]
    keywords: 'array' // string[]
  },
  isProcessed: 'boolean',
  createdAt: 'timestamp',
  publishedAt: 'timestamp',
  processedAt: 'timestamp?'
};

// Analytics schema
export const analyticsSchema = {
  id: 'string',
  type: 'string', // 'daily', 'weekly', 'monthly', 'realtime'
  period: {
    start: 'timestamp',
    end: 'timestamp'
  },
  metrics: {
    totalReports: 'number',
    verifiedReports: 'number',
    activeAlerts: 'number',
    socialMediaMentions: 'number',
    userEngagement: 'number',
    responseTime: 'number', // average in minutes
    geographicCoverage: 'number' // km²
  },
  breakdown: {
    byHazardType: 'object', // HAZARD_TYPES -> count
    bySeverity: 'object', // ALERT_SEVERITY -> count
    byLocation: 'object', // state/city -> count
    bySource: 'object', // source -> count
    byTime: 'array' // hourly/daily data points
  },
  trends: {
    reportVolume: 'number', // % change
    verificationRate: 'number', // % change
    alertAccuracy: 'number', // % change
    socialSentiment: 'number' // % change
  },
  createdAt: 'timestamp'
};

// Notification schema
export const notificationSchema = {
  id: 'string',
  userId: 'string',
  type: 'string', // 'alert', 'report_update', 'verification', 'system'
  title: 'string',
  message: 'string',
  data: 'object?', // additional data
  isRead: 'boolean',
  isImportant: 'boolean',
  priority: 'string', // 'low', 'medium', 'high', 'urgent'
  channels: 'array', // ['push', 'email', 'sms', 'in_app']
  sentAt: 'timestamp?',
  readAt: 'timestamp?',
  createdAt: 'timestamp'
};

// Location schema for caching
export const locationSchema = {
  id: 'string',
  name: 'string',
  type: 'string', // 'city', 'state', 'coastline', 'port', 'beach'
  coordinates: {
    latitude: 'number',
    longitude: 'number'
  },
  bounds: {
    northeast: { latitude: 'number', longitude: 'number' },
    southwest: { latitude: 'number', longitude: 'number' }
  },
  metadata: {
    population: 'number?',
    riskLevel: 'string?', // 'low', 'medium', 'high'
    emergencyContacts: 'array?', // contact info
    facilities: 'array?' // hospitals, police, etc.
  },
  isActive: 'boolean',
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};

// Verification Queue schema
export const verificationQueueSchema = {
  id: 'string',
  reportId: 'string',
  priority: 'string', // 'low', 'medium', 'high', 'urgent'
  assignedTo: 'string?', // verifier uid
  status: 'string', // 'pending', 'in_progress', 'completed', 'rejected'
  notes: 'string?',
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
  completedAt: 'timestamp?'
};

// Emergency Contact schema
export const emergencyContactSchema = {
  id: 'string',
  name: 'string',
  type: 'string', // 'police', 'coast_guard', 'hospital', 'fire', 'disaster_management'
  phone: 'string',
  email: 'string?',
  location: {
    latitude: 'number',
    longitude: 'number',
    address: 'string'
  },
  jurisdiction: 'array', // areas they cover
  isActive: 'boolean',
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};

// System Log schema
export const systemLogSchema = {
  id: 'string',
  level: 'string', // 'info', 'warning', 'error', 'critical'
  category: 'string', // 'auth', 'report', 'alert', 'system', 'api'
  message: 'string',
  data: 'object?',
  userId: 'string?',
  ipAddress: 'string?',
  userAgent: 'string?',
  timestamp: 'timestamp'
};

