import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import Breadcrumb from '../../components/ui/Breadcrumb';
import HeroSection from './components/HeroSection';
import QuickActionsGrid from './components/QuickActionsGrid';
import AboutSection from './components/AboutSection';
import WhyItMattersSection from './components/WhyItMattersSection';
import HowItWorksSection from './components/HowItWorksSection';
import FooterSection from './components/FooterSection';
import { AlertService } from '../../services/firebase.js';

const HomeDashboard = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [isAuthenticated] = useState(false); // Mock authentication state
  const [user] = useState(null); // Mock user data

  // Real-time emergency alerts from Firebase
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);

  // Load real-time alerts from Firebase
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const result = await AlertService.getActiveAlerts();
        if (result.success) {
          setEmergencyAlerts(result.alerts);
        }
      } catch (error) {
        console.error('Error loading alerts:', error);
      }
    };

    loadAlerts();
  }, []);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('varuna-language') || 'en';
    setCurrentLanguage(savedLanguage);

    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  // Load dismissed alerts from localStorage
  useEffect(() => {
    const dismissed = JSON.parse(localStorage.getItem('dismissed-alerts') || '[]');
    setDismissedAlerts(dismissed);
  }, []);

  // Handle alert dismissal
  const handleAlertDismiss = (alertId) => {
    const newDismissed = [...dismissedAlerts, alertId];
    setDismissedAlerts(newDismissed);
    localStorage.setItem('dismissed-alerts', JSON.stringify(newDismissed));
  };

  // Handle authentication actions
  const handleAuthAction = (action) => {
    if (action === 'login') {
      // Navigate to login page
      window.location.href = '/login-registration';
    } else if (action === 'logout') {
      // Handle logout logic
      console.log('Logout clicked');
    }
  };

  // Filter active alerts that haven't been dismissed
  const activeAlerts = emergencyAlerts?.filter(
    alert => alert?.active && !dismissedAlerts?.includes(alert?.id)
  );

  // Get content based on current language
  const getContent = () => {
    const content = {
      en: {
        title: "VARUNA - Ocean Hazard Platform | Real-time Coastal Safety Intelligence",
        description: "Empowering citizens and INCOIS with real-time coastal hazard intelligence. Report hazards, view risk zones, and stay safe with our comprehensive ocean monitoring platform."
      },
      hi: {
        title: "वरुण - समुद्री खतरा प्लेटफॉर्म | वास्तविक समय तटीय सुरक्षा बुद्धिमत्ता",
        description: "नागरिकों और INCOIS को वास्तविक समय तटीय खतरा बुद्धिमत्ता के साथ सशक्त बनाना। खतरों की रिपोर्ट करें, जोखिम क्षेत्र देखें, और हमारे व्यापक समुद्री निगरानी प्लेटफॉर्म के साथ सुरक्षित रहें।"
      },
      ta: {
        title: "வருண - கடல் ஆபத்து தளம் | நிகழ்நேர கடலோர பாதுகாப்பு நுண்ணறிவு",
        description: "குடிமக்கள் மற்றும் INCOIS ஐ நிகழ்நேர கடலோர ஆபத்து நுண்ணறிவுடன் வலுப்படுத்துதல். ஆபத்துகளை அறிக்கை செய்யுங்கள், ஆபத்து மண்டலங்களைப் பார்க்கவும், எங்கள் விரிவான கடல் கண்காணிப்பு தளத்துடன் பாதுகாப்பாக இருங்கள்."
      }
    };

    return content?.[currentLanguage] || content?.en;
  };

  const pageContent = getContent();

  return (
    <>
      <Helmet>
        <title>{pageContent?.title}</title>
        <meta name="description" content={pageContent?.description} />
        <meta name="keywords" content="ocean hazard, coastal safety, INCOIS, citizen reporting, marine safety, tsunami warning, coastal monitoring" />
        <meta property="og:title" content={pageContent?.title} />
        <meta property="og:description" content={pageContent?.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://varuna-ocean.com/home-dashboard" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageContent?.title} />
        <meta name="twitter:description" content={pageContent?.description} />
        <link rel="canonical" href="https://varuna-ocean.com/home-dashboard" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header 
          isAuthenticated={isAuthenticated}
          user={user}
          onAuthAction={handleAuthAction}
        />

        {/* Emergency Alert Banner */}
        <EmergencyAlertBanner 
          alerts={activeAlerts}
          onDismiss={handleAlertDismiss}
        />

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb showHome={false} />
        </div>

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <HeroSection />

          {/* Quick Actions Grid */}
          <QuickActionsGrid />

          {/* About Section */}
          <AboutSection />

          {/* Why It Matters Section */}
          <WhyItMattersSection />

          {/* How It Works Section */}
          <HowItWorksSection />
        </main>

        {/* Footer */}
        <FooterSection />
      </div>
    </>
  );
};

export default HomeDashboard;