import { getDocuments, createDocument, updateDocument, deleteDocument } from './firebase-services.js';
import { COLLECTIONS, SENTIMENT_TYPES } from './firestore-schemas.js';

export const SocialMediaService = {
  // Get social media posts with filters
  getSocialMediaPosts: async (filters = {}) => {
    try {
      const conditions = [];

      if (filters.platform && filters.platform !== 'all') {
        conditions.push({ field: 'platform', operator: '==', value: filters.platform });
      }

      if (filters.sentiment && filters.sentiment !== 'all') {
        conditions.push({ field: 'sentiment', operator: '==', value: filters.sentiment });
      }

      if (filters.hazardType && filters.hazardType !== 'all') {
        conditions.push({ field: 'hazardType', operator: '==', value: filters.hazardType });
      }

      if (filters.isRelevant !== undefined) {
        conditions.push({ field: 'isRelevant', operator: '==', value: filters.isRelevant });
      }

      if (filters.timeRange && filters.timeRange !== 'all') {
        const days = filters.timeRange === '24h' ? 1 : 
                    filters.timeRange === '7d' ? 7 : 
                    filters.timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        conditions.push({ field: 'timestamp', operator: '>=', value: startDate });
      }

      const result = await getDocuments(COLLECTIONS.SOCIAL_MEDIA_POSTS, conditions);
      
      if (result.success) {
        return {
          success: true,
          posts: result.data.map(post => ({
            id: post.id,
            platform: post.platform,
            content: post.content,
            author: post.author,
            timestamp: post.timestamp,
            sentiment: post.sentiment,
            keywords: post.keywords || [],
            hazardType: post.hazardType,
            isRelevant: post.isRelevant,
            engagement: post.engagement || 0,
            location: post.location,
            url: post.url
          }))
        };
      }

      return result;
    } catch (error) {
      console.error('Error getting social media posts:', error);
      return { success: false, error: error.message };
    }
  },

  // Get sentiment analysis data
  getSentimentAnalysis: async (filters = {}) => {
    try {
      const result = await getSocialMediaPosts(filters);
      
      if (result.success) {
        const sentimentCounts = result.posts.reduce((acc, post) => {
          const sentiment = post.sentiment || SENTIMENT_TYPES.NEUTRAL;
          acc[sentiment] = (acc[sentiment] || 0) + 1;
          return acc;
        }, {});

        const total = result.posts.length;
        const sentimentData = Object.entries(sentimentCounts).map(([sentiment, count]) => ({
          name: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
          value: count,
          percentage: total > 0 ? (count / total) * 100 : 0,
          color: sentiment === SENTIMENT_TYPES.PANIC ? '#EF4444' :
                 sentiment === SENTIMENT_TYPES.CALM ? '#22C55E' : '#6B7280'
        }));

        return {
          success: true,
          sentimentData,
          totalPosts: total
        };
      }

      return result;
    } catch (error) {
      console.error('Error getting sentiment analysis:', error);
      return { success: false, error: error.message };
    }
  },

  // Get trending keywords
  getTrendingKeywords: async (filters = {}, limit = 20) => {
    try {
      const result = await getSocialMediaPosts(filters);
      
      if (result.success) {
        const keywordCounts = {};
        
        result.posts.forEach(post => {
          if (post.keywords && Array.isArray(post.keywords)) {
            post.keywords.forEach(keyword => {
              keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
            });
          }
        });

        const trendingKeywords = Object.entries(keywordCounts)
          .map(([word, frequency]) => ({
            word,
            frequency,
            sentiment: result.posts.find(p => p.keywords?.includes(word))?.sentiment || SENTIMENT_TYPES.NEUTRAL,
            size: Math.min(20 + (frequency / 10), 60) // Scale font size
          }))
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, limit);

        return {
          success: true,
          keywords: trendingKeywords
        };
      }

      return result;
    } catch (error) {
      console.error('Error getting trending keywords:', error);
      return { success: false, error: error.message };
    }
  },

  // Get platform analysis
  getPlatformAnalysis: async (filters = {}) => {
    try {
      const result = await getSocialMediaPosts(filters);
      
      if (result.success) {
        const platformData = {};
        
        result.posts.forEach(post => {
          const platform = post.platform || 'Unknown';
          if (!platformData[platform]) {
            platformData[platform] = {
              platform,
              panic: 0,
              calm: 0,
              neutral: 0,
              total: 0
            };
          }
          
          platformData[platform].total++;
          const sentiment = post.sentiment || SENTIMENT_TYPES.NEUTRAL;
          if (sentiment === SENTIMENT_TYPES.PANIC) platformData[platform].panic++;
          else if (sentiment === SENTIMENT_TYPES.CALM) platformData[platform].calm++;
          else platformData[platform].neutral++;
        });

        const analysis = Object.values(platformData).map(data => ({
          platform: data.platform,
          panic: data.total > 0 ? (data.panic / data.total) * 100 : 0,
          calm: data.total > 0 ? (data.calm / data.total) * 100 : 0,
          neutral: data.total > 0 ? (data.neutral / data.total) * 100 : 0,
          total: data.total
        }));

        return {
          success: true,
          platformData: analysis
        };
      }

      return result;
    } catch (error) {
      console.error('Error getting platform analysis:', error);
      return { success: false, error: error.message };
    }
  },

  // Get timeline analysis
  getTimelineAnalysis: async (filters = {}, granularity = 'hour') => {
    try {
      const result = await getSocialMediaPosts(filters);
      
      if (result.success) {
        const timelineData = {};
        
        result.posts.forEach(post => {
          const timestamp = post.timestamp?.toDate ? post.timestamp.toDate() : new Date(post.timestamp);
          let key;
          
          if (granularity === 'hour') {
            key = timestamp.toISOString().slice(11, 13) + ':00';
          } else if (granularity === 'day') {
            key = timestamp.toISOString().slice(0, 10);
          } else {
            key = timestamp.toISOString().slice(0, 7); // month
          }
          
          if (!timelineData[key]) {
            timelineData[key] = {
              time: key,
              panic: 0,
              calm: 0,
              neutral: 0,
              total: 0
            };
          }
          
          timelineData[key].total++;
          const sentiment = post.sentiment || SENTIMENT_TYPES.NEUTRAL;
          if (sentiment === SENTIMENT_TYPES.PANIC) timelineData[key].panic++;
          else if (sentiment === SENTIMENT_TYPES.CALM) timelineData[key].calm++;
          else timelineData[key].neutral++;
        });

        const analysis = Object.values(timelineData)
          .sort((a, b) => new Date(a.time) - new Date(b.time));

        return {
          success: true,
          timelineData: analysis
        };
      }

      return result;
    } catch (error) {
      console.error('Error getting timeline analysis:', error);
      return { success: false, error: error.message };
    }
  },

  // Create a new social media post
  createSocialMediaPost: async (postData) => {
    try {
      const postToSave = {
        platform: postData.platform,
        content: postData.content,
        author: postData.author,
        timestamp: new Date(),
        sentiment: postData.sentiment || SENTIMENT_TYPES.NEUTRAL,
        keywords: postData.keywords || [],
        hazardType: postData.hazardType,
        isRelevant: postData.isRelevant || false,
        engagement: postData.engagement || 0,
        location: postData.location,
        url: postData.url,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return await createDocument(COLLECTIONS.SOCIAL_MEDIA_POSTS, postToSave);
    } catch (error) {
      console.error('Error creating social media post:', error);
      return { success: false, error: error.message };
    }
  },

  // Update social media post
  updateSocialMediaPost: async (postId, updates) => {
    try {
      return await updateDocument(COLLECTIONS.SOCIAL_MEDIA_POSTS, postId, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating social media post:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete social media post
  deleteSocialMediaPost: async (postId) => {
    try {
      return await deleteDocument(COLLECTIONS.SOCIAL_MEDIA_POSTS, postId);
    } catch (error) {
      console.error('Error deleting social media post:', error);
      return { success: false, error: error.message };
    }
  }
};

