import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Link } from 'react-router-dom';

const HowItWorksSection = () => {
  const steps = [
    {
      id: 1,
      step: "01",
      icon: "Camera",
      title: "Report & Document",
      description: "Citizens spot coastal hazards and submit reports with photos, location, and description through our easy-to-use mobile interface.",
      features: ["GPS auto-detection", "Photo/video upload", "Hazard categorization"],
      color: "bg-error/10 text-error"
    },
    {
      id: 2,
      step: "02", 
      icon: "Search",
      title: "Verify & Analyze",
      description: "INCOIS experts validate citizen reports using satellite data, weather models, and field verification for accuracy and severity assessment.",
      features: ["Expert validation", "Satellite verification", "Risk assessment"],
      color: "bg-warning/10 text-warning"
    },
    {
      id: 3,
      step: "03",
      icon: "Bell",
      title: "Alert & Protect",
      description: "Verified hazards trigger real-time alerts to affected communities, enabling proactive safety measures and emergency response coordination.",
      features: ["Real-time notifications", "Community alerts", "Emergency coordination"],
      color: "bg-success/10 text-success"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A simple three-step process that transforms citizen observations into 
            life-saving coastal safety intelligence.
          </p>
        </div>

        <div className="relative">
          {/* Connection Lines - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps?.map((step, index) => (
              <div key={step?.id} className="relative">
                {/* Step Card */}
                <div className="bg-card rounded-2xl p-8 shadow-ocean hover:shadow-ocean-lg transition-all duration-300 group">
                  {/* Step Number */}
                  <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full text-white font-bold text-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    {step?.step}
                  </div>

                  {/* Icon */}
                  <div className={`flex items-center justify-center w-14 h-14 ${step?.color} rounded-full mb-6 mx-auto`}>
                    <Icon 
                      name={step?.icon} 
                      size={24}
                    />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      {step?.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {step?.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      {step?.features?.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                          <Icon name="Check" size={14} className="text-success" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Arrow - Desktop */}
                {index < steps?.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="ArrowRight" size={20} className="text-white" />
                    </div>
                  </div>
                )}

                {/* Arrow - Mobile */}
                {index < steps?.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-6 mb-2">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="ArrowDown" size={16} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-ocean-gradient rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of coastal citizens who are already contributing to safer seas. 
              Your first report could save lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/hazard-reporting-form">
                <Button
                  variant="secondary"
                  size="lg"
                  iconName="Plus"
                  iconPosition="left"
                  className="w-full sm:w-auto"
                >
                  Submit Your First Report
                </Button>
              </Link>
              <Link to="/interactive-risk-map">
                <Button
                  variant="outline"
                  size="lg"
                  iconName="Map"
                  iconPosition="left"
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary"
                >
                  Explore Risk Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;