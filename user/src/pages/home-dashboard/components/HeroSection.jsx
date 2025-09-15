import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/oceanvid.mp4"
        autoPlay
        muted
        loop
        playsInline
      ></video>

      {/* Overlay to make text readable */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cyan-400 leading-tight">
                VARUNA
              </h1>
              <p className="text-lg sm:text-xl  text-cyan-400 leading-tight font-medium mt-4 leading-relaxed">
                Vigilant Alerting for Real-time Underwater & Nearshore Anomalies
              </p>
            </div>
          </div>

          <p className="text-xl sm:text-2xl  text-cyan-400 leading-tight mb-12 max-w-3xl leading-relaxed">
            Empowering citizens & INCOIS with real-time coastal hazard intelligence
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/hazard-reporting-form">
              <Button
                variant="secondary"
                size="lg"
                iconName="AlertTriangle"
                iconPosition="left"
                className="w-full sm:w-auto min-w-[200px] touch-target"
              >
                Report Hazard
              </Button>
            </Link>

            <Link to="/interactive-risk-map">
              <Button
                variant="outline"
                size="lg"
                iconName="Map"
                iconPosition="left"
                className="w-full sm:w-auto min-w-[200px] touch-target border-cyan-400 leading-tight text-white hover:bg-white hover:text-primary"
              >
                View Nearby Risk Zones
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">24/7</div>
            <div className="text-blue-200 text-sm">Real-time Monitoring</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">1000+</div>
            <div className="text-blue-200 text-sm">Coastal Reports</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">50+</div>
            <div className="text-blue-200 text-sm">Risk Zones Mapped</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
