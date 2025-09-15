import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapContainer = ({ 
  filteredReports = [], 
  selectedReport = null, 
  onReportSelect = () => {},
  onMapClick = () => {},
  mapCenter = { lat: 13.0827, lng: 80.2707 }, // Chennai coordinates
  zoomLevel = 10
}) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoomLevel);
  const [currentCenter, setCurrentCenter] = useState(mapCenter);
  const [showClustering, setShowClustering] = useState(true);

  // Mock map implementation using Google Maps iframe with overlay
  const generateMapUrl = () => {
    const { lat, lng } = currentCenter;
    // Use embed format for better iframe compatibility
    return `https://maps.google.com/maps?q=${lat},${lng}&z=${currentZoom}&output=embed&iwloc=near`;
  };

  // Get severity color for map pins (matching website theme)
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#dc2626'; // red-600
      case 'high': return '#ea580c'; // orange-600
      case 'medium': return '#ca8a04'; // yellow-600
      case 'low': return '#16a34a'; // green-600
      default: return '#6b7280'; // gray-500
    }
  };

  // Get hazard icon
  const getHazardIcon = (type) => {
    switch (type) {
      case 'HIGH WAVE': return 'Waves';
      case 'FLOOD': return 'CloudRain';
      case 'OIL SPILL': return 'Droplets';
      case 'DEAD FISH': return 'Fish';
      case 'COASTAL EROSION': return 'Mountain';
      case 'UNUSUAL TIDE': return 'Tide';
      case 'MARINE POLLUTION': return 'AlertTriangle';
      case 'OTHER': return 'AlertCircle';
      default: return 'MapPin';
    }
  };

  // Cluster nearby reports
  const clusterReports = (reports) => {
    if (!showClustering) return reports;
    
    const clusters = [];
    const processed = new Set();
    
    reports?.forEach((report, index) => {
      if (processed?.has(index)) return;
      
      const cluster = {
        ...report,
        count: 1,
        reports: [report]
      };
      
      // Find nearby reports within 0.01 degrees (~1km)
      reports?.forEach((otherReport, otherIndex) => {
        if (index !== otherIndex && !processed?.has(otherIndex)) {
          const distance = Math.sqrt(
            Math.pow(report?.location?.latitude - otherReport?.location?.latitude, 2) +
            Math.pow(report?.location?.longitude - otherReport?.location?.longitude, 2)
          );
          
          if (distance < 0.01) {
            cluster?.reports?.push(otherReport);
            cluster.count++;
            processed?.add(otherIndex);
          }
        }
      });
      
      processed?.add(index);
      clusters?.push(cluster);
    });
    
    return clusters;
  };

  const clusteredReports = clusterReports(filteredReports);

  // Handle map pin click
  const handlePinClick = (report) => {
    onReportSelect(report);
    // Center map on selected report
    if (report?.location) {
      setCurrentCenter({
        lat: report.location.latitude,
        lng: report.location.longitude
      });
    }
  };

  // Map controls
  const zoomIn = () => {
    setCurrentZoom(prev => Math.min(prev + 1, 18));
  };

  const zoomOut = () => {
    setCurrentZoom(prev => Math.max(prev - 1, 3));
  };

  const resetView = () => {
    setCurrentCenter(mapCenter);
    setCurrentZoom(zoomLevel);
  };

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
      {/* Google Maps iframe */}
      <iframe
        ref={mapRef}
        width="100%"
        height="100%"
        loading="lazy"
        title="Interactive Risk Map"
        referrerPolicy="no-referrer-when-downgrade"
        src={generateMapUrl()}
        className="absolute inset-0"
        onLoad={() => setMapLoaded(true)}
      />
      {/* Map overlay with pins */}
      <div className="absolute inset-0 pointer-events-none">
        {mapLoaded && clusteredReports?.map((report, index) => (
          <div
            key={report?.id || index}
            className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${50 + (report?.location?.longitude - currentCenter?.lng) * 200}%`,
              top: `${50 + (currentCenter?.lat - report?.location?.latitude) * 200}%`,
              zIndex: selectedReport?.id === report?.id ? 20 : 10
            }}
            onClick={() => handlePinClick(report)}
          >
            {/* Map pin */}
            <div 
              className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg transition-all duration-200 hover:scale-110 ${
                selectedReport?.id === report?.id ? 'scale-125 ring-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: getSeverityColor(report?.severity) }}
            >
              <Icon 
                name={getHazardIcon(report?.type)} 
                size={16} 
                className="text-white" 
              />
              
              {/* Cluster count */}
              {report?.count > 1 && (
                <div className="absolute -top-2 -right-2 bg-error text-error-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {report?.count}
                </div>
              )}
            </div>

            {/* Pin shadow */}
            <div 
              className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-2 rounded-full opacity-30"
              style={{ backgroundColor: getSeverityColor(report?.severity) }}
            />
          </div>
        ))}
      </div>
      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-30">
        <Button
          variant="secondary"
          size="sm"
          onClick={zoomIn}
          className="w-10 h-10 p-0 shadow-lg"
          aria-label="Zoom in"
        >
          <Icon name="Plus" size={16} />
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={zoomOut}
          className="w-10 h-10 p-0 shadow-lg"
          aria-label="Zoom out"
        >
          <Icon name="Minus" size={16} />
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={resetView}
          className="w-10 h-10 p-0 shadow-lg"
          aria-label="Reset view"
        >
          <Icon name="Home" size={16} />
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowClustering(!showClustering)}
          className={`w-10 h-10 p-0 shadow-lg ${showClustering ? 'bg-primary text-primary-foreground' : ''}`}
          aria-label="Toggle clustering"
        >
          <Icon name="Layers" size={16} />
        </Button>
      </div>
      {/* Loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center">
            <Icon name="Loader2" size={32} className="animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      {/* Map info */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="MapPin" size={16} className="text-primary" />
          <span className="text-foreground font-medium">
            {filteredReports?.length} reports visible
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Zoom: {currentZoom} | Clustering: {showClustering ? 'On' : 'Off'}
        </div>
      </div>
    </div>
  );
};

export default MapContainer;