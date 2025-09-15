import React from 'react';
import Icon from '../../../components/AppIcon';

const WhyItMattersSection = () => {
  const benefits = [
    {
      id: 1,
      icon: "Heart",
      title: "Community Safety",
      stat: "85%",
      description: "Reduction in coastal accident response time through early citizen reporting",
      color: "text-success"
    },
    {
      id: 2,
      icon: "TrendingUp",
      title: "Economic Impact",
      stat: "₹2.5Cr",
      description: "Annual savings in fishing industry through timely hazard warnings",
      color: "text-primary"
    },
    {
      id: 3,
      icon: "Globe",
      title: "Environmental Protection",
      stat: "500+",
      description: "Marine pollution incidents reported and addressed by citizens",
      color: "text-secondary"
    },
    {
      id: 4,
      icon: "Clock",
      title: "Response Time",
      stat: "15min",
      description: "Average time from citizen report to official hazard verification",
      color: "text-accent"
    }
  ];

  return (
    <section className="py-16 bg-surface-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why It Matters
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            VARUNA transforms coastal safety through citizen participation, creating measurable 
            impact on community protection and marine conservation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits?.map((benefit) => (
            <div key={benefit?.id} className="bg-card rounded-xl p-6 shadow-ocean hover:shadow-ocean-lg transition-all duration-300 group">
              <div className="text-center">
                <div className="flex items-center justify-center w-14 h-14 bg-muted rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Icon 
                    name={benefit?.icon} 
                    size={24} 
                    className={benefit?.color}
                  />
                </div>
                
                <div className={`text-3xl font-bold ${benefit?.color} mb-2`}>
                  {benefit?.stat}
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {benefit?.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit?.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-card rounded-2xl p-8 shadow-ocean-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Join the Coastal Safety Movement
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Every report matters. Your observations help protect coastal communities, 
              support fishermen, and preserve our marine environment for future generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Users" size={16} className="text-primary" />
                <span>10,000+ Active Citizens</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="MapPin" size={16} className="text-secondary" />
                <span>500+ Coastal Locations</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Shield" size={16} className="text-success" />
                <span>24/7 Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyItMattersSection;