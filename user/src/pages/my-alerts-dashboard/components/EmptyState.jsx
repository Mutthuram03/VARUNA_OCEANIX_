import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ 
  type = 'no-alerts', 
  hasFilters = false,
  onClearFilters = () => {},
  className = '' 
}) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'no-alerts':
        return {
          icon: 'Bell',
          title: 'No Alerts Yet',
          description: `You haven't received any hazard alerts yet. This is good news! When hazards are reported in your area, they'll appear here.`,
          actions: (
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/hazard-reporting-form">
                <Button variant="default" iconName="Plus" iconSize={16}>
                  Report a Hazard
                </Button>
              </Link>
              <Link to="/interactive-risk-map">
                <Button variant="outline" iconName="Map" iconSize={16}>
                  View Risk Map
                </Button>
              </Link>
            </div>
          )
        };
      
      case 'no-results':
        return {
          icon: 'Search',
          title: 'No Matching Alerts',
          description: 'No alerts match your current filter criteria. Try adjusting your filters to see more results.',
          actions: (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="default" 
                onClick={onClearFilters}
                iconName="RefreshCw" 
                iconSize={16}
              >
                Clear All Filters
              </Button>
              <Link to="/hazard-reporting-form">
                <Button variant="outline" iconName="Plus" iconSize={16}>
                  Report New Hazard
                </Button>
              </Link>
            </div>
          )
        };
      
      case 'loading-error':
        return {
          icon: 'AlertCircle',
          title: 'Unable to Load Alerts',
          description: 'There was a problem loading your alerts. Please check your connection and try again.',
          actions: (
            <Button 
              variant="default" 
              onClick={() => window.location?.reload()}
              iconName="RefreshCw" 
              iconSize={16}
            >
              Retry Loading
            </Button>
          )
        };
      
      default:
        return {
          icon: 'Bell',
          title: 'No Alerts',
          description: 'No alerts to display at this time.',
          actions: null
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <Icon name={content?.icon} size={48} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">
        {content?.title}
      </h3>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        {content?.description}
      </p>
      {content?.actions && (
        <div className="flex flex-col sm:flex-row gap-3">
          {content?.actions}
        </div>
      )}
      {/* Additional Help Text */}
      <div className="mt-8 pt-8 border-t border-border max-w-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">
          About Alert Notifications
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          VARUNA monitors coastal hazards in your area and sends alerts when risks are detected. 
          You'll receive notifications for high-priority situations that may affect your safety.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;