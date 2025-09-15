import React from 'react';
import Icon from '../../../components/AppIcon';

const AlertStats = ({ stats, className = '' }) => {
  const statItems = [
    {
      label: 'Total Alerts',
      value: stats?.total,
      icon: 'Bell',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'High Priority',
      value: stats?.highPriority,
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      label: 'Verified',
      value: stats?.verified,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Pending',
      value: stats?.pending,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'My Reports',
      value: stats?.myReports,
      icon: 'User',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      label: 'This Week',
      value: stats?.thisWeek,
      icon: 'Calendar',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
      {statItems?.map((item, index) => (
        <div
          key={index}
          className="bg-card rounded-lg p-4 border border-border shadow-ocean hover:shadow-ocean-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${item?.bgColor}`}>
              <Icon name={item?.icon} size={20} className={item?.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{item?.value}</p>
              <p className="text-sm text-muted-foreground">{item?.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertStats;