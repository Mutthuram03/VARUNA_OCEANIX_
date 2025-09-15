import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrustSecuritySection = () => {
  const securityFeatures = [
    {
      icon: "Shield",
      title: "Data Encryption",
      description: "End-to-end encryption for all data transmission and storage",
      details: "256-bit SSL/TLS encryption protects your personal information and reports"
    },
    {
      icon: "Lock",
      title: "Secure Authentication",
      description: "Multi-factor authentication and secure login protocols",
      details: "Optional 2FA and secure password requirements ensure account safety"
    },
    {
      icon: "Eye",
      title: "Privacy Protection",
      description: "Location data anonymization and privacy-first design",
      details: "Personal locations are anonymized in public maps while maintaining accuracy"
    },
    {
      icon: "Server",
      title: "Secure Infrastructure",
      description: "Government-grade security infrastructure and monitoring",
      details: "Hosted on secure government servers with 24/7 monitoring and backup"
    }
  ];

  const partnerships = [
    {
      name: "INCOIS",
      fullName: "Indian National Centre for Ocean Information Services",
      logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop",
      description: "Official partnership for scientific validation and data integration",
      website: "https://incois.gov.in",
      role: "Scientific Validation Partner"
    },
    {
      name: "Ministry of Earth Sciences",
      fullName: "Government of India",
      logo: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?w=100&h=100&fit=crop",
      description: "Government backing and regulatory compliance oversight",
      website: "https://moes.gov.in",
      role: "Regulatory Authority"
    },
    {
      name: "Smart India Hackathon",
      fullName: "Innovation Initiative",
      logo: "https://images.pixabay.com/photo/2016/12/30/10/03/map-1940220_1280.jpg?w=100&h=100&fit=crop",
      description: "Platform developed under national innovation program",
      website: "https://sih.gov.in",
      role: "Innovation Platform"
    }
  ];

  const certifications = [
    {
      name: "ISO 27001",
      description: "Information Security Management",
      icon: "Award",
      status: "Certified"
    },
    {
      name: "GDPR Compliant",
      description: "Data Protection Regulation",
      icon: "Shield",
      status: "Compliant"
    },
    {
      name: "Government Standards",
      description: "Indian Government IT Standards",
      icon: "CheckCircle",
      status: "Approved"
    },
    {
      name: "Security Audit",
      description: "Annual Third-party Security Audit",
      icon: "Search",
      status: "Passed"
    }
  ];

  const reliabilityStats = [
    {
      metric: "Uptime",
      value: "99.9%",
      description: "Platform availability",
      icon: "Activity"
    },
    {
      metric: "Response Time",
      value: "<2s",
      description: "Average page load",
      icon: "Zap"
    },
    {
      metric: "Data Accuracy",
      value: "98.5%",
      description: "Validated reports",
      icon: "Target"
    },
    {
      metric: "User Trust",
      value: "4.8/5",
      description: "User satisfaction",
      icon: "Star"
    }
  ];

  return (
    <section className="bg-card rounded-lg p-6 lg:p-8 shadow-ocean">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center justify-center">
            <Icon name="Shield" size={32} className="text-primary mr-3" />
            Trust & Security
          </h2>
          <p className="text-muted-foreground">
            Your safety and privacy are our top priorities
          </p>
        </div>

        {/* Security Features */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Security Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityFeatures?.map((feature, index) => (
              <div key={index} className="bg-surface rounded-lg p-6 hover:shadow-ocean-lg transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon name={feature?.icon} size={24} className="text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      {feature?.title}
                    </h4>
                    <p className="text-muted-foreground mb-3">
                      {feature?.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {feature?.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Government Partnerships */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Government Partnerships
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {partnerships?.map((partner, index) => (
              <div key={index} className="bg-surface rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <Image 
                    src={partner?.logo}
                    alt={`${partner?.name} logo`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-1">
                  {partner?.name}
                </h4>
                <p className="text-sm text-primary mb-2">
                  {partner?.role}
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  {partner?.description}
                </p>
                <a 
                  href={partner?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-primary hover:text-primary/80 text-sm transition-colors duration-150"
                >
                  <span>Visit Website</span>
                  <Icon name="ExternalLink" size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Certifications & Compliance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications?.map((cert, index) => (
              <div key={index} className="bg-surface rounded-lg p-4 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Icon name={cert?.icon} size={24} className="text-success" />
                  </div>
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  {cert?.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {cert?.description}
                </p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-success/10 text-success">
                  <Icon name="Check" size={12} className="mr-1" />
                  {cert?.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reliability Statistics */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Platform Reliability
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {reliabilityStats?.map((stat, index) => (
              <div key={index} className="bg-surface rounded-lg p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Icon name={stat?.icon} size={24} className="text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat?.value}
                </div>
                <div className="text-sm font-medium text-foreground mb-1">
                  {stat?.metric}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat?.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Protection Notice */}
        <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={24} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Data Protection Commitment
              </h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  VARUNA is committed to protecting your personal information and privacy. 
                  We collect only necessary data for platform functionality and never share 
                  personal information with unauthorized third parties.
                </p>
                <p>
                  All hazard reports are anonymized for public display while maintaining 
                  scientific accuracy. Your location data is encrypted and used only for 
                  alert delivery and hazard mapping purposes.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-3">
                  <a 
                    href="/privacy-policy" 
                    className="text-primary hover:text-primary/80 transition-colors duration-150"
                  >
                    Privacy Policy
                  </a>
                  <span className="hidden sm:block text-muted-foreground">•</span>
                  <a 
                    href="/terms-of-service" 
                    className="text-primary hover:text-primary/80 transition-colors duration-150"
                  >
                    Terms of Service
                  </a>
                  <span className="hidden sm:block text-muted-foreground">•</span>
                  <a 
                    href="/data-policy" 
                    className="text-primary hover:text-primary/80 transition-colors duration-150"
                  >
                    Data Usage Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Contact */}
        <div className="text-center">
          <p className="text-muted-foreground mb-2">
            Report security vulnerabilities or concerns
          </p>
          <a 
            href="mailto:security@varuna.gov.in"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-150"
          >
            <Icon name="Shield" size={16} />
            <span>security@varuna.gov.in</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TrustSecuritySection;