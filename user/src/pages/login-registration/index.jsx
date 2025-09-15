import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import TrustSignals from './components/TrustSignals';
import SocialAuth from './components/SocialAuth';
import Icon from '../../components/AppIcon';
import { AuthService } from '../../services/firebase.js';

const LoginRegistration = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Mock emergency alerts
  const emergencyAlerts = [
    {
      id: 'alert-001',
      severity: 'high',
      message: 'High wave warning issued for Chennai coast - waves up to 3.5m expected',
      location: 'Chennai Coast',
      timestamp: new Date(Date.now() - 1800000),
      active: true,
      dismissed: false,
      actionUrl: '/interactive-risk-map',
      mapLocation: '13.0827,80.2707'
    }
  ];

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('varuna-language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (e) => {
      setCurrentLanguage(e?.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  // Check for redirect parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params?.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    }
  }, [location?.search]);

  const handleLogin = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await AuthService.signIn(formData.email, formData.password);

      if (result.success) {
        setSuccess('Login successful! Redirecting to dashboard...');

        // Store auth state in localStorage
        localStorage.setItem('varuna-auth', JSON.stringify({
          isAuthenticated: true,
          user: result.user,
          loginTime: new Date().toISOString()
        }));

        // Dispatch auth change event
        window.dispatchEvent(new CustomEvent('authChange', {
          detail: { isAuthenticated: true, user: result.user }
        }));

        // Redirect after success message
        setTimeout(() => {
          const redirectTo = new URLSearchParams(location.search)?.get('redirect') || '/home-dashboard';
          navigate(redirectTo);
        }, 2000);
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await AuthService.signUp(
        formData.email,
        formData.password,
        formData.name
      );

      if (result.success) {
        setSuccess('Account created successfully! You can now sign in.');

        // Auto-switch to login after successful registration
        setTimeout(() => {
          setActiveTab('login');
          setSuccess(null);
        }, 3000);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setError(`${provider} authentication is currently in development. Please use email login.`);
  };

  const handleAlertDismiss = (alertId) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  const activeAlerts = emergencyAlerts?.filter(alert => !dismissedAlerts?.includes(alert?.id));

  const getContent = () => {
    switch (currentLanguage) {
      case 'hi':
        return {
          title: 'VARUNA में आपका स्वागत है',
          subtitle: 'तटीय खतरा निगरानी मंच',
          description: 'अपने व्यक्तिगत अलर्ट ट्रैकिंग और खतरा रिपोर्टिंग के लिए साइन इन करें'
        };
      case 'ta':
        return {
          title: 'VARUNA இல் உங்களை வரவேற்கிறோம்',
          subtitle: 'கடலோர அபாய கண்காணிப்பு தளம்',
          description: 'உங்கள் தனிப்பட்ட எச்சரிக்கை கண்காணிப்பு மற்றும் அபாய அறிக்கையிடலுக்கு உள்நுழையவும்'
        };
      default:
        return {
          title: 'Welcome to VARUNA',
          subtitle: 'Ocean Hazard Monitoring Platform',
          description: 'Sign in for personalized alert tracking and hazard reporting'
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={false}
        onAuthAction={() => {}}
      />
      <EmergencyAlertBanner 
        alerts={activeAlerts}
        onDismiss={handleAlertDismiss}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />

        <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12">
          <div className="w-full max-w-md">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="text-4xl animate-wave">🌊</span>
                <div>
                  <h1 className="text-2xl font-bold text-primary">{content?.title}</h1>
                  <p className="text-sm text-muted-foreground">{content?.subtitle}</p>
                </div>
              </div>
              <p className="text-muted-foreground">{content?.description}</p>
              <p className="text-xs text-muted-foreground mt-2">Demo: demo@varuna.gov.in / demo123</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 rounded-lg bg-success/10 border border-success/20 text-success">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={20} />
                  <span className="text-sm font-medium">{success}</span>
                </div>
              </div>
            )}

            {/* Auth Form Card */}
            <div className="bg-card border border-border rounded-xl shadow-ocean-lg p-6">
              <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

              {activeTab === 'login' ? (
                <LoginForm
                  onSubmit={handleLogin}
                  loading={loading}
                  error={error}
                />
              ) : (
                <RegistrationForm
                  onSubmit={handleRegistration}
                  loading={loading}
                  error={error}
                />
              )}

              <div className="mt-6">
                <SocialAuth
                  loading={loading}
                  onSocialLogin={handleSocialLogin}
                />
              </div>

              <TrustSignals />
            </div>

            {/* Additional Help */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Need help? Visit our{' '}
                <button
                  onClick={() => navigate('/about-help-center')}
                  className="text-primary hover:text-primary/80 transition-colors focus-ocean"
                >
                  Help Center
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
      {/* Ocean-inspired background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default LoginRegistration;