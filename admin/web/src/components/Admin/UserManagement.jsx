"use client";
import { useState, useEffect } from "react";
import {
  UserPlus,
  Users,
  Award,
  Shield,
  Edit,
  Trash2,
  Search,
  Filter,
  Star,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  CheckCircle,
  XCircle,
  Plus,
  X,
  RefreshCw
} from "lucide-react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { HazardReportService } from "../../firebase/services.js";

export const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("Analysts");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dynamic state for users and statistics
  const [analysts, setAnalysts] = useState([]);
  const [citizenReporters, setCitizenReporters] = useState([]);
  const [analystStats, setAnalystStats] = useState({
    total: 0,
    active: 0,
    avgAccuracy: 0,
    reportsToday: 0
  });
  const [reporterStats, setReporterStats] = useState({
    total: 0,
    goldBadges: 0,
    totalRewards: 0,
    avgReliability: 0
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Analyst',
    region: '',
    specialization: ''
  });

  const tabs = ["Analysts", "Citizen Reporters", "Roles & Permissions"];

  // Load data on component mount
  useEffect(() => {
    loadUsersData();
  }, []);

  const loadUsersData = async () => {
    setLoading(true);
    try {
      // Load reports to calculate statistics
      const reportsResult = await HazardReportService.getReports({ timeRange: '24h' });
      const reports = reportsResult.success ? reportsResult.reports : [];

      // For now, we'll create mock users based on the reports data
      // In a real app, you'd have a users collection with proper user profiles
      await generateMockUsersFromReports(reports);
    } catch (error) {
      console.error('Error loading users data:', error);
      // Set empty arrays on error
      setAnalysts([]);
      setCitizenReporters([]);
      setAnalystStats({ total: 0, active: 0, avgAccuracy: 0, reportsToday: 0 });
      setReporterStats({ total: 0, goldBadges: 0, totalRewards: 0, avgReliability: 0 });
    } finally {
      setLoading(false);
    }
  };

  const generateMockUsersFromReports = async (reports) => {
    // Group reports by reporter info to create analyst profiles
    const analystMap = new Map();
    const reporterMap = new Map();

    reports.forEach(report => {
      if (report.reporterInfo?.name && report.reporterInfo?.name !== 'Anonymous') {
        if (report.reporterInfo?.isAnonymous === false) {
          // This could be an analyst (has email/name)
          if (!analystMap.has(report.reporterInfo.name)) {
            analystMap.set(report.reporterInfo.name, {
              name: report.reporterInfo.name,
              email: report.reporterInfo.contact || `${report.reporterInfo.name.toLowerCase().replace(' ', '.')}@incois.gov.in`,
              phone: report.reporterInfo.contact || '+91 98765 43210',
              role: 'Analyst',
              region: report.location?.address || 'Tamil Nadu Coast',
              specialization: 'General',
              status: 'active',
              joinDate: '2023-06-15',
              reportsHandled: 0,
              verificationAccuracy: Math.floor(Math.random() * 20) + 80, // 80-99%
              lastActive: '2 hours ago',
              reports: []
            });
          }
          analystMap.get(report.reporterInfo.name).reports.push(report);
          analystMap.get(report.reporterInfo.name).reportsHandled++;
        } else {
          // This could be a citizen reporter
          if (!reporterMap.has(report.reporterInfo.name)) {
            reporterMap.set(report.reporterInfo.name, {
              name: report.reporterInfo.name,
              phone: report.reporterInfo.contact || '+91 98765 43210',
              location: report.location?.address || 'Unknown Location',
              reportsSubmitted: 0,
              verifiedReports: 0,
              badgeLevel: 'Bronze',
              reliability: Math.floor(Math.random() * 30) + 70, // 70-99%
              joinDate: '2023-06-15',
              lastReport: new Date().toISOString().split('T')[0],
              totalReward: Math.floor(Math.random() * 2000) + 500, // 500-2500
              reports: []
            });
          }
          reporterMap.get(report.reporterInfo.name).reports.push(report);
          reporterMap.get(report.reporterInfo.name).reportsSubmitted++;
          if (report.status === 'verified') {
            reporterMap.get(report.reporterInfo.name).verifiedReports++;
          }
        }
      }
    });

    // Convert maps to arrays
    const analystsArray = Array.from(analystMap.values()).map((analyst, index) => ({
      id: index + 1,
      ...analyst
    }));

    const reportersArray = Array.from(reporterMap.values()).map((reporter, index) => ({
      id: index + 1,
      ...reporter,
      // Calculate badge level based on verified reports
      badgeLevel: reporter.verifiedReports >= 20 ? 'Gold' :
                  reporter.verifiedReports >= 10 ? 'Silver' : 'Bronze'
    }));

    setAnalysts(analystsArray);
    setCitizenReporters(reportersArray);

    // Calculate statistics
    const totalAnalysts = analystsArray.length;
    const activeAnalysts = analystsArray.filter(a => a.status === 'active').length;
    const avgAccuracy = totalAnalysts > 0 ?
      Math.round(analystsArray.reduce((sum, a) => sum + a.verificationAccuracy, 0) / totalAnalysts) : 0;
    const reportsToday = reports.length;

    const totalReporters = reportersArray.length;
    const goldBadges = reportersArray.filter(r => r.badgeLevel === 'Gold').length;
    const totalRewards = reportersArray.reduce((sum, r) => sum + r.totalReward, 0);
    const avgReliability = totalReporters > 0 ?
      Math.round(reportersArray.reduce((sum, r) => sum + r.reliability, 0) / totalReporters) : 0;

    setAnalystStats({
      total: totalAnalysts,
      active: activeAnalysts,
      avgAccuracy: avgAccuracy,
      reportsToday: reportsToday
    });

    setReporterStats({
      total: totalReporters,
      goldBadges: goldBadges,
      totalRewards: totalRewards,
      avgReliability: avgReliability
    });
  };

  const filteredAnalysts = analysts.filter(analyst =>
    analyst.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analyst.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analyst.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReporters = citizenReporters.filter(reporter =>
    reporter.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reporter.phone?.includes(searchTerm) ||
    reporter.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roles = [
    {
      name: "Administrator",
      description: "Full system access and user management",
      permissions: ["All permissions"],
      userCount: analystStats.total > 0 ? Math.max(1, Math.floor(analystStats.total * 0.1)) : 1
    },
    {
      name: "Senior Analyst",
      description: "Advanced report analysis and team supervision",
      permissions: ["Verify reports", "Manage alerts", "Supervise analysts", "Export data"],
      userCount: analystStats.total > 0 ? Math.max(1, Math.floor(analystStats.total * 0.2)) : 1
    },
    {
      name: "Analyst",
      description: "Report verification and basic alert management",
      permissions: ["Verify reports", "Create alerts", "View analytics"],
      userCount: analystStats.total > 0 ? Math.max(analystStats.total - Math.floor(analystStats.total * 0.3), 0) : 0
    },
    {
      name: "Moderator",
      description: "Content moderation and basic user management",
      permissions: ["Moderate reports", "Manage users", "View reports"],
      userCount: analystStats.total > 0 ? Math.floor(analystStats.total * 0.2) : 0
    }
  ];

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Gold": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300";
      case "Silver": return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300";
      case "Bronze": return "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300";
      default: return "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  const getStatusColor = (status) => {
    return status === "active" 
      ? "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300"
      : "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300";
  };

  const handleAddUser = () => {
    // Handle user creation logic here
    setShowAddUserModal(false);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'Analyst',
      region: '',
      specialization: ''
    });
  };

  const renderAnalysts = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E1E1E] p-4 border border-gray-200 dark:border-[#333333]">
          <div className="text-2xl font-bold text-[#012A66] dark:text-white">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : analystStats.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Analysts</div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] p-4 border border-gray-200 dark:border-[#333333]">
          <div className="text-2xl font-bold text-green-600">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : analystStats.active}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] p-4 border border-gray-200 dark:border-[#333333]">
          <div className="text-2xl font-bold text-[#2563EB]">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : `${analystStats.avgAccuracy}%`}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Accuracy</div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] p-4 border border-gray-200 dark:border-[#333333]">
          <div className="text-2xl font-bold text-orange-600">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : analystStats.reportsToday}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Reports Today</div>
        </div>
      </div>

      {/* Analysts Table */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333333]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-[#262626]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Analyst
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Role & Region
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Performance
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
                  <td colSpan="5" className="px-4 py-8 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <span className="text-gray-600 dark:text-gray-400">Loading analysts...</span>
                  </td>
                </tr>
              ) : filteredAnalysts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center">
                    <span className="text-gray-600 dark:text-gray-400">No analysts found</span>
                  </td>
                </tr>
              ) : (
                filteredAnalysts.map((analyst) => (
                <tr key={analyst.id} className="hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {analyst.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-[#012A66] dark:text-white">
                          {analyst.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {analyst.email}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Last active: {analyst.lastActive}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-[#012A66] dark:text-white text-sm">
                        {analyst.role}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {analyst.region}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {analyst.specialization}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-[#012A66] dark:text-white">
                        {analyst.reportsHandled} reports
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        {analyst.verificationAccuracy}% accuracy
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Since {analyst.joinDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(analyst.status)}`}>
                      {analyst.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-2">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors" title="View Details">
                        <Eye size={14} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors" title="Edit">
                        <Edit size={14} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors" title="More Options">
                        <MoreVertical size={14} className="text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              )
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCitizenReporters = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E1E1E] p-4 border border-gray-200 dark:border-[#333333]">
          <div className="text-2xl font-bold text-[#012A66] dark:text-white">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : reporterStats.total.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Reporters</div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] p-4 border border-gray-200 dark:border-[#333333]">
          <div className="text-2xl font-bold text-yellow-600">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : reporterStats.goldBadges}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Gold Badges</div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] p-4 border border-gray-200 dark:border-[#333333]">
          <div className="text-2xl font-bold text-green-600">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : `₹${(reporterStats.totalRewards / 1000).toFixed(1)}K`}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Rewards Distributed</div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] p-4 border border-gray-200 dark:border-[#333333]">
          <div className="text-2xl font-bold text-blue-600">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : `${reporterStats.avgReliability}%`}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Reliability</div>
        </div>
      </div>

      {/* Citizen Reporters Table */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333333]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-[#262626]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Reporter
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Reports & Badge
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Performance
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Rewards
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#333333]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <span className="text-gray-600 dark:text-gray-400">Loading citizen reporters...</span>
                  </td>
                </tr>
              ) : filteredReporters.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center">
                    <span className="text-gray-600 dark:text-gray-400">No citizen reporters found</span>
                  </td>
                </tr>
              ) : (
                filteredReporters.map((reporter) => (
                <tr key={reporter.id} className="hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {reporter.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-[#012A66] dark:text-white">
                          {reporter.name}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                          <Phone size={12} />
                          <span>{reporter.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <MapPin size={10} />
                          <span>{reporter.location}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-[#012A66] dark:text-white">
                        {reporter.reportsSubmitted} submitted
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        {reporter.verifiedReports} verified
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Award size={14} className="text-gray-400" />
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getBadgeColor(reporter.badgeLevel)}`}>
                          {reporter.badgeLevel}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-[#012A66] dark:text-white">
                        {reporter.reliability}% reliable
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Joined: {reporter.joinDate}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Last report: {reporter.lastReport}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">
                        ₹{reporter.totalReward}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Total earned
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-2">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors" title="View Details">
                        <Eye size={14} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-yellow-100 dark:hover:bg-yellow-900 transition-colors" title="Award Badge">
                        <Award size={14} className="text-yellow-600 dark:text-yellow-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors" title="More Options">
                        <MoreVertical size={14} className="text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRoles = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map((role, index) => (
          <div key={index} className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333333] p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Shield size={20} className="text-[#2563EB]" />
                <div>
                  <h3 className="text-lg font-semibold text-[#012A66] dark:text-white">
                    {role.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {role.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#012A66] dark:text-white">
                  {role.userCount}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">users</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permissions:</div>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission, pIndex) => (
                  <span key={pIndex} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded">
                    {permission}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors" title="Edit Role">
                <Edit size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors" title="View Users">
                <Users size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
              User Management
            </h1>
            <p 
              className="text-gray-600 dark:text-gray-400"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              Manage analysts, citizen reporters, and system permissions
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadUsersData}
              disabled={loading}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-3 hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span className="font-medium">Refresh</span>
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center space-x-2 bg-[#2563EB] text-white px-6 py-3 hover:bg-blue-700 transition-colors"
            >
              <UserPlus size={20} />
              <span className="font-medium">Add User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333333] mb-6">
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

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-[#333333]">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-[#404040] focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white dark:bg-[#262626] text-gray-900 dark:text-white text-sm"
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
      </div>

      {/* Content based on active tab */}
      {activeTab === "Analysts" && renderAnalysts()}
      {activeTab === "Citizen Reporters" && renderCitizenReporters()}
      {activeTab === "Roles & Permissions" && renderRoles()}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 
                  className="text-xl font-bold text-[#012A66] dark:text-white"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  Add New User
                </h2>
                <button 
                  onClick={() => setShowAddUserModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#262626] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2563EB]"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#262626] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2563EB]"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#262626] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2563EB]"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role *
                  </label>
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#262626] text-gray-900 dark:text-white"
                  >
                    <option value="Analyst">Analyst</option>
                    <option value="Senior Analyst">Senior Analyst</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    value={newUser.region}
                    onChange={(e) => setNewUser({...newUser, region: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#262626] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2563EB]"
                    placeholder="Assigned region"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={newUser.specialization}
                    onChange={(e) => setNewUser({...newUser, specialization: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#262626] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2563EB]"
                    placeholder="Area of expertise"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-[#333333]">
                <button 
                  onClick={() => setShowAddUserModal(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-[#404040] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddUser}
                  className="px-6 py-2 bg-[#2563EB] text-white hover:bg-blue-700 transition-colors"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};