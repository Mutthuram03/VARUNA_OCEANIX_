import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const UserGuideSection = () => {
  const [activeGuide, setActiveGuide] = useState('reporting');

  const guides = {
    reporting: {
      title: "Reporting Hazards",
      icon: "AlertTriangle",
      steps: [
        {
          step: 1,
          title: "Access Report Form",
          description: "Click \'Report Hazard\' from dashboard or navigation menu",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
          tips: ["Available 24/7 for emergency situations", "No login required for urgent reports"]
        },
        {
          step: 2,
          title: "Select Hazard Type",
          description: "Choose from High Wave, Flood, Oil Spill, Dead Fish, or Other",
          image: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?w=300&h=200&fit=crop",
          tips: ["Select the most specific category", "Use \'Other\' for unusual phenomena"]
        },
        {
          step: 3,
          title: "Set Location",
          description: "Allow GPS access or manually select location on interactive map",
          image: "https://images.pixabay.com/photo/2016/12/30/10/03/map-1940220_1280.jpg?w=300&h=200&fit=crop",
          tips: ["GPS provides most accurate location", "Add landmarks in description"]
        },
        {
          step: 4,
          title: "Add Details",
          description: "Provide description and optionally attach photos or videos",
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
          tips: ["Include time of observation", "Photos help validation process"]
        },
        {
          step: 5,
          title: "Submit Report",
          description: "Review information and submit for expert validation",
          image: "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?w=300&h=200&fit=crop",
          tips: ["Reports reviewed within 30 minutes", "You\'ll receive confirmation email"]
        }
      ]
    },
    riskzones: {
      title: "Interpreting Risk Zones",
      icon: "Map",
      steps: [
        {
          step: 1,
          title: "Access Risk Map",
          description: "Navigate to Interactive Risk Map from main menu",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
          tips: ["Works on all devices", "No login required for viewing"]
        },
        {
          step: 2,
          title: "Understand Color Coding",
          description: "Red = Critical, Orange = High, Yellow = Medium, Green = Low risk",
          image: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?w=300&h=200&fit=crop",
          tips: ["Colors update in real-time", "Hover for detailed information"]
        },
        {
          step: 3,
          title: "Use Map Filters",
          description: "Filter by hazard type, date range, and severity level",
          image: "https://images.pixabay.com/photo/2016/12/30/10/03/map-1940220_1280.jpg?w=300&h=200&fit=crop",
          tips: ["Combine filters for specific searches", "Save filter preferences"]
        },
        {
          step: 4,
          title: "View Hazard Details",
          description: "Click on map pins to see detailed hazard information",
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
          tips: ["Shows validation status", "Includes reporter information"]
        },
        {
          step: 5,
          title: "Plan Activities",
          description: "Use risk information to plan coastal activities safely",
          image: "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?w=300&h=200&fit=crop",
          tips: ["Check before beach visits", "Share with family and friends"]
        }
      ]
    },
    alerts: {
      title: "Managing Personal Alerts",
      icon: "Bell",
      steps: [
        {
          step: 1,
          title: "Create Account",
          description: "Register to receive personalized alerts for your area",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
          tips: ["Free registration", "Verify email for full access"]
        },
        {
          step: 2,
          title: "Set Location Preferences",
          description: "Define your home location and areas of interest",
          image: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?w=300&h=200&fit=crop",
          tips: ["Set multiple locations", "Adjust alert radius (5-50km)"]
        },
        {
          step: 3,
          title: "Configure Alert Types",
          description: "Choose which severity levels trigger notifications",
          image: "https://images.pixabay.com/photo/2016/12/30/10/03/map-1940220_1280.jpg?w=300&h=200&fit=crop",
          tips: ["Critical alerts always enabled", "Customize by hazard type"]
        },
        {
          step: 4,
          title: "Enable Notifications",
          description: "Allow browser notifications and set email preferences",
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
          tips: ["Enable push notifications", "Set quiet hours"]
        },
        {
          step: 5,
          title: "Monitor Dashboard",
          description: "Check My Alerts dashboard for active warnings in your area",
          image: "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?w=300&h=200&fit=crop",
          tips: ["Updates every 5 minutes", "Archive old alerts"]
        }
      ]
    }
  };

  const currentGuide = guides?.[activeGuide];

  return (
    <section className="bg-card rounded-lg p-6 lg:p-8 shadow-ocean">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center justify-center">
            <Icon name="BookOpen" size={32} className="text-primary mr-3" />
            User Guides
          </h2>
          <p className="text-muted-foreground">
            Step-by-step instructions for using VARUNA platform features
          </p>
        </div>

        {/* Guide Navigation */}
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          {Object.entries(guides)?.map(([key, guide]) => (
            <button
              key={key}
              onClick={() => setActiveGuide(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-150 ${
                activeGuide === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={guide?.icon} size={18} />
              <span className="font-medium">{guide?.title}</span>
            </button>
          ))}
        </div>

        {/* Active Guide Content */}
        <div className="space-y-6">
          {/* Guide Header */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-foreground flex items-center justify-center">
              <Icon name={currentGuide?.icon} size={24} className="text-primary mr-2" />
              {currentGuide?.title}
            </h3>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {currentGuide?.steps?.map((step, index) => (
              <div key={index} className="bg-surface rounded-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  {/* Step Number and Title */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold text-sm">
                        {step?.step}
                      </div>
                      <h4 className="text-lg font-semibold text-foreground">
                        {step?.title}
                      </h4>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {step?.description}
                    </p>
                    
                    {/* Tips */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-foreground flex items-center">
                        <Icon name="Lightbulb" size={16} className="text-accent mr-1" />
                        Tips:
                      </h5>
                      <ul className="space-y-1">
                        {step?.tips?.map((tip, tipIndex) => (
                          <li key={tipIndex} className="text-sm text-muted-foreground flex items-start">
                            <Icon name="Check" size={14} className="text-success mr-2 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Visual Aid */}
                  <div className="lg:col-span-2">
                    <div className="bg-card rounded-lg p-4 shadow-ocean">
                      <Image 
                        src={step?.image}
                        alt={`${step?.title} - Visual guide`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        Step {step?.step}: {step?.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Guide Footer */}
          <div className="bg-primary/5 rounded-lg p-4 text-center border border-primary/10">
            <p className="text-muted-foreground mb-2">
              Need help with this guide?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <a 
                href="mailto:support@varuna.gov.in" 
                className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-150"
              >
                <Icon name="Mail" size={16} />
                <span>Email Support</span>
              </a>
              <span className="hidden sm:block text-muted-foreground">•</span>
              <a 
                href="#faq" 
                className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-150"
                onClick={(e) => {
                  e?.preventDefault();
                  document.querySelector('[data-section="faq"]')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Icon name="HelpCircle" size={16} />
                <span>View FAQ</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserGuideSection;