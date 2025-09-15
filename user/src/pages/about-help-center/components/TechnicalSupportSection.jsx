import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TechnicalSupportSection = () => {
  const [expandedItems, setExpandedItems] = useState(new Set(['browser-compatibility']));

  const technicalResources = [
    {
      id: 'browser-compatibility',
      title: 'Browser Compatibility',
      icon: 'Globe',
      content: {
        description: 'VARUNA is optimized for modern web browsers with the following minimum requirements:',
        items: [
          {
            category: 'Recommended Browsers',
            details: [
              'Google Chrome 90+ (Best performance)',
              'Mozilla Firefox 88+',
              'Safari 14+ (macOS/iOS)',
              'Microsoft Edge 90+',
              'Samsung Internet 14+ (Android)'
            ]
          },
          {
            category: 'Mobile Support',
            details: [
              'iOS Safari 14+ (iPhone/iPad)',
              'Chrome Mobile 90+ (Android)',
              'Firefox Mobile 88+',
              'Progressive Web App (PWA) support'
            ]
          },
          {
            category: 'Required Features',
            details: [
              'JavaScript enabled',
              'Geolocation API support',
              'Local Storage enabled',
              'WebGL for map rendering',
              'Camera access for photo uploads'
            ]
          }
        ]
      }
    },
    {
      id: 'troubleshooting',
      title: 'Common Issues & Solutions',
      icon: 'Wrench',
      content: {
        description: 'Quick fixes for frequently encountered problems:',
        items: [
          {
            category: 'Location Issues',
            details: [
              'Enable location services in browser settings',
              'Allow VARUNA to access your location when prompted',
              'Clear browser cache if location detection fails',
              'Use manual map selection as alternative',
              'Check if location services are enabled on device'
            ]
          },
          {
            category: 'Login Problems',
            details: [
              'Clear browser cookies and cache',
              'Disable browser extensions temporarily',
              'Try incognito/private browsing mode',
              'Reset password if login fails repeatedly',
              'Contact support if account is locked'
            ]
          },
          {
            category: 'Map Loading Issues',
            details: [
              'Check internet connection stability',
              'Disable ad blockers for VARUNA domain',
              'Clear browser cache and reload page',
              'Try different browser or device',
              'Report persistent issues to technical support'
            ]
          },
          {
            category: 'File Upload Problems',
            details: [
              'Ensure file size is under 10MB',
              'Use supported formats: JPG, PNG, MP4, MOV',
              'Check camera permissions in browser',
              'Try uploading from different device',
              'Compress large files before upload'
            ]
          }
        ]
      }
    },
    {
      id: 'mobile-app',
      title: 'Mobile App & PWA',
      icon: 'Smartphone',
      content: {
        description: 'VARUNA offers Progressive Web App (PWA) functionality for mobile devices:',
        items: [
          {
            category: 'Installing PWA',
            details: [
              'Visit VARUNA in mobile browser',
              'Tap "Add to Home Screen" when prompted',
              'Or use browser menu → "Install App"',
              'Icon will appear on home screen',
              'Works offline for basic functions'
            ]
          },
          {
            category: 'PWA Features',
            details: [
              'Offline map caching',
              'Push notifications for alerts',
              'Camera integration for reports',
              'GPS location services',
              'Background sync when online'
            ]
          },
          {
            category: 'Native App (Coming Soon)',
            details: [
              'Android app in development',
              'iOS app planned for 2025',
              'Enhanced offline capabilities',
              'Better performance optimization',
              'Advanced notification features'
            ]
          }
        ]
      }
    },
    {
      id: 'performance',
      title: 'Performance Optimization',
      icon: 'Zap',
      content: {
        description: 'Tips to improve VARUNA performance on your device:',
        items: [
          {
            category: 'Browser Optimization',
            details: [
              'Keep browser updated to latest version',
              'Close unnecessary tabs and applications',
              'Clear cache regularly (weekly recommended)',
              'Disable unused browser extensions',
              'Restart browser if performance degrades'
            ]
          },
          {
            category: 'Network Optimization',
            details: [
              'Use stable WiFi connection when possible',
              'Avoid peak usage hours for better speed',
              'Enable data compression in mobile browsers',
              'Close background apps consuming bandwidth',
              'Switch to mobile data if WiFi is slow'
            ]
          },
          {
            category: 'Device Settings',
            details: [
              'Free up device storage space',
              'Close background applications',
              'Enable hardware acceleration in browser',
              'Update device operating system',
              'Restart device if experiencing issues'
            ]
          }
        ]
      }
    },
    {
      id: 'data-usage',
      title: 'Data Usage & Offline Features',
      icon: 'Database',
      content: {
        description: 'Understanding data consumption and offline capabilities:',
        items: [
          {
            category: 'Data Consumption',
            details: [
              'Map tiles: ~2-5MB per session',
              'Photo uploads: Varies by file size',
              'Real-time updates: ~100KB per hour',
              'Initial page load: ~1-2MB',
              'Background sync: ~50KB per update'
            ]
          },
          {
            category: 'Offline Features',
            details: [
              'View previously loaded maps',
              'Access cached hazard reports',
              'Draft reports saved locally',
              'Basic navigation available',
              'Sync when connection restored'
            ]
          },
          {
            category: 'Data Saving Tips',
            details: [
              'Enable data saver mode in browser',
              'Download maps for offline use',
              'Compress photos before uploading',
              'Use WiFi for large file uploads',
              'Limit background refresh frequency'
            ]
          }
        ]
      }
    }
  ];

  const systemRequirements = {
    minimum: {
      ram: '2GB RAM',
      storage: '100MB free space',
      network: '2G/3G connection',
      screen: '320px minimum width'
    },
    recommended: {
      ram: '4GB+ RAM',
      storage: '500MB free space',
      network: '4G/WiFi connection',
      screen: '768px+ width'
    }
  };

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded?.has(itemId)) {
      newExpanded?.delete(itemId);
    } else {
      newExpanded?.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <section className="bg-card rounded-lg p-6 lg:p-8 shadow-ocean">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center justify-center">
            <Icon name="Settings" size={32} className="text-primary mr-3" />
            Technical Support
          </h2>
          <p className="text-muted-foreground">
            Technical resources, troubleshooting guides, and system requirements
          </p>
        </div>

        {/* System Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="HardDrive" size={20} className="text-warning mr-2" />
              Minimum Requirements
            </h3>
            <div className="space-y-3">
              {Object.entries(systemRequirements?.minimum)?.map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-muted-foreground capitalize">{key}:</span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Zap" size={20} className="text-success mr-2" />
              Recommended Specs
            </h3>
            <div className="space-y-3">
              {Object.entries(systemRequirements?.recommended)?.map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-muted-foreground capitalize">{key}:</span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Resources */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            Technical Resources
          </h3>
          
          {technicalResources?.map((resource) => {
            const isExpanded = expandedItems?.has(resource?.id);
            
            return (
              <div key={resource?.id} className="bg-surface rounded-lg overflow-hidden">
                {/* Resource Header */}
                <button
                  onClick={() => toggleExpanded(resource?.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors duration-150 focus-ocean"
                >
                  <div className="flex items-center space-x-3">
                    <Icon name={resource?.icon} size={24} className="text-primary" />
                    <span className="text-lg font-semibold text-foreground">
                      {resource?.title}
                    </span>
                  </div>
                  <Icon 
                    name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                    size={20} 
                    className="text-muted-foreground transition-transform duration-200"
                  />
                </button>
                {/* Resource Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-border/50">
                    <div className="pt-4 space-y-6">
                      <p className="text-muted-foreground">
                        {resource?.content?.description}
                      </p>
                      
                      {resource?.content?.items?.map((item, index) => (
                        <div key={index} className="space-y-3">
                          <h4 className="font-semibold text-foreground flex items-center">
                            <Icon name="ChevronRight" size={16} className="text-primary mr-2" />
                            {item?.category}
                          </h4>
                          <ul className="space-y-2 ml-6">
                            {item?.details?.map((detail, detailIndex) => (
                              <li key={detailIndex} className="text-sm text-muted-foreground flex items-start">
                                <Icon name="Check" size={14} className="text-success mr-2 mt-0.5 flex-shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Help Links */}
        <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="LifeBuoy" size={20} className="text-primary mr-2" />
            Quick Help
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a 
              href="mailto:tech@varuna.gov.in"
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-150"
            >
              <Icon name="Mail" size={16} />
              <span>Technical Support</span>
            </a>
            <a 
              href="tel:+911800123456"
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-150"
            >
              <Icon name="Phone" size={16} />
              <span>Emergency Hotline</span>
            </a>
            <button 
              onClick={() => {
                document.querySelector('[data-section="faq"]')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-150"
            >
              <Icon name="HelpCircle" size={16} />
              <span>View FAQ</span>
            </button>
          </div>
        </div>

        {/* Status Page Link */}
        <div className="text-center">
          <p className="text-muted-foreground mb-2">
            Check platform status and scheduled maintenance
          </p>
          <a 
            href="https://status.varuna.gov.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-150"
          >
            <Icon name="Activity" size={16} />
            <span>System Status Page</span>
            <Icon name="ExternalLink" size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default TechnicalSupportSection;