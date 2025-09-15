import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PlatformInfoSection = () => {
  const platformFeatures = [
    {
      icon: "Shield",
      title: "Real-time Monitoring",
      description: "24/7 coastal hazard surveillance with instant alert systems"
    },
    {
      icon: "Users",
      title: "Citizen Reporting",
      description: "Empowering communities to report and share hazard information"
    },
    {
      icon: "MapPin",
      title: "Location Intelligence",
      description: "GPS-enabled precise hazard mapping and risk zone identification"
    },
    {
      icon: "Zap",
      title: "Instant Alerts",
      description: "Immediate notifications for critical coastal safety situations"
    }
  ];

  const collaborationStats = [
    { label: "Active Users", value: "15,000+", icon: "Users" },
    { label: "Reports Processed", value: "45,000+", icon: "FileText" },
    { label: "Coastal Areas Covered", value: "2,500+ km", icon: "Map" },
    { label: "Response Time", value: "<5 min", icon: "Clock" }
  ];

  return (
    <section className="bg-card rounded-lg p-6 lg:p-8 shadow-ocean">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-4xl animate-wave">🌊</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary">VARUNA Platform</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Vigilant Alerting for Real-time Underwater & Nearshore Anomalies
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-surface rounded-lg p-6 border-l-4 border-primary">
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Target" size={24} className="text-primary mr-2" />
            Our Mission
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            VARUNA empowers citizens and INCOIS with real-time coastal hazard intelligence, creating a comprehensive early warning system for underwater and nearshore anomalies. Our platform bridges the gap between community observations and scientific monitoring to enhance coastal safety across India.
          </p>
        </div>

        {/* Platform Features */}
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Platform Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures?.map((feature, index) => (
              <div key={index} className="bg-surface rounded-lg p-6 text-center hover:shadow-ocean-lg transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Icon name={feature?.icon} size={32} className="text-primary" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {feature?.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {feature?.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* INCOIS Collaboration */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <Icon name="Building" size={28} className="text-primary mr-3" />
                INCOIS Partnership
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  In collaboration with the Indian National Centre for Ocean Information Services (INCOIS), 
                  VARUNA integrates citizen science with professional oceanographic monitoring.
                </p>
                <p>
                  This partnership ensures data validation, scientific accuracy, and seamless integration 
                  with national coastal monitoring systems.
                </p>
                <div className="flex items-center space-x-2 text-primary font-medium">
                  <Icon name="CheckCircle" size={20} />
                  <span>Government Validated Platform</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-card rounded-lg p-6 shadow-ocean">
                <Image 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
                  alt="INCOIS Collaboration - Ocean monitoring facility"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <p className="text-sm text-center text-muted-foreground">
                  Advanced ocean monitoring technology
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Platform Impact
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {collaborationStats?.map((stat, index) => (
              <div key={index} className="bg-surface rounded-lg p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Icon name={stat?.icon} size={24} className="text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat?.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat?.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart India Hackathon */}
        <div className="bg-accent/10 rounded-lg p-6 border border-accent/20">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Icon name="Trophy" size={24} className="text-accent" />
              <h3 className="text-xl font-semibold text-foreground">
                Smart India Hackathon 2025
              </h3>
            </div>
            <p className="text-muted-foreground">
              Developed as part of Smart India Hackathon 2025, addressing critical coastal safety challenges 
              through innovative technology solutions and community engagement.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="flex items-center space-x-1 text-accent">
                <Icon name="Calendar" size={16} />
                <span>December 2024</span>
              </span>
              <span className="flex items-center space-x-1 text-accent">
                <Icon name="Award" size={16} />
                <span>Innovation Category</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformInfoSection;