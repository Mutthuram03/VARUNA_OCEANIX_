"use client";

import { useState, useEffect } from "react";
import { useAuth, useAuthActions } from "../../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";
import { AdminHeader } from "../../components/Admin/AdminHeader";
import { AdminSidebar } from "../../components/Admin/AdminSidebar";
import { AdminDashboard } from "../../components/Admin/AdminDashboard";
import { ReportsManagement } from "../../components/Admin/ReportsManagement";
import { AlertsAdvisories } from "../../components/Admin/AlertsAdvisories";
import { UserManagement } from "../../components/Admin/UserManagement";
import { HazardReportService, AlertService } from "../../firebase/services.js";

const AdminPortal = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [systemStats, setSystemStats] = useState(null);
  const [criticalReportsCount, setCriticalReportsCount] = useState(0);
  const { user, isAuthenticated, loading } = useAuth();
  const { logout } = useAuthActions();
  const navigate = useNavigate();

  // Fetch real-time statistics
  const fetchSystemStats = async () => {
    try {
      // Get reports from last 24 hours
      const reportsResult = await HazardReportService.getReports({ timeRange: '24h' });
      const reports = reportsResult.success ? reportsResult.reports : [];

      // Get active alerts
      const alertsResult = await AlertService.getActiveAlerts();
      const alerts = alertsResult.success ? alertsResult.alerts : [];

      // Calculate statistics
      const verifiedToday = reports.filter(r => r.status === 'verified').length;
      const activeAlerts = alerts.length;

      // Get critical reports count
      const criticalCount = reports.filter(r => r.severity === 'critical').length;

      const stats = [
        {
          label: "Active Reports",
          value: reports.length.toString(),
          status: "pending",
          color: "bg-blue-500",
        },
        {
          label: "Verified Today",
          value: verifiedToday.toString(),
          status: "success",
          color: "bg-green-500",
        },
        {
          label: "Active Alerts",
          value: activeAlerts.toString(),
          status: "warning",
          color: "bg-orange-500",
        },
      ];

      setSystemStats(stats);
      setCriticalReportsCount(criticalCount);
    } catch (error) {
      console.error('Error fetching system stats:', error);
      // Set default values on error
      setSystemStats([
        {
          label: "Active Reports",
          value: "0",
          status: "pending",
          color: "bg-blue-500",
        },
        {
          label: "Verified Today",
          value: "0",
          status: "success",
          color: "bg-green-500",
        },
        {
          label: "Active Alerts",
          value: "0",
          status: "warning",
          color: "bg-orange-500",
        },
      ]);
      setCriticalReportsCount(0);
    }
  };

  // Check authentication and load stats on load
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/admin/login");
    } else if (isAuthenticated) {
      // Fetch initial stats when user is authenticated
      fetchSystemStats();

      // Set up periodic refresh every 30 seconds
      const interval = setInterval(fetchSystemStats, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "reports":
        return <ReportsManagement />;
      case "alerts":
        return <AlertsAdvisories />;
      case "users":
        return <UserManagement />;
      case "settings":
        return (
          <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                System Settings
              </h1>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  System configuration and settings would be available here.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
                      Alert Settings
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Configure alert thresholds and notification preferences
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
                      Integration Settings
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Manage WhatsApp, SMS, and other service integrations
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
                      Security Settings
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Configure authentication and access controls
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
                      System Maintenance
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Database backups, logs, and system health monitoring
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-x-hidden">
      <AdminHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="flex overflow-x-hidden">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          systemStats={systemStats}
          criticalReportsCount={criticalReportsCount}
        />
        <div className="flex-1 min-w-0 overflow-x-hidden">
          {renderActiveSection()}
        </div>
      </div>
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        * {
          box-sizing: border-box;
        }
        html, body {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default AdminPortal;
