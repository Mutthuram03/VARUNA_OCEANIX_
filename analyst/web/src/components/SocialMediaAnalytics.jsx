import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Hash, 
  Users, 
  TrendingUp, 
  BarChart3, 
  PieChart,
  Globe,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { SocialMediaService, AnalyticsService } from '../../../shared/firebase-services.js';
import { HAZARD_TYPES, ALERT_SEVERITY } from '../../../shared/firestore-schemas.js';

export default function SocialMediaAnalytics({ darkMode }) {
  const [selectedView, setSelectedView] = useState('sentiment');
  const [posts, setPosts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    platform: 'all',
    timeRange: '24h',
    hazardType: 'all',
    sentiment: 'all',
    isRelevant: true
  });

  const viewOptions = [
    { id: 'sentiment', label: 'Sentiment Analysis', icon: MessageSquare },
    { id: 'keywords', label: 'Trending Keywords', icon: Hash },
    { id: 'platforms', label: 'Platform Analysis', icon: Users },
    { id: 'timeline', label: 'Timeline Analysis', icon: TrendingUp },
    { id: 'hazards', label: 'Hazard Mentions', icon: AlertTriangle }
  ];

  useEffect(() => {
    loadSocialMediaData();
  }, [filters]);

  const loadSocialMediaData = async () => {
    try {
      setLoading(true);
      
      const result = await SocialMediaService.getSocialMediaPosts({
        platform: filters.platform !== 'all' ? filters.platform : undefined,
        isRelevant: filters.isRelevant
      });

      if (result.success) {
        setPosts(result.posts);
        await loadAnalytics();
      }
    } catch (error) {
      console.error('Error loading social media data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const result = await AnalyticsService.getDashboardMetrics('realtime');
      if (result.success && result.metrics) {
        setAnalytics(result.metrics);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: darkMode ? '#10b981' : '#059669',
      negative: darkMode ? '#ef4444' : '#dc2626',
      neutral: darkMode ? '#6b7280' : '#374151'
    };
    return colors[sentiment] || colors.neutral;
  };

  const getPlatformColor = (platform) => {
    const colors = {
      twitter: '#1da1f2',
      facebook: '#1877f2',
      youtube: '#ff0000',
      instagram: '#e4405f',
      tiktok: '#000000'
    };
    return colors[platform] || '#6b7280';
  };

  const renderSentimentAnalysis = () => {
    const sentimentData = posts.reduce((acc, post) => {
      const sentiment = post.sentiment?.label || 'neutral';
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {});

    const total = Object.values(sentimentData).reduce((sum, count) => sum + count, 0);

    return (
      <div className="space-y-6">
        {/* Sentiment Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(sentimentData).map(([sentiment, count]) => (
            <div key={sentiment} className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold capitalize">{sentiment}</h3>
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getSentimentColor(sentiment) }}
                ></div>
              </div>
              <div className="text-3xl font-bold mb-2">{count}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {((count / total) * 100).toFixed(1)}% of total mentions
              </div>
              <div className="mt-4">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${(count / total) * 100}%`,
                      backgroundColor: getSentimentColor(sentiment)
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sentiment Timeline */}
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h3 className="text-lg font-semibold mb-4">Sentiment Over Time</h3>
          <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>Timeline chart would be rendered here</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderKeywordAnalysis = () => {
    const keywordData = posts.reduce((acc, post) => {
      if (post.hazardRelevance?.keywords) {
        post.hazardRelevance.keywords.forEach(keyword => {
          acc[keyword] = (acc[keyword] || 0) + 1;
        });
      }
      return acc;
    }, {});

    const sortedKeywords = Object.entries(keywordData)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20);

    return (
      <div className="space-y-6">
        {/* Word Cloud */}
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h3 className="text-lg font-semibold mb-4">Trending Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {sortedKeywords.map(([keyword, count]) => (
              <span
                key={keyword}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'
                }`}
                style={{ 
                  fontSize: `${Math.min(16 + (count / Math.max(...Object.values(keywordData))) * 12, 24)}px`,
                  opacity: 0.7 + (count / Math.max(...Object.values(keywordData))) * 0.3
                }}
              >
                {keyword} ({count})
              </span>
            ))}
          </div>
        </div>

        {/* Keyword Table */}
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h3 className="text-lg font-semibold mb-4">Keyword Frequency</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2">Keyword</th>
                  <th className="text-left py-2">Mentions</th>
                  <th className="text-left py-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                {sortedKeywords.slice(0, 10).map(([keyword, count]) => (
                  <tr key={keyword} className="border-b border-slate-100 dark:border-slate-700">
                    <td className="py-2 font-medium">{keyword}</td>
                    <td className="py-2">{count}</td>
                    <td className="py-2">
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-500">+12%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderPlatformAnalysis = () => {
    const platformData = posts.reduce((acc, post) => {
      const platform = post.platform;
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {});

    const total = Object.values(platformData).reduce((sum, count) => sum + count, 0);

    return (
      <div className="space-y-6">
        {/* Platform Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(platformData).map(([platform, count]) => (
            <div key={platform} className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold capitalize">{platform}</h3>
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getPlatformColor(platform) }}
                ></div>
              </div>
              <div className="text-3xl font-bold mb-2">{count}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {((count / total) * 100).toFixed(1)}% of total posts
              </div>
            </div>
          ))}
        </div>

        {/* Platform Engagement */}
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h3 className="text-lg font-semibold mb-4">Platform Engagement</h3>
          <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <div className="text-center">
              <PieChart className="w-12 h-12 mx-auto mb-2" />
              <p>Engagement chart would be rendered here</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTimelineAnalysis = () => {
    return (
      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <h3 className="text-lg font-semibold mb-4">Social Media Activity Timeline</h3>
        <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
          <div className="text-center">
            <LineChart className="w-12 h-12 mx-auto mb-2" />
            <p>Timeline chart would be rendered here</p>
          </div>
        </div>
      </div>
    );
  };

  const renderHazardMentions = () => {
    const hazardData = posts.reduce((acc, post) => {
      if (post.hazardRelevance?.hazardTypes) {
        post.hazardRelevance.hazardTypes.forEach(hazardType => {
          acc[hazardType] = (acc[hazardType] || 0) + 1;
        });
      }
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        {/* Hazard Type Mentions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(hazardData).map(([hazardType, count]) => (
            <div key={hazardType} className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {hazardType.replace('_', ' ').toUpperCase()}
                </h3>
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-3xl font-bold mb-2">{count}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Social media mentions
              </div>
            </div>
          ))}
        </div>

        {/* Recent Hazard Posts */}
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h3 className="text-lg font-semibold mb-4">Recent Hazard-Related Posts</h3>
          <div className="space-y-4">
            {posts.filter(post => post.hazardRelevance?.isRelevant).slice(0, 5).map((post) => (
              <div key={post.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getPlatformColor(post.platform) }}
                    ></div>
                    <span className="font-medium">{post.author?.displayName || post.author?.username}</span>
                    <span className="text-sm text-slate-500">@{post.author?.username}</span>
                  </div>
                  <span className="text-sm text-slate-500">
                    {new Date(post.createdAt?.toDate?.() || post.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-2">{post.content?.text}</p>
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <span>❤️ {post.engagement?.likes || 0}</span>
                  <span>🔄 {post.engagement?.shares || 0}</span>
                  <span>💬 {post.engagement?.comments || 0}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    post.sentiment?.label === 'positive' ? 'bg-green-100 text-green-800' :
                    post.sentiment?.label === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {post.sentiment?.label || 'neutral'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (selectedView) {
      case 'sentiment':
        return renderSentimentAnalysis();
      case 'keywords':
        return renderKeywordAnalysis();
      case 'platforms':
        return renderPlatformAnalysis();
      case 'timeline':
        return renderTimelineAnalysis();
      case 'hazards':
        return renderHazardMentions();
      default:
        return renderSentimentAnalysis();
    }
  };

  return (
    <div className={`space-y-6 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Social Media Analytics
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={loadSocialMediaData}
            disabled={loading}
            className={`px-4 py-2 rounded-lg flex items-center ${
              darkMode 
                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center ${
              darkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Platform
            </label>
            <select
              value={filters.platform}
              onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
              className={`w-full p-2 border rounded-lg ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-slate-200' 
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="all">All Platforms</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Time Range
            </label>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
              className={`w-full p-2 border rounded-lg ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-slate-200' 
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Hazard Type
            </label>
            <select
              value={filters.hazardType}
              onChange={(e) => setFilters(prev => ({ ...prev, hazardType: e.target.value }))}
              className={`w-full p-2 border rounded-lg ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-slate-200' 
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="all">All Hazards</option>
              {Object.entries(HAZARD_TYPES).map(([key, value]) => (
                <option key={key} value={value}>
                  {value.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Relevance
            </label>
            <select
              value={filters.isRelevant}
              onChange={(e) => setFilters(prev => ({ ...prev, isRelevant: e.target.value === 'true' }))}
              className={`w-full p-2 border rounded-lg ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-slate-200' 
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="true">Relevant Only</option>
              <option value="false">All Posts</option>
            </select>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
        {viewOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedView(option.id)}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedView === option.id
                ? darkMode
                  ? 'bg-slate-700 text-slate-200'
                  : 'bg-white text-slate-900 shadow-sm'
                : darkMode
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <option.icon className="w-4 h-4 mr-2" />
            {option.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
}

