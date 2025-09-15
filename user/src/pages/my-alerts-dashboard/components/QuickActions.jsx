import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ className = '' }) => {
  const actions = [
    {
      title: 'Report New Hazard',
      description: 'Submit a new coastal hazard report',
      icon: 'Plus',
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
      path: '/hazard-reporting-form',
      variant: 'default'
    },
    {
      title: 'View Risk Map',
      description: 'Explore interactive hazard map',
      icon: 'Map',
      iconColor: 'text-secondary',
      bgColor: 'bg-secondary/10',
      path: '/interactive-risk-map',
      variant: 'outline'
    },
    {
      title: 'Emergency Contacts',
      description: 'Access emergency services',
      icon: 'Phone',
      iconColor: 'text-error',
      bgColor: 'bg-error/10',
      path: '/about-help-center',
      variant: 'outline'
    }
  ];

  return (
    <div className={`bg-card rounded-lg shadow-ocean border border-border p-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Zap" size={20} className="text-accent" />
        <h3 className="font-semibold text-foreground">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions?.map((action, index) => (
          <Link key={index} to={action?.path} className="block">
            <div className="group p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-ocean">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${action?.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon name={action?.icon} size={20} className={action?.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                    {action?.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action?.description}
                  </p>
                </div>
                <Icon 
                  name="ArrowRight" 
                  size={16} 
                  className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" 
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* Emergency Banner */}
      <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="AlertTriangle" size={16} className="text-error" />
          <span className="text-sm font-medium text-error">Emergency Situation?</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          For immediate emergencies, call local authorities or coast guard directly.
        </p>
        <div className="flex items-center space-x-2 mt-3">
          <Button variant="destructive" size="sm" iconName="Phone" iconSize={14}>
            Emergency: 108
          </Button>
          <Button variant="outline" size="sm" iconName="Radio" iconSize={14}>
            Coast Guard: 1554
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;