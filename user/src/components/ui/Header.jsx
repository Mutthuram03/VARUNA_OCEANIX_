import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  // Navigation items
  const navigationItems = [
    { label: 'Home', path: '/home-dashboard', icon: 'Home', tooltip: 'Dashboard overview and quick access to all platform functions' },
    { label: 'Report Hazard', path: '/hazard-reporting-form', icon: 'AlertTriangle', tooltip: 'Submit coastal hazard reports for community safety' },
    { label: 'Risk Map', path: '/interactive-risk-map', icon: 'Map', tooltip: 'Interactive coastal hazard visualization and real-time data' },
    { label: 'My Alerts', path: '/my-alerts-dashboard', icon: 'Bell', tooltip: 'Personal alert monitoring and notification management' },
    { label: 'About', path: '/about-help-center', icon: 'Info', tooltip: 'Platform information and help resources' }
  ];

  // Language options
  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' }
  ];

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('varuna-language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Load saved dark mode preference
  useEffect(() => {
    const savedDark = localStorage.getItem('varuna-dark') === 'true';
    setDarkMode(savedDark);
    if (savedDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Handle language change
  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('varuna-language', languageCode);
    window.dispatchEvent(new CustomEvent('languageChange', { detail: languageCode }));
  };

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('varuna-dark', newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location?.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e?.key === 'Escape') setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Handle authentication actions
  const handleAuthAction = async (action) => {
    if (action === 'login') {
      // Navigate to login page
      navigate('/login-registration');
    } else if (action === 'logout') {
      // Handle logout
      try {
        await logout();
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const isActiveRoute = (path) => location?.pathname === path;
  const getCurrentLanguage = () => languages.find(lang => lang?.code === currentLanguage) || languages[0];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border shadow-ocean">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/home-dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-150 focus-ocean">
              <div className="flex items-center space-x-2">
                <span className="text-2xl animate-wave">🌊</span>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-primary">VARUNA</span>
                  <span className="text-xs text-muted-foreground -mt-1">Ocean Hazard Platform</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`nav-link ${isActiveRoute(item?.path) ? 'active' : ''}`}
                  title={item?.tooltip}
                >
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-md">
                    <Icon name={item?.icon} size={18} />
                    <span>{item?.label}</span>
                  </div>
                </Link>
              ))}
            </nav>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center space-x-4">
              
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentIndex = languages.findIndex(lang => lang?.code === currentLanguage);
                  const nextIndex = (currentIndex + 1) % languages.length;
                  handleLanguageChange(languages[nextIndex]?.code);
                }}
                className="flex items-center space-x-2"
                title="Switch language"
              >
                <span>{getCurrentLanguage()?.flag}</span>
                <span className="text-sm">{getCurrentLanguage()?.code?.toUpperCase()}</span>
              </Button>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                title="Toggle dark mode"
                className="p-2"
              >
                {darkMode ? '🌙' : '☀️'}
              </Button>

              {/* Authentication */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon name="User" size={16} className="text-muted-foreground" />
                    <span className="text-foreground">{user?.name || 'User'}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAuthAction('logout')}
                    iconName="LogOut"
                    iconSize={16}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleAuthAction('login')}
                  iconName="LogIn"
                  iconSize={16}
                >
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Mobile Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentIndex = languages.findIndex(lang => lang?.code === currentLanguage);
                  const nextIndex = (currentIndex + 1) % languages.length;
                  handleLanguageChange(languages[nextIndex]?.code);
                }}
                className="p-2"
              >
                <span>{getCurrentLanguage()?.flag}</span>
              </Button>

              {/* Mobile Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2"
              >
                {darkMode ? '🌙' : '☀️'}
              </Button>

              {/* Hamburger Menu */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
                aria-label="Toggle mobile menu"
              >
                <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu lg:hidden ${isMobileMenuOpen ? 'open' : 'closed'}`}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌊</span>
              <span className="font-bold text-primary">VARUNA</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 ${
                  isActiveRoute(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon name={item?.icon} size={20} />
                <span className="font-medium">{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Authentication */}
          <div className="p-4 border-t border-border">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-4 py-2">
                  <Icon name="User" size={20} className="text-muted-foreground" />
                  <span className="text-foreground">{user?.name || 'User'}</span>
                </div>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={async () => {
                    await handleAuthAction('logout');
                    setIsMobileMenuOpen(false);
                  }}
                  iconName="LogOut"
                  iconSize={16}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                fullWidth
                onClick={() => {
                  handleAuthAction('login');
                  setIsMobileMenuOpen(false);
                }}
                iconName="LogIn"
                iconSize={16}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Header;
