import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const EmergencyAlertBanner = ({ 
  alerts = [], 
  onDismiss = () => {},
  className = '' 
}) => {
  const [visibleAlerts, setVisibleAlerts] = useState([]);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  // Filter and sort alerts by severity
  useEffect(() => {
    const activeAlerts = alerts?.filter(alert => alert?.active && !alert?.dismissed)?.sort((a, b) => {
        const severityOrder = { 'critical': 3, 'high': 2, 'medium': 1, 'low': 0 };
        return (severityOrder?.[b?.severity] || 0) - (severityOrder?.[a?.severity] || 0);
      });
    
    setVisibleAlerts(activeAlerts);
    setCurrentAlertIndex(0);
  }, [alerts]);

  // Auto-rotate through multiple alerts
  useEffect(() => {
    if (visibleAlerts?.length > 1) {
      const interval = setInterval(() => {
        setCurrentAlertIndex((prev) => (prev + 1) % visibleAlerts?.length);
      }, 8000); // 8 seconds per alert

      return () => clearInterval(interval);
    }
  }, [visibleAlerts?.length]);

  // Handle alert dismissal
  const handleDismiss = (alertId) => {
    onDismiss(alertId);
    setVisibleAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (visibleAlerts?.length > 1) {
        if (e?.key === 'ArrowLeft') {
          e?.preventDefault();
          setCurrentAlertIndex(prev => 
            prev === 0 ? visibleAlerts?.length - 1 : prev - 1
          );
        } else if (e?.key === 'ArrowRight') {
          e?.preventDefault();
          setCurrentAlertIndex(prev => (prev + 1) % visibleAlerts?.length);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visibleAlerts?.length]);

  if (visibleAlerts?.length === 0) return null;

  const currentAlert = visibleAlerts?.[currentAlertIndex];
  
  // Determine alert styling based on severity
  const getAlertStyles = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          container: 'bg-error text-error-foreground border-l-4 border-error',
          icon: 'AlertTriangle',
          iconColor: 'text-error-foreground',
          pulse: true
        };
      case 'high':
        return {
          container: 'bg-warning text-warning-foreground border-l-4 border-warning',
          icon: 'AlertCircle',
          iconColor: 'text-warning-foreground',
          pulse: false
        };
      case 'medium':
        return {
          container: 'bg-accent text-accent-foreground border-l-4 border-accent',
          icon: 'Info',
          iconColor: 'text-accent-foreground',
          pulse: false
        };
      default:
        return {
          container: 'bg-primary text-primary-foreground border-l-4 border-primary',
          icon: 'Info',
          iconColor: 'text-primary-foreground',
          pulse: false
        };
    }
  };

  const alertStyles = getAlertStyles(currentAlert?.severity);

  return (
    <div className={`fixed top-16 left-0 right-0 z-200 ${className}`}>
      <div className={`${alertStyles?.container} shadow-ocean-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {/* Alert Icon */}
              <div className={`flex-shrink-0 ${alertStyles?.pulse ? 'animate-pulse' : ''}`}>
                <Icon 
                  name={alertStyles?.icon} 
                  size={24} 
                  className={alertStyles?.iconColor}
                />
              </div>

              {/* Alert Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    {currentAlert?.severity} Alert
                  </span>
                  {currentAlert?.location && (
                    <>
                      <span className="text-sm opacity-75">•</span>
                      <span className="text-sm opacity-90">{currentAlert?.location}</span>
                    </>
                  )}
                </div>
                <p className="text-sm font-medium truncate sm:text-base">
                  {currentAlert?.message}
                </p>
                {currentAlert?.timestamp && (
                  <p className="text-xs opacity-75 mt-1 font-mono">
                    {new Date(currentAlert.timestamp)?.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                {currentAlert?.actionUrl && (
                  <Link to={currentAlert?.actionUrl}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      View Details
                    </Button>
                  </Link>
                )}

                {currentAlert?.mapLocation && (
                  <Link to={`/interactive-risk-map?location=${encodeURIComponent(currentAlert?.mapLocation)}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Map"
                      iconSize={16}
                      className="whitespace-nowrap"
                    >
                      View Map
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Alert Navigation & Dismiss */}
            <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
              {/* Multi-alert navigation */}
              {visibleAlerts?.length > 1 && (
                <div className="hidden sm:flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentAlertIndex(prev => 
                      prev === 0 ? visibleAlerts?.length - 1 : prev - 1
                    )}
                    className="p-1"
                    aria-label="Previous alert"
                  >
                    <Icon name="ChevronLeft" size={16} />
                  </Button>
                  
                  <span className="text-xs font-mono px-2">
                    {currentAlertIndex + 1} / {visibleAlerts?.length}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentAlertIndex(prev => 
                      (prev + 1) % visibleAlerts?.length
                    )}
                    className="p-1"
                    aria-label="Next alert"
                  >
                    <Icon name="ChevronRight" size={16} />
                  </Button>
                </div>
              )}

              {/* Dismiss Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss(currentAlert?.id)}
                className="p-1"
                aria-label="Dismiss alert"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>

          {/* Progress indicator for multiple alerts */}
          {visibleAlerts?.length > 1 && (
            <div className="flex space-x-1 pb-2">
              {visibleAlerts?.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-opacity duration-300 ${
                    index === currentAlertIndex ? 'opacity-100' : 'opacity-30'
                  }`}
                  style={{ backgroundColor: 'currentColor' }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlertBanner;