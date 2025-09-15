"use client";

import { useState, useEffect } from "react";
import { useAuth, useAuthActions } from "../../../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user, isAuthenticated } = useAuth();
  const { signIn } = useAuthActions();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await signIn(email, password);

      if (result.success) {
        setSuccess("Authentication successful! Redirecting...");
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle size={20} className="text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle size={20} className="text-green-500" />
          <span className="text-green-700 text-sm">{success}</span>
        </div>
      )}


      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email Address
        </label>
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400"
            size={20}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-purple-200 dark:border-[#6B46C1] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-200"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400"
            size={20}
          />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-12 py-3 border border-purple-200 dark:border-[#6B46C1] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-200"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          "Sign In"
        )}
      </button>

    </form>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <Shield size={32} className="text-white" />
            </div>
            <div className="text-left">
              <h1
                className="text-2xl font-bold text-white drop-shadow-lg"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                INCOIS Secure Access
              </h1>
              <p
                className="text-sm text-white/80"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                VARUNA DSS Admin Portal
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] py-8 px-6 shadow-2xl border border-gray-200 dark:border-[#333333] rounded-2xl backdrop-blur-lg">
            <div className="mb-6">
              <h2
                className="text-xl font-semibold text-gray-900 dark:text-white"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                Administrator Sign In
              </h2>
              <p
                className="text-sm text-gray-600 dark:text-gray-400 mt-2"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                Authorized personnel only. Please enter your credentials.
              </p>
            </div>

            {renderLoginForm()}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-start">
            <Shield
              size={16}
              className="text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2"
            />
            <div>
              <p className="text-xs text-yellow-800 dark:text-yellow-300 font-medium">
                Security Notice
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                This is a restricted government system. All access is monitored
                and logged. Unauthorized access is strictly prohibited and
                subject to legal action.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p
            className="text-xs text-white/80 drop-shadow"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            © 2024 Indian National Centre for Ocean Information Services
            (INCOIS)
          </p>
          <p
            className="text-xs text-white/80 drop-shadow mt-1"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            VARUNA Disaster Support System v2.1
          </p>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <style jsx global>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-bounce {
          animation: bounce 3s infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8,0,1,1);
          }
          50% {
            transform: none;
            animation-timing-function: cubic-bezier(0,0,0.2,1);
          }
        }
      `}</style>
    </div>
  );
}
