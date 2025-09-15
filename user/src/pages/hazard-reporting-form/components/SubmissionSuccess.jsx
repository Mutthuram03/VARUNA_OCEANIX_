import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubmissionSuccess = ({ 
  reportId, 
  onNewReport, 
  onClose,
  className = '' 
}) => {
  const currentTime = new Date()?.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${className}`}>
      <div className="bg-card border border-border rounded-lg shadow-ocean-xl max-w-md w-full p-6">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Report Submitted Successfully!
          </h2>
          <p className="text-sm text-muted-foreground">
            Your hazard report has been received and will be reviewed by INCOIS experts.
          </p>
        </div>

        {/* Report Details */}
        <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Report ID:</span>
              <span className="text-sm font-mono text-foreground">{reportId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Submitted:</span>
              <span className="text-sm font-mono text-foreground">{currentTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                <span className="text-sm text-warning">Under Review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-primary" />
            <span>What happens next?</span>
          </h3>
          <ul className="text-xs text-muted-foreground space-y-2">
            <li className="flex items-start space-x-2">
              <Icon name="ArrowRight" size={12} className="mt-0.5 flex-shrink-0" />
              <span>INCOIS experts will review your report within 2-4 hours</span>
            </li>
            <li className="flex items-start space-x-2">
              <Icon name="ArrowRight" size={12} className="mt-0.5 flex-shrink-0" />
              <span>If verified, alerts will be issued to nearby areas</span>
            </li>
            <li className="flex items-start space-x-2">
              <Icon name="ArrowRight" size={12} className="mt-0.5 flex-shrink-0" />
              <span>You'll receive updates on your report status</span>
            </li>
          </ul>
        </div>

        {/* Login Suggestion */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Icon name="User" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">
                Track Your Reports
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Create an account to track your submitted reports and receive personalized alerts.
              </p>
              <Link to="/login-registration">
                <Button variant="outline" size="sm" className="text-xs">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="default"
            onClick={onNewReport}
            iconName="Plus"
            iconPosition="left"
            className="flex-1"
          >
            Report Another Hazard
          </Button>
          
          <Link to="/my-alerts-dashboard" className="flex-1">
            <Button variant="outline" fullWidth>
              View Alerts
            </Button>
          </Link>
        </div>

        {/* Close Button */}
        <div className="mt-4 text-center">
          <Link to="/home-dashboard">
            <Button variant="ghost" size="sm">
              Return to Dashboard
            </Button>
          </Link>
        </div>

        {/* Close X Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 p-2"
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default SubmissionSuccess;