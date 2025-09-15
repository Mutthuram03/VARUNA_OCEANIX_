"use client";
import { useState } from "react";
import { useAuth, useAuthActions } from "../../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Bell,
  Menu,
  Shield,
  LogOut,
} from "lucide-react";

export const AdminHeader = ({ sidebarOpen, setSidebarOpen, activeSection, setActiveSection }) => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/admin/login");
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "reports", label: "Reports" },
    { id: "alerts", label: "Alerts" },
    { id: "users", label: "Users" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#1E1E1E] border-b border-[#E6EEF9] dark:border-[#333333] h-16">
      <div className="flex items-center justify-between px-4 md:px-6 h-full">
        {/* Left cluster */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-[#333333] active:bg-gray-200 dark:active:bg-[#404040] transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} className="text-gray-900 dark:text-white" />
          </button>

          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="flex items-center space-x-2">
              <Shield size={28} className="text-[#2563EB]" />
              <div>
                <div
                  className="text-sm md:text-base font-bold text-[#012A66] dark:text-white"
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  INCOIS Secure Access
                </div>
                <div
                  className="text-xs text-gray-600 dark:text-gray-400"
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  VARUNA DSS
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Navigation */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`pb-2 relative font-medium transition-colors whitespace-nowrap text-sm ${
                  activeSection === item.id
                    ? "text-[#2563EB] dark:text-[#4A9EFF]"
                    : "text-gray-600 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-[#4A9EFF]"
                }`}
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                {item.label}
                {activeSection === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] dark:bg-[#4A9EFF]"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right cluster */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Search */}
          <div className="relative">
            <button
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-[#333333] active:bg-gray-200 dark:active:bg-[#404040] transition-colors"
              onClick={() => setSearchExpanded(!searchExpanded)}
            >
              <Search size={20} className="text-gray-900 dark:text-white" />
            </button>

            <div className="hidden md:block relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search reports, alerts..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-200 dark:border-[#404040] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-colors bg-white dark:bg-[#262626] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              />
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-[#333333] active:bg-gray-200 dark:active:bg-[#404040] transition-colors">
            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 dark:bg-red-400 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">5</span>
            </div>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-[#404040]">
            <div className="hidden md:block text-right">
              <div
                className="text-sm font-medium text-[#012A66] dark:text-white"
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {user?.displayName || user?.email || "Admin User"}
              </div>
              <div
                className="text-xs text-gray-500 dark:text-gray-400"
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                Administrator
              </div>
            </div>
            <div className="w-8 h-8 bg-[#2563EB] dark:bg-[#4A9EFF] rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <button 
              onClick={handleLogout}
              className="p-1 hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors"
              title="Logout"
            >
              <LogOut size={16} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search expanded */}
      {searchExpanded && (
        <div className="md:hidden px-4 pb-4 border-t border-gray-200 dark:border-[#404040]">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search reports, alerts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-[#404040] focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white dark:bg-[#262626] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
};