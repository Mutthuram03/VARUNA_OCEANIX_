import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MapContainer from './components/MapContainer';
import FilterPanel from './components/FilterPanel';
import QuickActions from './components/QuickActions';
import ReportPopup from './components/ReportPopup';
import MapLegend from './components/MapLegend';
import { HazardReportService, AlertService } from '../../services/firebase.js';
import Icon from '../../components/AppIcon';

const InteractiveRiskMap = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 13.0827, lng: 80.2707 }); // Chennai
  const [zoomLevel, setZoomLevel] = useState(10);
  const [filters, setFilters] = useState({
    hazardTypes: ['HIGH WAVE', 'FLOOD', 'OIL SPILL', 'DEAD FISH', 'COASTAL EROSION', 'UNUSUAL TIDE', 'MARINE POLLUTION', 'OTHER'],
    severities: ['low', 'medium', 'high', 'critical'],
    timeRange: '24h'
  });

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
        // Load hazard reports with filters
        const reportsResult = await HazardReportService.getReports({
          timeRange: filters.timeRange
        });

        if (reportsResult.success) {
          setReports(reportsResult.reports);
        }

        // Load alerts
        const alertsResult = await AlertService.getActiveAlerts();
        if (alertsResult.success) {
          setAlerts(alertsResult.alerts);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters.timeRange]);

  // Filter reports based on current filters
  const getFilteredReports = () => {
    return reports.filter(report => {
      // Filter by hazard type
      if (filters.hazardTypes.length > 0 && !filters.hazardTypes.includes(report.hazardType)) {
        return false;
      }

      // Filter by severity
      if (filters.severities.length > 0 && !filters.severities.includes(report.severity)) {
        return false;
      }

      return true;
    });
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle report selection
  const handleReportSelect = (report) => {
    setSelectedReport(report);
    if (report && report.location) {
      setMapCenter({
        lat: report.location.latitude,
        lng: report.location.longitude
      });
    }
  };

  // Handle map refresh
  const handleRefresh = () => {
    setLoading(true);
    // Reload data
    window.location.reload();
  };

  const pageContent = {
    en: {
      title: "Interactive Risk Map - VARUNA Ocean Safety",
      description: "Explore real-time ocean hazard data and alerts on our interactive map. Stay informed about coastal safety in your area.",
      heading: "Interactive Risk Map",
      subtitle: "Real-time ocean hazard monitoring and visualization",
      loading: "Loading map data...",
      noData: "No hazard data available",
      stats: {
        totalReports: "Total Reports",
        activeAlerts: "Active Alerts",
        verifiedReports: "Verified Reports",
        lastUpdated: "Last Updated"
      }
    },
    hi: {
      title: "इंटरैक्टिव रिस्क मैप - VARUNA महासागर सुरक्षा",
      description: "हमारे इंटरैक्टिव मैप पर रियल-टाइम महासागर खतरे के डेटा और अलर्ट का अन्वेषण करें। अपने क्षेत्र में तटीय सुरक्षा के बारे में सूचित रहें।",
      heading: "इंटरैक्टिव रिस्क मैप",
      subtitle: "रियल-टाइम महासागर खतरे की निगरानी और विज़ुअलाइज़ेशन",
      loading: "मैप डेटा लोड हो रहा है...",
      noData: "कोई खतरा डेटा उपलब्ध नहीं",
      stats: {
        totalReports: "कुल रिपोर्ट्स",
        activeAlerts: "सक्रिय अलर्ट",
        verifiedReports: "सत्यापित रिपोर्ट्स",
        lastUpdated: "अंतिम अपडेट"
      }
    },
    ta: {
      title: "ஊடாடும் ஆபத்து வரைபடம் - VARUNA கடல் பாதுகாப்பு",
      description: "எங்கள் ஊடாடும் வரைபடத்தில் நேரடி கடல் ஆபத்து தரவு மற்றும் எச்சரிக்கைகளை ஆராயுங்கள். உங்கள் பகுதியில் கடலோர பாதுகாப்பு பற்றி தகவலறிந்திருங்கள்.",
      heading: "ஊடாடும் ஆபத்து வரைபடம்",
      subtitle: "நேரடி கடல் ஆபத்து கண்காணிப்பு மற்றும் காட்சிப்படுத்தல்",
      loading: "வரைபட தரவு ஏற்றப்படுகிறது...",
      noData: "ஆபத்து தரவு எதுவும் கிடைக்கவில்லை",
      stats: {
        totalReports: "மொத்த அறிக்கைகள்",
        activeAlerts: "செயலில் உள்ள எச்சரிக்கைகள்",
        verifiedReports: "சரிபார்க்கப்பட்ட அறிக்கைகள்",
        lastUpdated: "கடைசி புதுப்பிப்பு"
      }
    }
  };

  const content = pageContent[currentLanguage] || pageContent.en;

  const filteredReports = getFilteredReports();
  const stats = {
    totalReports: reports.length,
    activeAlerts: alerts.length,
    verifiedReports: reports.filter(r => r.status === 'verified').length,
    lastUpdated: new Date().toLocaleTimeString()
  };

  return (
    <>
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <meta name="keywords" content="interactive map, ocean hazards, real-time monitoring, coastal safety, risk assessment" />
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://varuna-ocean.com/interactive-risk-map" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.title} />
        <meta name="twitter:description" content={content.description} />
        <link rel="canonical" href="https://varuna-ocean.com/interactive-risk-map" />
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Icon name="FileText" className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{content.stats.totalReports}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Icon name="AlertTriangle" className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{content.stats.activeAlerts}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeAlerts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Icon name="CheckCircle" className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{content.stats.verifiedReports}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.verifiedReports}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Icon name="Clock" className="w-6 h-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{content.stats.lastUpdated}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.lastUpdated}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            totalReports={reports.length}
            filteredReports={filteredReports.length}
          />

          {/* Quick Actions */}
          <QuickActions onRefresh={handleRefresh} loading={loading} />

          {/* Interactive Map */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Icon name="Loader2" className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                <span className="text-gray-600">{content.loading}</span>
              </div>
            ) : reports.length === 0 && alerts.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Map" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{content.noData}</h3>
                <p className="text-gray-600">Check back later for updated hazard information.</p>
              </div>
            ) : (
              <MapContainer
                filteredReports={filteredReports.map(report => ({
                  ...report,
                  coordinates: {
                    lat: report.location?.latitude || 0,
                    lng: report.location?.longitude || 0
                  },
                  type: report.hazardType,
                  severity: report.severity,
                  timestamp: report.createdAt
                }))}
                selectedReport={selectedReport}
                onReportSelect={handleReportSelect}
                mapCenter={mapCenter}
                zoomLevel={zoomLevel}
              />
            )}
          </div>

          {/* Report Popup */}
          {selectedReport && (
            <ReportPopup
              report={{
                ...selectedReport,
                location: selectedReport.location || {
                  address: 'Unknown location',
                  latitude: 0,
                  longitude: 0
                }
              }}
              onClose={() => setSelectedReport(null)}
            />
          )}

          {/* Map Legend */}
          <MapLegend />
        </main>
      </div>
    </>
  );
};

export default InteractiveRiskMap;