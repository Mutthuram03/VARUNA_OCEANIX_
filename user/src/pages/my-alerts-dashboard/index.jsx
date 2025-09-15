import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { AlertService, HazardReportService } from '../../services/firebase.js';
import Icon from '../../components/AppIcon';

const MyAlertsDashboard = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [alerts, setAlerts] = useState([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');

  // User location (mock for now)
  const userLocation = {
    lat: 13.0827,
    lng: 80.2707,
    address: "Marina Beach, Chennai"
  };

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('varuna-language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  // Load real-time data from Firebase
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Load active alerts
        const alertsResult = await AlertService.getActiveAlerts();
        if (alertsResult.success) {
          setAlerts(alertsResult.alerts);
        }

        // Load emergency alerts (high severity)
        const emergencyResult = await AlertService.getActiveAlerts();
        if (emergencyResult.success) {
          const emergency = emergencyResult.alerts.filter(alert => 
            alert.severity === 'critical' || alert.severity === 'high'
          );
          setEmergencyAlerts(emergency);
        }
      } catch (error) {
        console.error('Error loading alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate distance between user and alert location
  const calculateDistance = (alertLat, alertLng) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (alertLat - userLocation.lat) * Math.PI / 180;
    const dLng = (alertLng - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(alertLat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter and sort alerts
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'nearby') return calculateDistance(alert.location.latitude, alert.location.longitude) <= 50;
    if (filter === 'high') return alert.severity === 'high' || alert.severity === 'critical';
    if (filter === 'verified') return alert.isVerified;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'timestamp') {
      return new Date(b.createdAt?.toDate?.() || b.createdAt) - new Date(a.createdAt?.toDate?.() || a.createdAt);
    }
    if (sortBy === 'distance') {
      return calculateDistance(a.location.latitude, a.location.longitude) - calculateDistance(b.location.latitude, b.location.longitude);
    }
    if (sortBy === 'severity') {
      const severityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    }
    return 0;
  });

  const getSeverityColor = (severity) => {
    const colors = {
      'critical': 'text-red-600 bg-red-100',
      'high': 'text-orange-600 bg-orange-100',
      'medium': 'text-yellow-600 bg-yellow-100',
      'low': 'text-blue-600 bg-blue-100'
    };
    return colors[severity] || 'text-gray-600 bg-gray-100';
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'text-green-600 bg-green-100',
      'investigating': 'text-blue-600 bg-blue-100',
      'resolved': 'text-gray-600 bg-gray-100',
      'expired': 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const pageContent = {
    en: {
      title: "My Alerts Dashboard - VARUNA Ocean Safety",
      description: "Monitor your personalized ocean hazard alerts and stay informed about coastal safety in your area.",
      heading: "My Alerts Dashboard",
      subtitle: "Stay informed about ocean hazards in your area",
      filters: {
        all: "All Alerts",
        nearby: "Nearby (50km)",
        high: "High Priority",
        verified: "Verified Only"
      },
      sortBy: {
        timestamp: "Latest First",
        distance: "Nearest First",
        severity: "Most Severe"
      },
      noAlerts: "No alerts found",
      loading: "Loading alerts...",
      emergency: "Emergency Alert",
      verified: "Verified",
      investigating: "Investigating",
      active: "Active",
      expired: "Expired"
    },
    hi: {
      title: "मेरा अलर्ट डैशबोर्ड - VARUNA महासागर सुरक्षा",
      description: "अपने व्यक्तिगत महासागर खतरे के अलर्ट की निगरानी करें और अपने क्षेत्र में तटीय सुरक्षा के बारे में सूचित रहें।",
      heading: "मेरा अलर्ट डैशबोर्ड",
      subtitle: "अपने क्षेत्र में महासागर खतरों के बारे में सूचित रहें",
      filters: {
        all: "सभी अलर्ट",
        nearby: "पास के (50km)",
        high: "उच्च प्राथमिकता",
        verified: "केवल सत्यापित"
      },
      sortBy: {
        timestamp: "नवीनतम पहले",
        distance: "निकटतम पहले",
        severity: "सबसे गंभीर"
      },
      noAlerts: "कोई अलर्ट नहीं मिला",
      loading: "अलर्ट लोड हो रहे हैं...",
      emergency: "आपातकालीन अलर्ट",
      verified: "सत्यापित",
      investigating: "जांच चल रही है",
      active: "सक्रिय",
      expired: "समाप्त"
    },
    ta: {
      title: "எனது எச்சரிக்கை டாஷ்போர்டு - VARUNA கடல் பாதுகாப்பு",
      description: "உங்கள் தனிப்பட்ட கடல் ஆபத்து எச்சரிக்கைகளை கண்காணித்து உங்கள் பகுதியில் கடலோர பாதுகாப்பு பற்றி தகவலறிந்திருங்கள்.",
      heading: "எனது எச்சரிக்கை டாஷ்போர்டு",
      subtitle: "உங்கள் பகுதியில் கடல் ஆபத்துகள் பற்றி தகவலறிந்திருங்கள்",
      filters: {
        all: "அனைத்து எச்சரிக்கைகள்",
        nearby: "அருகிலுள்ள (50km)",
        high: "உயர் முன்னுரிமை",
        verified: "சரிபார்க்கப்பட்டவை மட்டும்"
      },
      sortBy: {
        timestamp: "சமீபத்தியவை முதலில்",
        distance: "அருகிலுள்ளவை முதலில்",
        severity: "மிகவும் கடுமையானவை"
      },
      noAlerts: "எச்சரிக்கைகள் எதுவும் கிடைக்கவில்லை",
      loading: "எச்சரிக்கைகள் ஏற்றப்படுகின்றன...",
      emergency: "அவசர எச்சரிக்கை",
      verified: "சரிபார்க்கப்பட்டது",
      investigating: "விசாரணை நடந்து கொண்டிருக்கிறது",
      active: "செயலில்",
      expired: "காலாவதியானது"
    }
  };

  const content = pageContent[currentLanguage] || pageContent.en;

  return (
    <>
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <meta name="keywords" content="ocean alerts, coastal safety, hazard monitoring, emergency alerts, VARUNA" />
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://varuna-ocean.com/my-alerts-dashboard" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.title} />
        <meta name="twitter:description" content={content.description} />
        <link rel="canonical" href="https://varuna-ocean.com/my-alerts-dashboard" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header 
          isAuthenticated={false}
          user={null}
          onAuthAction={() => {}}
        />

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb />
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.heading}</h1>
            <p className="text-gray-600">{content.subtitle}</p>
          </div>

          {/* Emergency Alerts */}
          {emergencyAlerts.length > 0 && (
            <div className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Icon name="AlertTriangle" className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold text-red-800">{content.emergency}</h3>
                </div>
                <p className="text-red-700 mt-2">
                  {emergencyAlerts[0].description}
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {emergencyAlerts[0].location?.address || 'Unknown location'} • {formatTimeAgo(emergencyAlerts[0].createdAt)}
                </p>
              </div>
            </div>
          )}

          {/* Filters and Sort */}
          <div className="mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              {Object.entries(content.filters).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {Object.entries(content.sortBy).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Alerts List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Icon name="Loader2" className="w-8 h-8 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-600">{content.loading}</span>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Bell" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{content.noAlerts}</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{alert.title}</h3>
                      <p className="text-gray-600 mb-3">{alert.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(alert.isActive ? 'active' : 'expired')}`}>
                          {alert.isActive ? content.active : content.expired}
                        </span>
                        {alert.isVerified && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {content.verified}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Icon name="MapPin" className="w-4 h-4 mr-1" />
                        {alert.location?.address || 'Unknown location'}
                      </span>
                      <span className="flex items-center">
                        <Icon name="Clock" className="w-4 h-4 mr-1" />
                        {formatTimeAgo(alert.createdAt)}
                      </span>
                      {alert.location?.latitude && alert.location?.longitude && (
                        <span className="flex items-center">
                          <Icon name="Navigation" className="w-4 h-4 mr-1" />
                          {calculateDistance(alert.location.latitude, alert.location.longitude).toFixed(1)}km away
                        </span>
                      )}
                    </div>
                  </div>

                  {alert.actions && alert.actions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Recommended Actions:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {alert.actions.map((action, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            {action.action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default MyAlertsDashboard;