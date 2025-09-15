"use client";
import { useState, useEffect } from "react";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Eye, 
  Send, 
  UserPlus, 
  RefreshCw, 
  Download, 
  Settings, 
  TrendingUp, 
  Filter,
  Bell,
  Shield,
  Globe,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { 
  HazardReportService, 
  AlertService, 
  AnalyticsService,
  NotificationService 
} from "../../../shared/firebase-services.js";
import { HAZARD_TYPES, ALERT_SEVERITY, REPORT_STATUS } from "../../../shared/firestore-schemas.js";

export const RealTimeDashboard = () => {
  const [liveReports, setLiveReports] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalReports: 0,
    verifiedReports: 0,
    pendingReports: 0,
    activeAlerts: 0,
    socialMediaMentions: 0,
    responseTime: 0,
    userEngagement: 0
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    timeRange: '24h',
    hazardType: 'all',
    severity: 'all',
    status: 'all'
  });

  useEffect(() => {
    loadDashboardData();
    setupRealTimeSubscriptions();
  }, [filters]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load reports
      const reportsResult = await HazardReportService.getReports({
        timeRange: filters.timeRange,
        hazardType: filters.hazardType !== 'all' ? filters.hazardType : undefined,
        severity: filters.severity !== 'all' ? filters.severity : undefined,
        status: filters.status !== 'all' ? filters.status : undefined
      });

      if (reportsResult.success) {
        setLiveReports(reportsResult.reports);
      }

      // Load alerts
      const alertsResult = await AlertService.getActiveAlerts();
      if (alertsResult.success) {
        setSystemAlerts(alertsResult.alerts);
      }

      // Load analytics
      const analyticsResult = await AnalyticsService.getDashboardMetrics('realtime');
      if (analyticsResult.success && analyticsResult.metrics) {
        setDashboardStats(analyticsResult.metrics);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeSubscriptions = () => {
    // Subscribe to live reports
    const unsubscribeReports = HazardReportService.subscribeToReports((reports) => {
      setLiveReports(reports);
      updateStats(reports);
    }, { status: 'pending' });

    // Subscribe to alerts
    const unsubscribeAlerts = AlertService.subscribeToAlerts((alerts) => {
      setSystemAlerts(alerts);
    });

    return () => {
      unsubscribeReports();
      unsubscribeAlerts();
    };
  };

  const updateStats = (reports) => {
    const stats = {
      totalReports: reports.length,
      verifiedReports: reports.filter(r => r.status === REPORT_STATUS.VERIFIED).length,
      pendingReports: reports.filter(r => r.status === REPORT_STATUS.PENDING).length,
      activeAlerts: systemAlerts.length,
      socialMediaMentions: 0, // Will be updated by analytics
      responseTime: 0, // Will be calculated
      userEngagement: 0 // Will be calculated
    };
    setDashboardStats(stats);
  };

  const handleReportAction = async (reportId, action) => {
    try {
      let result;
      switch (action) {
        case 'verify':
          result = await HazardReportService.updateReportStatus(
            reportId, 
            REPORT_STATUS.VERIFIED, 
            'admin-user', // Replace with actual admin ID
            'Verified by admin'
          );
          break;
        case 'reject':
          result = await HazardReportService.updateReportStatus(
            reportId, 
            REPORT_STATUS.REJECTED, 
            'admin-user',
            'Rejected by admin'
          );
          break;
        case 'investigate':
          result = await HazardReportService.updateReportStatus(
            reportId, 
            REPORT_STATUS.INVESTIGATING, 
            'admin-user',
            'Under investigation'
          );
          break;
      }

      if (result.success) {
        // Refresh data
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      [ALERT_SEVERITY.LOW]: 'text-green-600 bg-green-100',
      [ALERT_SEVERITY.MEDIUM]: 'text-yellow-600 bg-yellow-100',
      [ALERT_SEVERITY.HIGH]: 'text-orange-600 bg-orange-100',
      [ALERT_SEVERITY.CRITICAL]: 'text-red-600 bg-red-100'
    };
    return colors[severity] || 'text-gray-600 bg-gray-100';
  };

  const getStatusColor = (status) => {
    const colors = {
      [REPORT_STATUS.PENDING]: 'text-yellow-600 bg-yellow-100',
      [REPORT_STATUS.VERIFIED]: 'text-green-600 bg-green-100',
      [REPORT_STATUS.REJECTED]: 'text-red-600 bg-red-100',
      [REPORT_STATUS.INVESTIGATING]: 'text-blue-600 bg-blue-100',
      [REPORT_STATUS.RESOLVED]: 'text-gray-600 bg-gray-100'
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

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Real-Time Ocean Hazard Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Monitor and manage ocean hazard reports and alerts in real-time
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Time Range
              </label>
              <select
                value={filters.timeRange}
                onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
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
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="all">All Types</option>
                {Object.entries(HAZARD_TYPES).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Severity
              </label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="all">All Severities</option>
                {Object.entries(ALERT_SEVERITY).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Reports</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {dashboardStats.totalReports}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardStats.verifiedReports}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {dashboardStats.pendingReports}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {dashboardStats.activeAlerts}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Live Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Reports */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Recent Reports
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : liveReports.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                  No reports found
                </p>
              ) : (
                <div className="space-y-4">
                  {liveReports.slice(0, 5).map((report) => (
                    <div key={report.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-slate-900 dark:text-slate-100">
                          {report.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                          {report.severity.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {report.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {report.location?.address || 'Unknown location'}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimeAgo(report.createdAt)}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>

                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleReportAction(report.id, 'verify')}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleReportAction(report.id, 'investigate')}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Investigate
                        </button>
                        <button
                          onClick={() => handleReportAction(report.id, 'reject')}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                System Alerts
              </h2>
            </div>
            <div className="p-6">
              {systemAlerts.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                  No active alerts
                </p>
              ) : (
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-slate-900 dark:text-slate-100">
                          {alert.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {alert.description}
                      </p>
                      
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimeAgo(alert.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

