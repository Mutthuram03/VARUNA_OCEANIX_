"use client";
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Users,
  Settings,
  X,
  Shield,
  Activity,
  LogOut,
} from "lucide-react";

export const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  setActiveSection,
  systemStats,
  criticalReportsCount,
}) => {
  const navItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      description: "Overview & live feed",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      id: "reports",
      icon: FileText,
      label: "Reports Management",
      description: "Citizen reports & validation",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      id: "alerts",
      icon: AlertTriangle,
      label: "Alerts & Advisories",
      description: "Create & publish alerts",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: "users",
      icon: Users,
      label: "User Management",
      description: "Analysts & roles",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      description: "System configuration",
      gradient: "from-gray-500 to-slate-600",
    },
  ];

  // Default stats if not provided
  const defaultStats = [
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
  ];

  const statsToShow = systemStats || defaultStats;

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
          w-72 lg:w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen border-r border-slate-700 p-4 md:p-6
          transition-transform duration-300 ease-in-out shadow-2xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile close button */}
        <button
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-slate-700 active:bg-slate-600 rounded-md transition-colors text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>

        {/* System Status Card */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <div
                className="font-bold text-white text-sm md:text-base"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                VARUNA DSS
              </div>
              <div
                className="text-xs text-slate-300"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                Disaster Response System
              </div>
            </div>
            <div className="ml-auto">
              <div className="relative">
                <Activity size={16} className="text-green-400 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-3">
            {statsToShow.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700 backdrop-blur-sm hover:bg-slate-700/50 transition-colors cursor-pointer"
              >
                <div>
                  <div
                    className="text-xs text-slate-400"
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    className="text-sm font-bold text-white mt-1"
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                  >
                    {stat.value}
                  </div>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${stat.color} shadow-lg`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mb-6 md:mb-8">
          <div
            className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Administration
          </div>
          <div className="space-y-2">
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => {
                    setActiveSection(item.id);
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-start space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group ${
                    activeSection === item.id
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-[1.02]`
                      : "text-slate-300 hover:bg-slate-800 hover:text-white hover:transform hover:scale-[1.01]"
                  }`}
                >
                  <item.icon size={20} className="mt-0.5" />
                  <div className="min-w-0">
                    <div
                      className="text-sm font-medium"
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        activeSection === item.id
                          ? "text-white/80"
                          : "text-slate-400 group-hover:text-slate-300"
                      }`}
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    >
                      {item.description}
                    </div>
                  </div>

                  {/* Active indicator */}
                  {activeSection === item.id && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </nav>

        {/* Emergency Alert Banner */}
        <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-500/30 p-4 rounded-xl mb-4 backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <AlertTriangle
              size={20}
              className="text-red-400 mt-0.5 animate-pulse"
            />
            <div>
              <div
                className="text-sm font-semibold text-red-300 mb-1"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                System Alert
              </div>
              <div
                className="text-xs text-red-200 mb-3"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                {criticalReportsCount || 0} critical reports require immediate attention
              </div>
              <button
                onClick={() => {
                  setActiveSection("reports");
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full font-medium transition-colors transform hover:scale-105"
              >
                Review Now →
              </button>
            </div>
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="mt-auto pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <div>
                <div className="text-white font-medium text-sm">Admin User</div>
                <div className="text-slate-400 text-xs">Administrator</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4">
          <div
            className="text-xs text-slate-500 text-center"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            INCOIS VARUNA DSS v2.1
          </div>
        </div>
      </div>
    </>
  );
};
