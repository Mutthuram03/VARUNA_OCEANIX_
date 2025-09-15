import { getDocuments, createDocument, updateDocument } from './firebase-services.js';
import { COLLECTIONS } from './firestore-schemas.js';

export const AnalyticsService = {
  // Get dashboard metrics
  getDashboardMetrics: async (type = 'realtime') => {
    try {
      let conditions = [];
      
      if (type === 'realtime') {
        // Get data from last 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        conditions.push({ field: 'createdAt', operator: '>=', value: yesterday });
      }

      // Get hazard reports
      const reportsResult = await getDocuments(COLLECTIONS.HAZARD_REPORTS, conditions);
      const reports = reportsResult.success ? reportsResult.data : [];

      // Get alerts
      const alertsResult = await getDocuments(COLLECTIONS.ALERTS, [
        { field: 'active', operator: '==', value: true }
      ]);
      const alerts = alertsResult.success ? alertsResult.data : [];

      // Get social media posts
      const socialMediaResult = await getDocuments(COLLECTIONS.SOCIAL_MEDIA_POSTS, conditions);
      const socialMediaPosts = socialMediaResult.success ? socialMediaResult.data : [];

      // Calculate metrics
      const metrics = {
        totalReports: reports.length,
        verifiedReports: reports.filter(r => r.status === 'verified').length,
        pendingReports: reports.filter(r => r.status === 'pending').length,
        investigatingReports: reports.filter(r => r.status === 'investigating').length,
        rejectedReports: reports.filter(r => r.status === 'rejected').length,
        activeAlerts: alerts.length,
        socialMediaMentions: socialMediaPosts.length,
        criticalReports: reports.filter(r => r.severity === 'critical').length,
        highSeverityReports: reports.filter(r => r.severity === 'high').length,
        mediumSeverityReports: reports.filter(r => r.severity === 'medium').length,
        lowSeverityReports: reports.filter(r => r.severity === 'low').length,
        lastUpdated: new Date()
      };

      return { success: true, metrics };
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      return { success: false, error: error.message };
    }
  },

  // Get hazard type distribution
  getHazardTypeDistribution: async (timeRange = '30d') => {
    try {
      const conditions = [];
      
      if (timeRange !== 'all') {
        const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        conditions.push({ field: 'createdAt', operator: '>=', value: startDate });
      }

      const result = await getDocuments(COLLECTIONS.HAZARD_REPORTS, conditions);
      
      if (result.success) {
        const distribution = result.data.reduce((acc, report) => {
          const type = report.hazardType || 'Unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        return {
          success: true,
          distribution: Object.entries(distribution).map(([type, count]) => ({
            type,
            count,
            percentage: (count / result.data.length) * 100
          }))
        };
      }

      return result;
    } catch (error) {
      console.error('Error getting hazard type distribution:', error);
      return { success: false, error: error.message };
    }
  },

  // Get severity distribution
  getSeverityDistribution: async (timeRange = '30d') => {
    try {
      const conditions = [];
      
      if (timeRange !== 'all') {
        const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        conditions.push({ field: 'createdAt', operator: '>=', value: startDate });
      }

      const result = await getDocuments(COLLECTIONS.HAZARD_REPORTS, conditions);
      
      if (result.success) {
        const distribution = result.data.reduce((acc, report) => {
          const severity = report.severity || 'unknown';
          acc[severity] = (acc[severity] || 0) + 1;
          return acc;
        }, {});

        return {
          success: true,
          distribution: Object.entries(distribution).map(([severity, count]) => ({
            severity,
            count,
            percentage: (count / result.data.length) * 100
          }))
        };
      }

      return result;
    } catch (error) {
      console.error('Error getting severity distribution:', error);
      return { success: false, error: error.message };
    }
  },

  // Get location-based analytics
  getLocationAnalytics: async (timeRange = '30d') => {
    try {
      const conditions = [];
      
      if (timeRange !== 'all') {
        const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        conditions.push({ field: 'createdAt', operator: '>=', value: startDate });
      }

      const result = await getDocuments(COLLECTIONS.HAZARD_REPORTS, conditions);
      
      if (result.success) {
        const locationData = result.data.map(report => ({
          id: report.id,
          location: report.location,
          hazardType: report.hazardType,
          severity: report.severity,
          status: report.status,
          createdAt: report.createdAt
        }));

        return {
          success: true,
          locationData
        };
      }

      return result;
    } catch (error) {
      console.error('Error getting location analytics:', error);
      return { success: false, error: error.message };
    }
  },

  // Get time-based trends
  getTimeBasedTrends: async (timeRange = '30d', granularity = 'day') => {
    try {
      const conditions = [];
      
      if (timeRange !== 'all') {
        const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        conditions.push({ field: 'createdAt', operator: '>=', value: startDate });
      }

      const result = await getDocuments(COLLECTIONS.HAZARD_REPORTS, conditions);
      
      if (result.success) {
        const trends = {};
        
        result.data.forEach(report => {
          const date = report.createdAt?.toDate ? report.createdAt.toDate() : new Date(report.createdAt);
          let key;
          
          if (granularity === 'hour') {
            key = date.toISOString().slice(0, 13) + ':00:00';
          } else if (granularity === 'day') {
            key = date.toISOString().slice(0, 10);
          } else if (granularity === 'week') {
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            key = weekStart.toISOString().slice(0, 10);
          } else {
            key = date.toISOString().slice(0, 7); // month
          }
          
          if (!trends[key]) {
            trends[key] = {
              date: key,
              total: 0,
              verified: 0,
              pending: 0,
              critical: 0,
              high: 0,
              medium: 0,
              low: 0
            };
          }
          
          trends[key].total++;
          if (report.status === 'verified') trends[key].verified++;
          if (report.status === 'pending') trends[key].pending++;
          if (report.severity === 'critical') trends[key].critical++;
          if (report.severity === 'high') trends[key].high++;
          if (report.severity === 'medium') trends[key].medium++;
          if (report.severity === 'low') trends[key].low++;
        });

        return {
          success: true,
          trends: Object.values(trends).sort((a, b) => new Date(a.date) - new Date(b.date))
        };
      }

      return result;
    } catch (error) {
      console.error('Error getting time-based trends:', error);
      return { success: false, error: error.message };
    }
  }
};

