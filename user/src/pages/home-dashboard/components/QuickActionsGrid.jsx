import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActionsGrid = () => {
  const quickActions = [
    {
      id: 1,
      title: "Report Hazard",
      description: "Submit coastal hazard reports for community safety",
      icon: "AlertTriangle",
      path: "/hazard-reporting-form",
      color: "bg-error",
      hoverColor: "hover:bg-error/90"
    },
    {
      id: 2,
      title: "View My Alerts",
      description: "Check your personalized hazard notifications",
      icon: "Bell",
      path: "/my-alerts-dashboard",
      color: "bg-warning",
      hoverColor: "hover:bg-warning/90"
    },
    {
      id: 3,
      title: "Explore Risk Zones",
      description: "Interactive map with real-time coastal data",
      icon: "Map",
      path: "/interactive-risk-map",
      color: "bg-primary",
      hoverColor: "hover:bg-primary/90"
    },
    {
      id: 4,
      title: "About VARUNA",
      description: "Learn about our platform and get help",
      icon: "Info",
      path: "/about-help-center",
      color: "bg-secondary",
      hoverColor: "hover:bg-secondary/90"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Quick Actions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access essential coastal safety features with one click
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions?.map((action) => (
            <Link
              key={action?.id}
              to={action?.path}
              className="group block"
            >
              <div className={`${action?.color} ${action?.hoverColor} rounded-xl p-6 text-white transition-all duration-300 transform group-hover:scale-105 shadow-ocean group-hover:shadow-ocean-lg touch-target`}>
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4 mx-auto">
                  <Icon 
                    name={action?.icon} 
                    size={24} 
                    className="text-white"
                  />
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">
                  {action?.title}
                </h3>
                <p className="text-sm text-white/90 text-center leading-relaxed">
                  {action?.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActionsGrid;