import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FAQSection = () => {
  const [openItems, setOpenItems] = useState(new Set([0])); // First item open by default

  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I report a coastal hazard?",
          answer: `Reporting a hazard is simple:\n1. Click "Report Hazard" from the main dashboard\n2. Select the hazard type (High Wave, Flood, Oil Spill, Dead Fish, Other)\n3. Allow GPS location access or manually select location on map\n4. Add a brief description of what you observed\n5. Optionally attach photos or videos\n6. Submit your report for validation\n\nYour report will be reviewed by INCOIS experts and added to the risk map if validated.`
        },
        {
          question: "Do I need to create an account to use VARUNA?",
          answer: `You can browse risk maps and view public alerts without an account. However, creating an account allows you to:\n• Submit hazard reports\n• Receive personalized alerts for your area\n• Track your report history\n• Set custom notification preferences\n\nRegistration is free and takes less than 2 minutes.`
        },
        {
          question: "Is VARUNA available on mobile devices?",
          answer: `Yes! VARUNA is fully responsive and works on all devices:\n• Mobile browsers (iOS Safari, Android Chrome)\n• Tablet browsers\n• Desktop computers\n• Progressive Web App (PWA) features for offline access\n\nFor the best mobile experience, add VARUNA to your home screen for quick access.`
        }
      ]
    },
    {
      category: "Hazard Reporting",
      questions: [
        {
          question: "What types of hazards can I report?",
          answer: `VARUNA accepts reports for various coastal hazards:\n• High Waves: Unusual wave patterns or heights\n• Flooding: Coastal flooding or storm surge\n• Oil Spills: Marine pollution incidents\n• Dead Fish: Mass fish mortality events\n• Other: Any unusual coastal or marine phenomena\n\nEach report type has specific guidelines to ensure accurate data collection.`
        },
        {
          question: "How accurate should my location be?",
          answer: `Location accuracy is crucial for effective hazard mapping:\n• GPS accuracy within 10 meters is ideal\n• If GPS is unavailable, use the map selector\n• Provide landmarks or reference points in description\n• For offshore observations, estimate distance from shore\n\nAccurate locations help emergency responders and other users understand the exact risk area.`
        },
        {
          question: "Can I report hazards anonymously?",
          answer: `Yes, you can report hazards without creating an account, but:\n• Anonymous reports undergo additional verification\n• You won't receive updates on your report status\n• Follow-up questions cannot be asked\n\nRegistered users help us maintain data quality and provide better community engagement.`
        }
      ]
    },
    {
      category: "Alerts & Notifications",
      questions: [
        {
          question: "How do I receive alerts for my area?",
          answer: `To receive personalized alerts:\n1. Create an account and verify your location\n2. Go to "My Alerts" dashboard\n3. Set your notification preferences\n4. Choose alert types (Critical, High, Medium, Low)\n5. Enable browser notifications or email alerts\n\nYou'll receive alerts for hazards within your specified radius (5-50 km).`
        },
        {
          question: "What do the different alert colors mean?",
          answer: `VARUNA uses a color-coded severity system:\n• RED (Critical): Immediate danger, evacuation may be required\n• ORANGE (High): Significant risk, avoid affected areas\n• YELLOW (Medium): Moderate risk, exercise caution\n• GREEN (Low): Minor risk, stay informed\n\nColors are determined by hazard type, intensity, and potential impact on communities.`
        },
        {
          question: "How quickly are alerts issued?",
          answer: `Alert timing depends on the source:\n• Automated system alerts: Within 2-5 minutes\n• Citizen report validation: 15-30 minutes\n• INCOIS official alerts: Real-time integration\n• Emergency situations: Immediate broadcast\n\nCritical alerts are prioritized and issued as fast as possible to ensure public safety.`
        }
      ]
    },
    {
      category: "Data & Privacy",
      questions: [
        {
          question: "How is my personal data protected?",
          answer: `VARUNA follows strict data protection protocols:\n• Personal information encrypted in transit and storage\n• Location data anonymized for public risk maps\n• No sharing of personal data with third parties\n• Compliance with Indian data protection regulations\n• Regular security audits and updates\n\nYou can delete your account and data at any time through settings.`
        },
        {
          question: "Who validates the hazard reports?",
          answer: `Report validation involves multiple steps:\n• Automated initial screening for obvious errors\n• INCOIS expert review for scientific accuracy\n• Cross-reference with official monitoring systems\n• Community verification through multiple reports\n• Final approval by certified marine safety officers\n\nThis multi-layer approach ensures data reliability and public trust.`
        }
      ]
    }
  ];

  const toggleItem = (categoryIndex, questionIndex) => {
    const itemId = `${categoryIndex}-${questionIndex}`;
    const newOpenItems = new Set(openItems);
    
    if (newOpenItems?.has(itemId)) {
      newOpenItems?.delete(itemId);
    } else {
      newOpenItems?.add(itemId);
    }
    
    setOpenItems(newOpenItems);
  };

  const isItemOpen = (categoryIndex, questionIndex) => {
    return openItems?.has(`${categoryIndex}-${questionIndex}`);
  };

  return (
    <section className="bg-card rounded-lg p-6 lg:p-8 shadow-ocean">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center justify-center">
            <Icon name="HelpCircle" size={32} className="text-primary mr-3" />
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Find answers to common questions about VARUNA platform
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {faqData?.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center space-x-2 pb-2 border-b border-border">
                <Icon name="Folder" size={20} className="text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  {category?.category}
                </h3>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                {category?.questions?.map((item, questionIndex) => {
                  const itemId = `${categoryIndex}-${questionIndex}`;
                  const isOpen = isItemOpen(categoryIndex, questionIndex);
                  
                  return (
                    <div key={questionIndex} className="bg-surface rounded-lg overflow-hidden">
                      {/* Question Button */}
                      <button
                        onClick={() => toggleItem(categoryIndex, questionIndex)}
                        className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors duration-150 focus-ocean"
                      >
                        <span className="font-medium text-foreground pr-4">
                          {item?.question}
                        </span>
                        <Icon 
                          name={isOpen ? "ChevronUp" : "ChevronDown"} 
                          size={20} 
                          className="text-muted-foreground flex-shrink-0 transition-transform duration-200"
                        />
                      </button>
                      {/* Answer Content */}
                      {isOpen && (
                        <div className="px-4 pb-4 border-t border-border/50">
                          <div className="pt-3 text-muted-foreground leading-relaxed whitespace-pre-line">
                            {item?.answer}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Help Footer */}
        <div className="bg-primary/5 rounded-lg p-4 text-center border border-primary/10">
          <p className="text-muted-foreground mb-2">
            Can't find what you're looking for?
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
              href="tel:+911800123456" 
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-150"
            >
              <Icon name="Phone" size={16} />
              <span>Call Helpline</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;