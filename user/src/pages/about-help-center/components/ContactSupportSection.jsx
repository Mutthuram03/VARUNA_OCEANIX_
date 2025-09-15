import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ContactSupportSection = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const supportChannels = [
    {
      type: "Emergency Hotline",
      icon: "Phone",
      contact: "+91 1800-123-456",
      description: "24/7 emergency coastal hazard reporting",
      availability: "Available 24/7",
      action: "tel:+911800123456",
      priority: "critical"
    },
    {
      type: "Email Support",
      icon: "Mail",
      contact: "support@varuna.gov.in",
      description: "General inquiries and technical support",
      availability: "Response within 4-6 hours",
      action: "mailto:support@varuna.gov.in",
      priority: "high"
    },
    {
      type: "Technical Help",
      icon: "Settings",
      contact: "tech@varuna.gov.in",
      description: "Platform issues and bug reports",
      availability: "Response within 8-12 hours",
      action: "mailto:tech@varuna.gov.in",
      priority: "medium"
    },
    {
      type: "INCOIS Coordination",
      icon: "Building",
      contact: "incois@varuna.gov.in",
      description: "Scientific validation and data queries",
      availability: "Business hours (9 AM - 6 PM)",
      action: "mailto:incois@varuna.gov.in",
      priority: "medium"
    }
  ];

  const officeLocations = [
    {
      name: "VARUNA Operations Center",
      address: "INCOIS Campus, Pragathi Nagar, Hyderabad, Telangana 500090",
      phone: "+91 40 2389 5000",
      email: "operations@varuna.gov.in",
      hours: "24/7 Operations"
    },
    {
      name: "Coastal Monitoring Station",
      address: "Marina Beach, Chennai, Tamil Nadu 600013",
      phone: "+91 44 2536 0000",
      email: "chennai@varuna.gov.in",
      hours: "6 AM - 10 PM"
    },
    {
      name: "Western Coast Office",
      address: "Bandra Kurla Complex, Mumbai, Maharashtra 400051",
      phone: "+91 22 2659 0000",
      email: "mumbai@varuna.gov.in",
      hours: "9 AM - 6 PM"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'medium'
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <section className="bg-card rounded-lg p-6 lg:p-8 shadow-ocean">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center justify-center">
            <Icon name="MessageCircle" size={32} className="text-primary mr-3" />
            Contact & Support
          </h2>
          <p className="text-muted-foreground">
            Get help when you need it - multiple channels available for different needs
          </p>
        </div>

        {/* Support Channels */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Support Channels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportChannels?.map((channel, index) => (
              <div key={index} className="bg-surface rounded-lg p-4 hover:shadow-ocean-lg transition-shadow duration-300">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon name={channel?.icon} size={24} className="text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-foreground">
                        {channel?.type}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full bg-muted ${getPriorityColor(channel?.priority)}`}>
                        {channel?.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {channel?.description}
                    </p>
                    <div className="space-y-1">
                      <a 
                        href={channel?.action}
                        className="text-primary hover:text-primary/80 font-medium text-sm flex items-center space-x-1 transition-colors duration-150"
                      >
                        <span>{channel?.contact}</span>
                        <Icon name="ExternalLink" size={14} />
                      </a>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Icon name="Clock" size={12} className="mr-1" />
                        {channel?.availability}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Send us a Message
            </h3>
            
            {submitStatus === 'success' && (
              <div className="mb-4 p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2 text-success">
                  <Icon name="CheckCircle" size={20} />
                  <span className="font-medium">Message sent successfully!</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  We'll respond within 4-6 hours during business hours.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  value={contactForm?.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={contactForm?.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <Input
                label="Subject"
                type="text"
                name="subject"
                value={contactForm?.subject}
                onChange={handleInputChange}
                placeholder="Brief description of your inquiry"
                required
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Priority Level
                </label>
                <select
                  name="priority"
                  value={contactForm?.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Technical support</option>
                  <option value="high">High - Platform issue</option>
                  <option value="critical">Critical - Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={contactForm?.message}
                  onChange={handleInputChange}
                  placeholder="Please describe your inquiry in detail..."
                  rows={5}
                  required
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                />
              </div>

              <Button
                type="submit"
                variant="default"
                loading={isSubmitting}
                iconName="Send"
                iconPosition="right"
                fullWidth
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Office Locations */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Office Locations
            </h3>
            <div className="space-y-4">
              {officeLocations?.map((office, index) => (
                <div key={index} className="bg-surface rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <Icon name="MapPin" size={18} className="text-primary mr-2" />
                    {office?.name}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground flex items-start">
                      <Icon name="Navigation" size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span>{office?.address}</span>
                    </p>
                    <div className="flex items-center space-x-4">
                      <a 
                        href={`tel:${office?.phone}`}
                        className="text-primary hover:text-primary/80 flex items-center space-x-1 transition-colors duration-150"
                      >
                        <Icon name="Phone" size={14} />
                        <span>{office?.phone}</span>
                      </a>
                      <a 
                        href={`mailto:${office?.email}`}
                        className="text-primary hover:text-primary/80 flex items-center space-x-1 transition-colors duration-150"
                      >
                        <Icon name="Mail" size={14} />
                        <span>{office?.email}</span>
                      </a>
                    </div>
                    <p className="text-muted-foreground flex items-center">
                      <Icon name="Clock" size={14} className="mr-2" />
                      {office?.hours}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={24} className="text-error flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-error mb-1">
                Emergency Situations
              </h4>
              <p className="text-sm text-muted-foreground">
                For immediate coastal hazard emergencies, call our 24/7 hotline at{' '}
                <a href="tel:+911800123456" className="text-error font-medium hover:underline">
                  +91 1800-123-456
                </a>{' '}
                or contact local emergency services at 112. Do not wait for email responses in critical situations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSupportSection;