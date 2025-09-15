"use client";
import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Plus,
  Edit,
  Send,
  Eye,
  Clock,
  MapPin,
  Users,
  MessageCircle,
  Smartphone,
  Save,
  X,
  RefreshCw
} from "lucide-react";
import { AlertService } from "../../firebase/services.js";

export const AlertsAdvisories = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Active");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    active: 0,
    totalReach: 0,
    pendingResponse: 0,
    scheduled: 0
  });
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    severity: 'medium',
    region: '',
    duration: '24',
    channels: {
      app: true,
      whatsapp: true,
      sms: false,
    }
  });

  const tabs = ["Active", "Draft", "Scheduled", "Archive"];

  // Load alerts from Firebase
  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const result = await AlertService.getAllAlerts();
      if (result.success) {
        setAlerts(result.alerts);
        calculateStats(result.alerts);
      } else {
        console.error('Failed to load alerts:', result.error);
        setAlerts([]);
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (alertsData) => {
    const stats = {
      active: alertsData.filter(a => a.active === true).length,
      totalReach: alertsData.reduce((sum, alert) => sum + (alert.reach || 0), 0),
      pendingResponse: alertsData.filter(a => !a.acknowledged).length,
      scheduled: alertsData.filter(a => a.scheduled).length
    };
    setStats(stats);
  };

  const handleCreateAlert = async () => {
    if (!newAlert.title || !newAlert.message) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const alertData = {
        title: newAlert.title,
        message: newAlert.message,
        severity: newAlert.severity,
        region: newAlert.region,
        active: true,
        channels: Object.keys(newAlert.channels).filter(key => newAlert.channels[key]),
        expiresAt: new Date(Date.now() + (parseInt(newAlert.duration) * 60 * 60 * 1000))
      };

      const result = await AlertService.createAlert(alertData);

      if (result.success) {
        await loadAlerts(); // Refresh alerts
        setShowCreateModal(false);
        setNewAlert({
          title: '',
          message: '',
          severity: 'medium',
          region: '',
          duration: '24',
          channels: {
            app: true,
            whatsapp: true,
            sms: false,
          }
        });
      } else {
        alert('Failed to create alert: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Failed to create alert');
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (activeTab) {
      case "Active":
        return alert.active === true;
      case "Draft":
        return !alert.active && !alert.scheduled;
      case "Scheduled":
        return alert.scheduled === true;
      case "Archive":
        return alert.active === false && !alert.scheduled;
      default:
        return true;
    }
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200";
    }
  };


  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-[#121212] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-2xl md:text-3xl font-bold text-[#012A66] dark:text-white mb-2"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              Alerts & Advisories
            </h1>
            <p 
              className="text-gray-600 dark:text-gray-400"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              Create, manage, and publish emergency alerts and weather advisories
            </p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-[#2563EB] text-white px-6 py-3 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span className="font-medium">Create Alert</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#1E1E1E] p-4 border border-gray-200 dark:border-[#333333]">
          <div className="text-2xl font-bold text-green-600">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : stats.active}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Alerts</div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] p-4 border border-gray-200 dark:border-[#333333]">
          <div className="text-2xl font-bold text-[#012A66] dark:text-white">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : `${stats.totalReach.toLocaleString()}`}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Reach</div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] p-4 border border-gray-200 dark:border-[#333333]">
          <div className="text-2xl font-bold text-yellow-600">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : stats.pendingResponse}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending Response</div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] p-4 border border-gray-200 dark:border-[#333333]">
          <div className="text-2xl font-bold text-blue-600">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : stats.scheduled}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Scheduled</div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333333]">
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

        {/* Alerts List */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={loadAlerts}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading alerts...</span>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-gray-600 dark:text-gray-400">No alerts found</span>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
              <div key={alert.id} className="border border-gray-200 dark:border-[#333333] p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <AlertTriangle size={20} className={
                        alert.severity === "critical" ? "text-red-500" :
                        alert.severity === "high" ? "text-orange-500" :
                        alert.severity === "medium" ? "text-yellow-500" :
                        "text-blue-500"
                      } />
                      <h3
                        className="text-lg font-semibold text-[#012A66] dark:text-white"
                        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                      >
                        {alert.title}
                      </h3>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity?.toUpperCase() || 'UNKNOWN'}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        alert.active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}>
                        {alert.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <p
                      className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed"
                      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                    >
                      {alert.message}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{alert.region || 'All regions'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Created: {alert.createdAt?.toDate ? alert.createdAt.toDate().toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users size={14} className="text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Reach: {alert.reach || 0}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle size={14} className="text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{alert.responses || 0} responses</span>
                      </div>
                    </div>

                    {alert.channels && alert.channels.length > 0 && (
                      <div className="flex items-center space-x-2 mt-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Channels:</span>
                        {alert.channels.map((channel, index) => (
                          <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                            {channel}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors" title="Preview">
                      <Eye size={16} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors" title="Edit">
                      <Edit size={16} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    {!alert.active && (
                      <button className="p-2 hover:bg-green-100 dark:hover:bg-green-900 transition-colors" title="Activate">
                        <Send size={16} className="text-green-600 dark:text-green-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Alert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 
                  className="text-xl font-bold text-[#012A66] dark:text-white"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  Create New Alert
                </h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alert Title *
                    </label>
                    <input
                      type="text"
                      value={newAlert.title}
                      onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#262626] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                      placeholder="Enter alert title..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      value={newAlert.message}
                      onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                      rows={4}
                      className="w-full p-3 border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#262626] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                      placeholder="Enter alert message..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Severity Level
                      </label>
                      <select 
                        value={newAlert.severity}
                        onChange={(e) => setNewAlert({...newAlert, severity: e.target.value})}
                        className="w-full p-3 border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#262626] text-gray-900 dark:text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration (hours)
                      </label>
                      <input
                        type="number"
                        value={newAlert.duration}
                        onChange={(e) => setNewAlert({...newAlert, duration: e.target.value})}
                        className="w-full p-3 border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#262626] text-gray-900 dark:text-white"
                        min="1"
                        max="168"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Region
                    </label>
                    <input
                      type="text"
                      value={newAlert.region}
                      onChange={(e) => setNewAlert({...newAlert, region: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#262626] text-gray-900 dark:text-white"
                      placeholder="Enter target regions..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Distribution Channels
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={newAlert.channels.app}
                          onChange={(e) => setNewAlert({
                            ...newAlert, 
                            channels: {...newAlert.channels, app: e.target.checked}
                          })}
                          className="w-4 h-4"
                        />
                        <Smartphone size={16} className="text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Mobile App Push Notifications</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={newAlert.channels.whatsapp}
                          onChange={(e) => setNewAlert({
                            ...newAlert, 
                            channels: {...newAlert.channels, whatsapp: e.target.checked}
                          })}
                          className="w-4 h-4"
                        />
                        <MessageCircle size={16} className="text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">WhatsApp Groups</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={newAlert.channels.sms}
                          onChange={(e) => setNewAlert({
                            ...newAlert, 
                            channels: {...newAlert.channels, sms: e.target.checked}
                          })}
                          className="w-4 h-4"
                        />
                        <MessageCircle size={16} className="text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">SMS Alerts</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Preview */}
                <div className="bg-gray-50 dark:bg-[#262626] p-6">
                  <h3 className="text-lg font-semibold text-[#012A66] dark:text-white mb-4">Preview</h3>
                  <div className="bg-white dark:bg-[#1E1E1E] p-4 border-l-4 border-[#2563EB] shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle size={16} className={
                        newAlert.severity === "critical" ? "text-red-500" :
                        newAlert.severity === "high" ? "text-orange-500" :
                        newAlert.severity === "medium" ? "text-yellow-500" :
                        "text-blue-500"
                      } />
                      <span className="text-sm font-bold text-[#012A66] dark:text-white">
                        {newAlert.title || "Alert Title"}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(newAlert.severity)}`}>
                        {newAlert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {newAlert.message || "Alert message will appear here..."}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Region: {newAlert.region || "Target region"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Valid for: {newAlert.duration} hours
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-[#333333]">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-[#404040] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors"
                >
                  Cancel
                </button>
                <button className="flex items-center space-x-2 px-6 py-2 bg-gray-600 text-white hover:bg-gray-700 transition-colors">
                  <Save size={16} />
                  <span>Save Draft</span>
                </button>
                <button 
                  onClick={handleCreateAlert}
                  className="flex items-center space-x-2 px-6 py-2 bg-[#2563EB] text-white hover:bg-blue-700 transition-colors"
                >
                  <Send size={16} />
                  <span>Publish Alert</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};