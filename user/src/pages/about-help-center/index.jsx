import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import all components
import PlatformInfoSection from './components/PlatformInfoSection';
import FAQSection from './components/FAQSection';
import UserGuideSection from './components/UserGuideSection';
import ContactSupportSection from './components/ContactSupportSection';
import TechnicalSupportSection from './components/TechnicalSupportSection';
import TrustSecuritySection from './components/TrustSecuritySection';
import TeamCreditsSection from './components/TeamCreditsSection';

const AboutHelpCenter = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [activeSection, setActiveSection] = useState('platform');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);

  // Load language preference and mock user data
  useEffect(() => {
    const savedLanguage = localStorage.getItem('varuna-language') || 'en';
    setCurrentLanguage(savedLanguage);

    // Mock authentication check
    const mockUser = localStorage.getItem('varuna-user');
    if (mockUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(mockUser));
    }

    // Mock emergency alerts
    setEmergencyAlerts([
      {
        id: 'alert-001',
        severity: 'high',
        message: 'High wave warning for Chennai coastal areas - waves up to 4.5 meters expected',
        location: 'Chennai, Tamil Nadu',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        actionUrl: '/interactive-risk-map',
        mapLocation: 'chennai-coast',
        active: true,
        dismissed: false
      }
    ]);
  }, []);

  // Handle language change
  useEffect(() => {
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  // Navigation sections
  const navigationSections = [
    { id: 'platform', label: 'About VARUNA', icon: 'Info' },
    { id: 'faq', label: 'FAQ', icon: 'HelpCircle' },
    { id: 'guides', label: 'User Guides', icon: 'BookOpen' },
    { id: 'contact', label: 'Contact Support', icon: 'MessageCircle' },
    { id: 'technical', label: 'Technical Help', icon: 'Settings' },
    { id: 'security', label: 'Trust & Security', icon: 'Shield' },
    { id: 'team', label: 'Team Credits', icon: 'Users' }
  ];

  // Handle authentication actions
  const handleAuthAction = (action) => {
    if (action === 'login') {
      // Redirect to login page
      window.location.href = '/login-registration';
    } else if (action === 'logout') {
      localStorage.removeItem('varuna-user');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Handle alert dismissal
  const handleAlertDismiss = (alertId) => {
    setEmergencyAlerts(prev => 
      prev?.map(alert => 
        alert?.id === alertId ? { ...alert, dismissed: true } : alert
      )
    );
  };

  // Scroll to section
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      const headerHeight = 120; // Account for fixed header and alert banner
      const elementPosition = element?.getBoundingClientRect()?.top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: 'smooth'
      });
    }
  };

  // Intersection Observer for active section tracking
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -50% 0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries?.forEach((entry) => {
        if (entry?.isIntersecting) {
          const sectionId = entry?.target?.getAttribute('data-section');
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    navigationSections?.forEach(section => {
      const element = document.querySelector(`[data-section="${section?.id}"]`);
      if (element) {
        observer?.observe(element);
      }
    });

    return () => observer?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        isAuthenticated={isAuthenticated}
        user={user}
        onAuthAction={handleAuthAction}
      />
      {/* Emergency Alert Banner */}
      <EmergencyAlertBanner 
        alerts={emergencyAlerts}
        onDismiss={handleAlertDismiss}
      />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb />
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="text-4xl animate-wave">🌊</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              About & Help Center
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about VARUNA platform, user guides, support resources, and our team
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/hazard-reporting-form">
            <Button variant="default" fullWidth iconName="AlertTriangle" iconPosition="left">
              Report Hazard
            </Button>
          </Link>
          <Link to="/interactive-risk-map">
            <Button variant="outline" fullWidth iconName="Map" iconPosition="left">
              View Risk Map
            </Button>
          </Link>
          <Link to="/my-alerts-dashboard">
            <Button variant="outline" fullWidth iconName="Bell" iconPosition="left">
              My Alerts
            </Button>
          </Link>
          <a href="tel:+911800123456">
            <Button variant="secondary" fullWidth iconName="Phone" iconPosition="left">
              Emergency Call
            </Button>
          </a>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-card rounded-lg p-4 shadow-ocean">
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Icon name="Navigation" size={20} className="text-primary mr-2" />
                Quick Navigation
              </h3>
              <nav className="space-y-2">
                {navigationSections?.map((section) => (
                  <button
                    key={section?.id}
                    onClick={() => scrollToSection(section?.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 flex items-center space-x-2 ${
                      activeSection === section?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={section?.icon} size={16} />
                    <span className="text-sm font-medium">{section?.label}</span>
                  </button>
                ))}
              </nav>

              {/* Emergency Contact */}
              <div className="mt-6 p-3 bg-error/10 rounded-lg border border-error/20">
                <h4 className="text-sm font-semibold text-error mb-2 flex items-center">
                  <Icon name="Phone" size={14} className="mr-1" />
                  Emergency Hotline
                </h4>
                <a 
                  href="tel:+911800123456"
                  className="text-sm text-error hover:underline font-medium"
                >
                  +91 1800-123-456
                </a>
                <p className="text-xs text-muted-foreground mt-1">
                  Available 24/7
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Platform Information Section */}
            <div data-section="platform">
              <PlatformInfoSection />
            </div>

            {/* FAQ Section */}
            <div data-section="faq">
              <FAQSection />
            </div>

            {/* User Guides Section */}
            <div data-section="guides">
              <UserGuideSection />
            </div>

            {/* Contact Support Section */}
            <div data-section="contact">
              <ContactSupportSection />
            </div>

            {/* Technical Support Section */}
            <div data-section="technical">
              <TechnicalSupportSection />
            </div>

            {/* Trust & Security Section */}
            <div data-section="security">
              <TrustSecuritySection />
            </div>

            {/* Team Credits Section */}
            <div data-section="team">
              <TeamCreditsSection />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <div className="bg-card rounded-lg p-6 shadow-ocean">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Still need help?
            </h3>
            <p className="text-muted-foreground mb-4">
              Our support team is here to assist you with any questions or issues
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a href="mailto:support@varuna.gov.in">
                <Button variant="default" iconName="Mail" iconPosition="left">
                  Email Support
                </Button>
              </a>
              <a href="tel:+911800123456">
                <Button variant="outline" iconName="Phone" iconPosition="left">
                  Call Support
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">🌊</span>
              <span className="text-xl font-bold text-primary">VARUNA</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date()?.getFullYear()} Team Oceanix • Smart India Hackathon 2025 • In collaboration with INCOIS
            </p>
            <div className="flex flex-wrap items-center justify-center space-x-6 text-sm">
              <a href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors duration-150">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors duration-150">
                Terms of Service
              </a>
              <a href="/accessibility" className="text-muted-foreground hover:text-primary transition-colors duration-150">
                Accessibility
              </a>
              <a href="mailto:support@varuna.gov.in" className="text-muted-foreground hover:text-primary transition-colors duration-150">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutHelpCenter;