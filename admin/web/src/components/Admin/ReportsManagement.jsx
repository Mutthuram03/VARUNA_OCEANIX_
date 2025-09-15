"use client";
import { useState, useEffect } from "react";
import {
  Filter,
  Calendar,
  MapPin,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  User,
  Phone,
  Search,
  RefreshCw
} from "lucide-react";
import { HazardReportService } from "../../firebase/services.js";

export const ReportsManagement = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedReports, setSelectedReports] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    critical: 0
  });

  const tabs = ["All", "Pending", "Verified", "Investigating", "Rejected", "Critical"];

  // Load reports from Firebase
  useEffect(() => {
    loadReports();
  }, []);

  // Filter reports based on active tab and search term
  useEffect(() => {
    filterReports();
  }, [reports, activeTab, searchTerm]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const result = await HazardReportService.getReports();
      if (result.success) {
        setReports(result.reports);
        calculateStats(result.reports);
      } else {
        console.error('Failed to load reports:', result.error);
        setReports([]);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reportsData) => {
    const stats = {
      total: reportsData.length,
      pending: reportsData.filter(r => r.status === 'pending').length,
      verified: reportsData.filter(r => r.status === 'verified').length,
      critical: reportsData.filter(r => r.severity === 'critical').length
    };
    setStats(stats);
  };

  const filterReports = () => {
    let filtered = [...reports];

    // Filter by tab
    if (activeTab !== "All") {
      if (activeTab === "Critical") {
        filtered = filtered.filter(report => report.severity === "critical");
      } else {
        filtered = filtered.filter(report => report.status === activeTab.toLowerCase());
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.hazardType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reporterInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  };

  const handleReportAction = async (reportId, action) => {
    try {
      let result;
      switch (action) {
        case 'verify':
          result = await HazardReportService.updateReportStatus(
            reportId,
            'verified',
            'admin-user',
            'Verified by admin'
          );
          break;
        case 'reject':
          result = await HazardReportService.updateReportStatus(
            reportId,
            'rejected',
            'admin-user',
            'Rejected by admin'
          );
          break;
        case 'investigate':
          result = await HazardReportService.updateReportStatus(
            reportId,
            'investigating',
            'admin-user',
            'Under investigation'
          );
          break;
      }

      if (result.success) {
        // Refresh reports
        await loadReports();
      }
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedReports.length === 0) return;

    try {
      for (const reportId of selectedReports) {
        await handleReportAction(reportId, action);
      }
      setSelectedReports([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "verified": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "investigating": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "critical": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "high": return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "medium": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "low": return <AlertTriangle className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const handleSelectReport = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    setSelectedReports(prev => 
      prev.length === reports.length ? [] : reports.map(r => r.id)
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-[#121212] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 
          className="text-2xl md:text-3xl font-bold text-[#012A66] dark:text-white mb-2"
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          Reports Management
        </h1>
        <p 
          className="text-gray-600 dark:text-gray-400"
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          Review, validate, and manage citizen disaster reports
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#1E1E1E] p-4 border border-gray-200 dark:border-[#333333]">
          <div className="text-2xl font-bold text-[#012A66] dark:text-white">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : stats.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Reports</div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] p-4 border border-gray-200 dark:border-[#333333]">
          <div className="text-2xl font-bold text-yellow-600">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : stats.pending}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending Review</div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] p-4 border border-gray-200 dark:border-[#333333]">
          <div className="text-2xl font-bold text-green-600">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : stats.verified}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Verified</div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] p-4 border border-gray-200 dark:border-[#333333]">
          <div className="text-2xl font-bold text-red-600">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : stats.critical}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Critical</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333333] mb-6">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-[#333333] px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 pt-6 relative font-medium transition-colors whitespace-nowrap text-sm ${
                  activeTab === tab
                    ? "text-[#2563EB] dark:text-[#4A9EFF]"
                    : "text-gray-600 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-[#4A9EFF]"
                }`}
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] dark:bg-[#4A9EFF]"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadReports}
              disabled={loading}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 bg-[#2563EB] text-white px-4 py-2 hover:bg-blue-700 transition-colors">
              <Download size={16} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleBulkAction('verify')}
              disabled={selectedReports.length === 0}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={16} />
              <span>Bulk Verify</span>
            </button>
            <button
              onClick={() => handleBulkAction('reject')}
              disabled={selectedReports.length === 0}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle size={16} />
              <span>Bulk Reject</span>
            </button>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-[#404040] focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white dark:bg-[#262626] text-gray-900 dark:text-white text-sm w-64"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 border border-gray-300 dark:border-[#404040] px-4 py-2 hover:border-[#2563EB] transition-colors"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border-t border-gray-200 dark:border-[#333333] p-6 bg-gray-50 dark:bg-[#262626]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
                <input type="date" className="w-full p-2 border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hazard Type</label>
                <select className="w-full p-2 border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-white">
                  <option>All Types</option>
                  <option>Flood</option>
                  <option>Wind</option>
                  <option>Pollution</option>
                  <option>Tide</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <input type="text" placeholder="Enter location..." className="w-full p-2 border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Source</label>
                <select className="w-full p-2 border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-white">
                  <option>All Sources</option>
                  <option>Mobile App</option>
                  <option>WhatsApp</option>
                  <option>Social Media</option>
                  <option>Official Report</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333333] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 dark:bg-[#262626]">
              <tr>
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedReports.length === reports.length}
                    onChange={handleSelectAll}
                    className="hover:ring-2 hover:ring-[#2563EB] hover:ring-opacity-30 transition-all"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Report Details
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Reporter
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Location & Type
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#333333]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <span className="text-gray-600 dark:text-gray-400">Loading reports...</span>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center">
                    <span className="text-gray-600 dark:text-gray-400">No reports found</span>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => handleSelectReport(report.id)}
                      className="hover:ring-2 hover:ring-[#2563EB] hover:ring-opacity-30 transition-all"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start space-x-3">
                      {getPriorityIcon(report.severity)}
                      <div className="min-w-0">
                        <div className="font-medium text-[#012A66] dark:text-white text-sm mb-1">
                          #{report.id?.substring(0, 8)} - {report.hazardType} Alert
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {report.createdAt?.toDate ? report.createdAt.toDate().toLocaleString() : 'Unknown time'}
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                          {report.description || 'No description provided'}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs bg-gray-100 dark:bg-[#333333] px-2 py-1 rounded">
                            {report.reporterInfo?.isAnonymous ? 'Anonymous' : 'Registered'}
                          </span>
                          {report.mediaUrls && report.mediaUrls.length > 0 && (
                            <span className="text-xs text-[#2563EB]">
                              {report.mediaUrls.length} media files
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center">
                        <User size={14} className="text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-[#012A66] dark:text-white text-sm">
                          {report.reporterInfo?.name || 'Anonymous'}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
                          <Phone size={10} />
                          <span>{report.reporterInfo?.contact || 'No contact'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start space-x-2">
                      <MapPin size={14} className="text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-[#012A66] dark:text-white font-medium">
                          {report.hazardType}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {report.location?.address || 'Unknown location'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {report.location?.latitude?.toFixed(4)}, {report.location?.longitude?.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-2">
                      {report.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleReportAction(report.id, 'verify')}
                            className="inline-flex items-center px-2 py-1 bg-green-600 text-white text-xs hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle size={10} className="mr-1" />
                            Verify
                          </button>
                          <button
                            onClick={() => handleReportAction(report.id, 'reject')}
                            className="inline-flex items-center px-2 py-1 bg-red-600 text-white text-xs hover:bg-red-700 transition-colors"
                          >
                            <XCircle size={10} className="mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                      {report.status === "verified" && (
                        <button
                          onClick={() => handleReportAction(report.id, 'investigate')}
                          className="inline-flex items-center px-2 py-1 bg-[#2563EB] text-white text-xs hover:bg-blue-700 transition-colors"
                        >
                          <AlertTriangle size={10} className="mr-1" />
                          Investigate
                        </button>
                      )}
                      <button className="inline-flex items-center px-2 py-1 bg-gray-600 text-white text-xs hover:bg-gray-700 transition-colors">
                        <Eye size={10} className="mr-1" />
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-[#333333] flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing 1-{Math.min(filteredReports.length, 10)} of {filteredReports.length} reports
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 dark:border-[#404040] text-sm hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#2563EB] text-white text-sm hover:bg-blue-700 transition-colors">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 dark:border-[#404040] text-sm hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 dark:border-[#404040] text-sm hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};