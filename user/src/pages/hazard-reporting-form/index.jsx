import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { HazardReportService, AlertService, FileUploadService } from '../../services/firebase.js';

// Import form components
import HazardTypeSelector from './components/HazardTypeSelector';
import MediaUpload from './components/MediaUpload';
import LocationSelector from './components/LocationSelector';
import HazardDescription from './components/HazardDescription';
import SubmissionSuccess from './components/SubmissionSuccess';

const HazardReportingForm = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    hazardType: '',
    description: '',
    location: null,
    mediaFiles: []
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');

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

  // Language change handler
  useEffect(() => {
    const savedLanguage = localStorage.getItem('varuna-language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
setCurrentLanguage(event?.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData?.hazardType) {
      newErrors.hazardType = 'Please select a hazard type';
    }

    if (!formData?.location) {
      newErrors.location = 'Location is required for hazard reporting';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorElement = document.querySelector('[data-error="true"]');
      if (firstErrorElement) {
        firstErrorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload media files first
      let mediaUrls = [];
      if (formData.mediaFiles && formData.mediaFiles.length > 0) {
        for (const file of formData.mediaFiles) {
          const filePath = `hazard_reports/${Date.now()}-${file.name}`;
          const uploadResult = await FileUploadService.uploadFile(file, filePath);
          if (uploadResult.success) {
            mediaUrls.push(uploadResult.downloadURL);
          } else {
            console.error('Failed to upload file:', file.name, uploadResult.error);
          }
        }
      }

      // Prepare report data with proper validation
      const reportData = {
        hazardType: formData.hazardType,
        description: formData.description || '',
        location: formData.location ? {
          latitude: formData.location.latitude || 0,
          longitude: formData.location.longitude || 0,
          address: formData.location.address || 'Unknown location'
        } : {
          latitude: 0,
          longitude: 0,
          address: 'Unknown location'
        },
        mediaUrls: mediaUrls,
        severity: 'medium', // Default severity
        status: 'pending',
        reporterInfo: {
          name: 'Anonymous',
          contact: '',
          isAnonymous: true
        }
      };

      // Submit to Firebase
      const result = await HazardReportService.createReport(reportData);
      
      if (result.success) {
        setSubmittedReportId(result.id);
        setShowSuccess(true);
        
        // Reset form
        setFormData({
          hazardType: '',
          description: '',
          location: null,
          mediaFiles: []
        });
        setErrors({});
      } else {
        throw new Error(result.error);
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to submit report. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle new report
  const handleNewReport = () => {
    setShowSuccess(false);
    setSubmittedReportId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle alert dismissal
  const handleAlertDismiss = (alertId) => {
    // In real app, this would update the alerts state
    console.log('Dismissed alert:', alertId);
  };

  // Handle authentication actions
  const handleAuthAction = (action) => {
    if (action === 'login') {
      navigate('/login-registration');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        isAuthenticated={false}
        onAuthAction={handleAuthAction}
      />
      {/* Emergency Alert Banner */}
      <EmergencyAlertBanner 
        alerts={emergencyAlerts}
        onDismiss={handleAlertDismiss}
      />
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6" />

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-lg">
              <Icon name="AlertTriangle" size={24} className="text-warning" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Report Coastal Hazard
              </h1>
              <p className="text-muted-foreground mt-1">
                Help protect your community by reporting ocean and coastal hazards
              </p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-error/5 border border-error/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-error mb-1">
                  Emergency Situations
                </h3>
                <p className="text-xs text-error/80">
                  For immediate life-threatening emergencies, call 108 (Emergency Services) or 1093 (Coast Guard). 
                  This form is for non-emergency hazard reporting to INCOIS.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card border border-border rounded-lg shadow-ocean p-6">
            {/* Hazard Type Selection */}
            <HazardTypeSelector
              value={formData?.hazardType}
              onChange={(value) => setFormData(prev => ({ ...prev, hazardType: value }))}
              error={errors?.hazardType}
              className="mb-8"
            />

            {/* Location Selection */}
            <LocationSelector
              location={formData?.location}
              onLocationChange={(location) => setFormData(prev => ({ ...prev, location }))}
              error={errors?.location}
              className="mb-8"
            />

            {/* Media Upload */}
            <MediaUpload
              files={formData?.mediaFiles}
              onFilesChange={(files) => setFormData(prev => ({ ...prev, mediaFiles: files }))}
              className="mb-8"
            />

            {/* Description */}
            <HazardDescription
              value={formData?.description}
              onChange={(description) => setFormData(prev => ({ ...prev, description }))}
              error={errors?.description}
              className="mb-8"
            />

            {/* Submission Error */}
            {errors?.submit && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-error" />
                  <span className="text-sm text-error">{errors?.submit}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
              <Button
                type="submit"
                variant="default"
                size="lg"
                loading={isSubmitting}
                iconName="Send"
                iconPosition="left"
                className="flex-1"
              >
                {isSubmitting ? 'Submitting Report...' : 'Submit Hazard Report'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate('/home-dashboard')}
                iconName="ArrowLeft"
                iconPosition="left"
                className="sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reporting Guidelines */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Icon name="BookOpen" size={20} className="text-primary" />
              <span>Reporting Guidelines</span>
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start space-x-2">
                <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                <span>Report hazards as soon as safely possible</span>
              </li>
              <li className="flex items-start space-x-2">
                <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                <span>Include photos/videos if available</span>
              </li>
              <li className="flex items-start space-x-2">
                <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                <span>Provide accurate location information</span>
              </li>
              <li className="flex items-start space-x-2">
                <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                <span>Describe the hazard clearly and concisely</span>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Icon name="Phone" size={20} className="text-secondary" />
              <span>Emergency Contacts</span>
            </h3>
            <div className="text-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Emergency Services:</span>
                <span className="font-mono text-foreground">108</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Coast Guard:</span>
                <span className="font-mono text-foreground">1093</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">INCOIS Helpline:</span>
                <span className="font-mono text-foreground">040-23886047</span>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  For technical support with this platform, visit our help center.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Success Modal */}
      {showSuccess && (
        <SubmissionSuccess
          reportId={submittedReportId}
          onNewReport={handleNewReport}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default HazardReportingForm;