import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const LocationSelector = ({ 
  location, 
  onLocationChange, 
  error,
  className = '' 
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 13.0827, lng: 80.2707 }); // Chennai default

  // Mock location data for demonstration
  const mockLocations = [
    { name: "Marina Beach, Chennai", lat: 13.0478, lng: 80.2619 },
    { name: "Kovalam Beach, Kerala", lat: 8.4004, lng: 76.9784 },
    { name: "Goa Beach", lat: 15.2993, lng: 74.1240 },
    { name: "Puri Beach, Odisha", lat: 19.8135, lng: 85.8312 },
    { name: "Visakhapatnam Beach", lat: 17.7231, lng: 83.3012 }
  ];

  const detectCurrentLocation = () => {
    setIsDetecting(true);
    
    // Simulate GPS detection with mock data
    setTimeout(() => {
      const randomLocation = mockLocations?.[Math.floor(Math.random() * mockLocations?.length)];
      onLocationChange({
        latitude: randomLocation?.lat,
        longitude: randomLocation?.lng,
        address: randomLocation?.name,
        accuracy: Math.floor(Math.random() * 50) + 10 // 10-60 meters
      });
      setMapCenter({ lat: randomLocation?.lat, lng: randomLocation?.lng });
      setIsDetecting(false);
    }, 2000);
  };

  const handleManualLocationSelect = (lat, lng) => {
    // Find nearest known location for address
    const nearestLocation = mockLocations?.reduce((prev, curr) => {
      const prevDistance = Math.sqrt(Math.pow(prev?.lat - lat, 2) + Math.pow(prev?.lng - lng, 2));
      const currDistance = Math.sqrt(Math.pow(curr?.lat - lat, 2) + Math.pow(curr?.lng - lng, 2));
      return currDistance < prevDistance ? curr : prev;
    });

    onLocationChange({
      latitude: lat,
      longitude: lng,
      address: `Near ${nearestLocation?.name}`,
      accuracy: null
    });
  };

  const clearLocation = () => {
    onLocationChange(null);
    setManualMode(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <Icon name="MapPin" size={20} className="text-secondary" />
        <h3 className="text-lg font-semibold text-foreground">Location</h3>
        <span className="text-error text-sm">*</span>
      </div>
      {/* Location Detection Buttons */}
      {!location && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="default"
            onClick={detectCurrentLocation}
            loading={isDetecting}
            iconName="Navigation"
            iconPosition="left"
            className="flex-1"
          >
            {isDetecting ? 'Detecting Location...' : 'Use Current Location'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setManualMode(true)}
            iconName="Map"
            iconPosition="left"
            className="flex-1"
          >
            Select on Map
          </Button>
        </div>
      )}
      {/* Current Location Display */}
      {location && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="MapPin" size={16} className="text-secondary" />
                <span className="text-sm font-medium text-foreground">Selected Location</span>
              </div>
              
              <p className="text-sm text-foreground mb-2">{location?.address}</p>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Latitude: {location?.latitude?.toFixed(6)}</p>
                <p>Longitude: {location?.longitude?.toFixed(6)}</p>
                {location?.accuracy && (
                  <p>Accuracy: ±{location?.accuracy}m</p>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearLocation}
              iconName="X"
              className="p-2"
            />
          </div>
        </div>
      )}
      {/* Manual Map Selection */}
      {manualMode && !location && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Select Location on Map</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setManualMode(false)}
                iconName="X"
                className="p-1"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Click on the map to select the hazard location
            </p>
          </div>
          
          <div className="h-64 bg-muted relative">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title="Location Selection Map"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=12&output=embed`}
              className="border-0"
            />
            
            {/* Map Overlay for Click Detection */}
            <div 
              className="absolute inset-0 cursor-crosshair"
              onClick={(e) => {
                const rect = e?.currentTarget?.getBoundingClientRect();
                const x = e?.clientX - rect?.left;
                const y = e?.clientY - rect?.top;
                
                // Convert click position to approximate coordinates
                const lat = mapCenter?.lat + (0.5 - y / rect?.height) * 0.1;
                const lng = mapCenter?.lng + (x / rect?.width - 0.5) * 0.1;
                
                handleManualLocationSelect(lat, lng);
                setManualMode(false);
              }}
            />
          </div>
          
          <div className="p-3 bg-muted/50">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Info" size={12} />
              <span>Click anywhere on the map to select that location</span>
            </div>
          </div>
        </div>
      )}
      {/* Quick Location Suggestions */}
      {!location && !manualMode && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Quick Locations</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {mockLocations?.slice(0, 4)?.map((loc, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => handleManualLocationSelect(loc?.lat, loc?.lng)}
                className="justify-start text-left h-auto py-2"
              >
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={14} className="text-muted-foreground" />
                  <span className="text-sm">{loc?.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}
      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 text-sm text-error">
          <Icon name="AlertCircle" size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;