import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'Government Verified',
      description: 'Official INCOIS collaboration'
    },
    {
      icon: 'Lock',
      title: 'Secure Platform',
      description: 'End-to-end encryption'
    },
    {
      icon: 'Users',
      title: 'Community Driven',
      description: '10,000+ active reporters'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-2">Trusted by Coastal Communities</h3>
        <p className="text-xs text-muted-foreground">
          In partnership with Indian National Centre for Ocean Information Services (INCOIS)
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trustBadges?.map((badge, index) => (
          <div key={index} className="text-center p-3 rounded-lg bg-muted/50">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Icon name={badge?.icon} size={20} className="text-primary" />
              </div>
            </div>
            <h4 className="text-xs font-semibold text-foreground mb-1">{badge?.title}</h4>
            <p className="text-xs text-muted-foreground">{badge?.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Award" size={14} />
            <span>Smart India Hackathon 2025</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Building" size={14} />
            <span>Team Oceanix</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;