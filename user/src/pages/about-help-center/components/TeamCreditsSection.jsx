import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TeamCreditsSection = () => {
  const teamMembers = [
    {
      name: "Dr. Arjun Sharma",
      role: "Lead Developer & Ocean Data Scientist",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "PhD in Marine Sciences with 8+ years in coastal monitoring systems",
      expertise: ["React Development", "Ocean Data Analysis", "GIS Systems"],
      contact: {
        email: "arjun@teamoceanix.dev",
        linkedin: "https://linkedin.com/in/arjunsharma"
      }
    },
    {
      name: "Priya Nair",
      role: "Frontend Developer & UX Designer",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "Specialized in responsive design and user experience for emergency systems",
      expertise: ["UI/UX Design", "Mobile Development", "Accessibility"],
      contact: {
        email: "priya@teamoceanix.dev",
        linkedin: "https://linkedin.com/in/priyanair"
      }
    },
    {
      name: "Rajesh Kumar",
      role: "Backend Developer & DevOps Engineer",
      avatar: "https://randomuser.me/api/portraits/men/56.jpg",
      bio: "Expert in scalable systems and real-time data processing",
      expertise: ["Node.js", "Cloud Infrastructure", "Real-time Systems"],
      contact: {
        email: "rajesh@teamoceanix.dev",
        linkedin: "https://linkedin.com/in/rajeshkumar"
      }
    },
    {
      name: "Dr. Meera Patel",
      role: "Marine Safety Consultant",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      bio: "Former INCOIS researcher with expertise in coastal hazard assessment",
      expertise: ["Marine Safety", "Hazard Assessment", "Scientific Validation"],
      contact: {
        email: "meera@teamoceanix.dev",
        linkedin: "https://linkedin.com/in/meerapatel"
      }
    }
  ];

  const acknowledgments = [
    {
      organization: "Smart India Hackathon 2025",
      role: "Innovation Platform",
      description: "Provided the platform and opportunity to develop VARUNA as a solution to coastal safety challenges",
      logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=80&h=80&fit=crop"
    },
    {
      organization: "INCOIS",
      role: "Scientific Partner",
      description: "Provided scientific expertise, data validation, and integration with national monitoring systems",
      logo: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?w=80&h=80&fit=crop"
    },
    {
      organization: "Ministry of Earth Sciences",
      role: "Government Support",
      description: "Regulatory guidance and support for national coastal safety initiatives",
      logo: "https://images.pixabay.com/photo/2016/12/30/10/03/map-1940220_1280.jpg?w=80&h=80&fit=crop"
    },
    {
      organization: "Coastal Communities",
      role: "Beta Testers",
      description: "Fishermen and coastal residents who provided valuable feedback during development",
      logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&h=80&fit=crop"
    }
  ];

  const technologies = [
    { name: "React 18", category: "Frontend Framework" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "Leaflet", category: "Interactive Maps" },
    { name: "Node.js", category: "Backend Runtime" },
    { name: "MongoDB", category: "Database" },
    { name: "WebSocket", category: "Real-time Communication" },
    { name: "PWA", category: "Mobile Experience" },
    { name: "Vite", category: "Build Tool" }
  ];

  const projectStats = [
    { label: "Development Time", value: "6 months", icon: "Calendar" },
    { label: "Code Commits", value: "2,847", icon: "GitCommit" },
    { label: "Beta Users", value: "500+", icon: "Users" },
    { label: "Test Reports", value: "1,200+", icon: "FileText" }
  ];

  return (
    <section className="bg-card rounded-lg p-6 lg:p-8 shadow-ocean">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center justify-center">
            <Icon name="Users" size={32} className="text-primary mr-3" />
            Team Oceanix
          </h2>
          <p className="text-muted-foreground">
            Meet the team behind VARUNA and our acknowledgments
          </p>
        </div>

        {/* Team Members */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Development Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers?.map((member, index) => (
              <div key={index} className="bg-surface rounded-lg p-6 hover:shadow-ocean-lg transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <Image 
                    src={member?.avatar}
                    alt={`${member?.name} profile`}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-foreground mb-1">
                      {member?.name}
                    </h4>
                    <p className="text-primary text-sm font-medium mb-2">
                      {member?.role}
                    </p>
                    <p className="text-muted-foreground text-sm mb-3">
                      {member?.bio}
                    </p>
                    
                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {member?.expertise?.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    {/* Contact Links */}
                    <div className="flex items-center space-x-3">
                      <a 
                        href={`mailto:${member?.contact?.email}`}
                        className="text-muted-foreground hover:text-primary transition-colors duration-150"
                        title="Email"
                      >
                        <Icon name="Mail" size={16} />
                      </a>
                      <a 
                        href={member?.contact?.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors duration-150"
                        title="LinkedIn"
                      >
                        <Icon name="Linkedin" size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Statistics */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Project Statistics
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {projectStats?.map((stat, index) => (
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

        {/* Acknowledgments */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Acknowledgments
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {acknowledgments?.map((ack, index) => (
              <div key={index} className="bg-surface rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <Image 
                    src={ack?.logo}
                    alt={`${ack?.organization} logo`}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-foreground mb-1">
                      {ack?.organization}
                    </h4>
                    <p className="text-primary text-sm font-medium mb-2">
                      {ack?.role}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {ack?.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies Used */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Technologies & Tools
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {technologies?.map((tech, index) => (
              <div key={index} className="bg-surface rounded-lg p-3 text-center">
                <h4 className="font-medium text-foreground text-sm mb-1">
                  {tech?.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {tech?.category}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Source & Contributions */}
        <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center justify-center">
              <Icon name="Heart" size={20} className="text-error mr-2" />
              Open Source Commitment
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              VARUNA is built with open source technologies and we believe in giving back to the community. 
              Selected components of our platform will be open-sourced to help other coastal safety initiatives.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
              <a 
                href="https://github.com/team-oceanix/varuna"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-150"
              >
                <Icon name="Github" size={16} />
                <span>View on GitHub</span>
              </a>
              <a 
                href="mailto:contribute@teamoceanix.dev"
                className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-150"
              >
                <Icon name="Mail" size={16} />
                <span>Contribute</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Team */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Get in Touch with Team Oceanix
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
            <a 
              href="mailto:team@teamoceanix.dev"
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-150"
            >
              <Icon name="Mail" size={16} />
              <span>team@teamoceanix.dev</span>
            </a>
            <a 
              href="https://teamoceanix.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-150"
            >
              <Icon name="Globe" size={16} />
              <span>teamoceanix.dev</span>
              <Icon name="ExternalLink" size={14} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © {new Date()?.getFullYear()} Team Oceanix. Developed for Smart India Hackathon 2025.
            <br />
            In collaboration with INCOIS and Ministry of Earth Sciences, Government of India.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TeamCreditsSection;