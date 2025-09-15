import React from 'react';
import Icon from '../../../components/AppIcon';

const AboutSection = () => {
  const features = [
    {
      id: 1,
      icon: "Users",
      title: "Citizen Reporting",
      description: "Empower coastal communities to report hazards and contribute to collective safety intelligence."
    },
    {
      id: 2,
      icon: "Satellite",
      title: "INCOIS Collaboration",
      description: "Official partnership with Indian National Centre for Ocean Information Services for validated data."
    },
    {
      id: 3,
      icon: "Shield",
      title: "Real-time Alerts",
      description: "Instant notifications about coastal hazards, weather conditions, and safety advisories."
    },
    {
      id: 4,
      icon: "MapPin",
      title: "Location Intelligence",
      description: "GPS-based hazard mapping with precise location data for targeted safety measures."
    }
  ];

  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            About VARUNA
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            VARUNA is a comprehensive ocean hazard monitoring platform that bridges the gap between 
            citizen observations and official maritime safety intelligence, creating a robust early 
            warning system for coastal communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features?.map((feature) => (
            <div key={feature?.id} className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 mx-auto group-hover:bg-primary/20 transition-colors duration-300">
                <Icon 
                  name={feature?.icon} 
                  size={28} 
                  className="text-primary"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature?.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature?.description}
              </p>
            </div>
          ))}
        </div>

        {/* Partnership Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-3 bg-primary/10 px-6 py-3 rounded-full">
            <Icon name="Award" size={20} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              Official Partner: Indian National Centre for Ocean Information Services (INCOIS)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;