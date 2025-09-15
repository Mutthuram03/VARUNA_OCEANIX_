import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const FooterSection = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    platform: [
      { label: "Report Hazard", path: "/hazard-reporting-form" },
      { label: "Risk Map", path: "/interactive-risk-map" },
      { label: "My Alerts", path: "/my-alerts-dashboard" },
      { label: "About & Help", path: "/about-help-center" }
    ],
    support: [
      { label: "Help Center", path: "/about-help-center" },
      { label: "Contact Us", path: "/about-help-center#contact" },
      { label: "Emergency Contacts", path: "/about-help-center#emergency" },
      { label: "User Guide", path: "/about-help-center#guide" }
    ],
    legal: [
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
      { label: "Data Usage", path: "/data-policy" },
      { label: "Accessibility", path: "/accessibility" }
    ]
  };

  const socialLinks = [
    { name: "Twitter", icon: "Twitter", url: "https://twitter.com/varuna_ocean" },
    { name: "Facebook", icon: "Facebook", url: "https://facebook.com/varuna.ocean" },
    { name: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com/company/varuna-ocean" },
    { name: "YouTube", icon: "Youtube", url: "https://youtube.com/c/varunaocean" }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl animate-wave">🌊</span>
                <div>
                  <h3 className="text-2xl font-bold text-primary">VARUNA</h3>
                  <p className="text-sm text-muted-foreground -mt-1">
                    Ocean Hazard Platform
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
                Empowering coastal communities with real-time hazard intelligence through 
                citizen reporting and INCOIS collaboration for safer seas.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks?.map((social) => (
                  <a
                    key={social?.name}
                    href={social?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-muted hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-300 group"
                    aria-label={`Follow us on ${social?.name}`}
                  >
                    <Icon 
                      name={social?.icon} 
                      size={18} 
                      className="text-muted-foreground group-hover:text-white"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-3">
                {footerLinks?.platform?.map((link) => (
                  <li key={link?.path}>
                    <Link
                      to={link?.path}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-150 text-sm"
                    >
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-3">
                {footerLinks?.support?.map((link) => (
                  <li key={link?.path}>
                    <Link
                      to={link?.path}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-150 text-sm"
                    >
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                {footerLinks?.legal?.map((link) => (
                  <li key={link?.path}>
                    <Link
                      to={link?.path}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-150 text-sm"
                    >
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Partnership & Recognition Section */}
        <div className="py-8 border-t border-border">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Award" size={16} className="text-primary" />
                <span>Official INCOIS Partner</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Trophy" size={16} className="text-secondary" />
                <span>Smart India Hackathon 2025</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Users" size={16} className="text-accent" />
                <span>Team Oceanix</span>
              </div>
            </div>
            
            {/* Emergency Contact */}
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="Phone" size={16} className="text-error" />
              <span className="text-muted-foreground">Emergency:</span>
              <a href="tel:1077" className="text-error font-semibold hover:underline">
                1077
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {currentYear} VARUNA Ocean Hazard Platform. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>Made with</span>
              <Icon name="Heart" size={12} className="text-error" />
              <span>for coastal safety</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;