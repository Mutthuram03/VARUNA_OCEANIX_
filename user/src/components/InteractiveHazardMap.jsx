import React, { useState, useEffect, useRef } from 'react';
import { AlertService, HazardReportService } from '../services/firebase.js';
import Icon from './AppIcon';

// Local constants
const HAZARD_TYPES = [
  'High Wave',
  'Flood',
  'Oil Spill',
  'Dead Fish',
  'Coastal Erosion',
  'Unusual Tide',
  'Marine Pollution',
  'Other',
];

const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

const REPORT_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

const InteractiveHazardMap = ({ center, zoom = 10, height = '500px' }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [hazards, setHazards] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({
    hazardTypes: Object.values(HAZARD_TYPES),
    severities: Object.values(ALERT_SEVERITY),
    statuses: [REPORT_STATUS.VERIFIED, REPORT_STATUS.INVESTIGATING],
    timeRange: '24h'
  });
  const [loading, setLoading] = useState(true);
  const [selectedHazard, setSelectedHazard] = useState(null);

  // Initialize map
  useEffect(() => {
    if (window.google && mapRef.current && !map) {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: center || { lat: 12.9716, lng: 77.5946 }, // Default to Bangalore
        zoom: zoom,
        mapTypeId: 'hybrid',
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#1e3a8a' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f0f9ff' }]
          }
        ]
      });
      setMap(mapInstance);
    }
  }, [center, zoom]);

  // Load hazards and alerts
  useEffect(() => {
    if (map) {
      loadHazards();
      loadAlerts();
    }
  }, [map, filters]);

  const loadHazards = async () => {
    try {
      setLoading(true);
      const result = await HazardReportService.getReports({
        status: filters.statuses[0], // Get verified reports
        timeRange: filters.timeRange
      });
      
      if (result.success) {
        setHazards(result.reports);
        plotHazardsOnMap(result.reports);
      }
    } catch (error) {
      console.error('Error loading hazards:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAlerts = async () => {
    try {
      const result = await AlertService.getActiveAlerts();
      if (result.success) {
        setAlerts(result.alerts);
        plotAlertsOnMap(result.alerts);
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const plotHazardsOnMap = (hazardReports) => {
    if (!map) return;

    // Clear existing markers
    if (window.hazardMarkers) {
      window.hazardMarkers.forEach(marker => marker.setMap(null));
    }
    window.hazardMarkers = [];

    hazardReports.forEach(hazard => {
      if (!hazard.location?.latitude || !hazard.location?.longitude) return;

      const marker = new window.google.maps.Marker({
        position: {
          lat: hazard.location.latitude,
          lng: hazard.location.longitude
        },
        map: map,
        title: hazard.title,
        icon: getHazardIcon(hazard.hazardType, hazard.severity),
        animation: window.google.maps.Animation.DROP
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: createHazardInfoContent(hazard)
      });

      marker.addListener('click', () => {
        setSelectedHazard(hazard);
        infoWindow.open(map, marker);
      });

      window.hazardMarkers.push(marker);
    });
  };

  const plotAlertsOnMap = (alertList) => {
    if (!map) return;

    // Clear existing alert circles
    if (window.alertCircles) {
      window.alertCircles.forEach(circle => circle.setMap(null));
    }
    window.alertCircles = [];

    alertList.forEach(alert => {
      if (!alert.location?.latitude || !alert.location?.longitude) return;

      const circle = new window.google.maps.Circle({
        strokeColor: getAlertColor(alert.severity),
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: getAlertColor(alert.severity),
        fillOpacity: 0.2,
        map: map,
        center: {
          lat: alert.location.latitude,
          lng: alert.location.longitude
        },
        radius: (alert.location.radius || 5) * 1000 // Convert km to meters
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: createAlertInfoContent(alert)
      });

      circle.addListener('click', () => {
        infoWindow.open(map);
        infoWindow.setPosition({
          lat: alert.location.latitude,
          lng: alert.location.longitude
        });
      });

      window.alertCircles.push(circle);
    });
  };

  const getHazardIcon = (hazardType, severity) => {
    const baseUrl = 'https://maps.google.com/mapfiles/ms/icons/';
    const color = getSeverityColor(severity);
    
    const iconMap = {
      [HAZARD_TYPES.TSUNAMI]: `${baseUrl}red-dot.png`,
      [HAZARD_TYPES.STORM_SURGE]: `${baseUrl}orange-dot.png`,
      [HAZARD_TYPES.HIGH_WAVES]: `${baseUrl}yellow-dot.png`,
      [HAZARD_TYPES.FLOOD]: `${baseUrl}blue-dot.png`,
      [HAZARD_TYPES.OIL_SPILL]: `${baseUrl}purple-dot.png`,
      [HAZARD_TYPES.DEAD_FISH]: `${baseUrl}green-dot.png`,
      [HAZARD_TYPES.ABNORMAL_TIDE]: `${baseUrl}ltblue-dot.png`,
      [HAZARD_TYPES.COASTAL_EROSION]: `${baseUrl}red-dot.png`
    };

    return iconMap[hazardType] || `${baseUrl}red-dot.png`;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      [ALERT_SEVERITY.LOW]: '#10b981',
      [ALERT_SEVERITY.MEDIUM]: '#f59e0b',
      [ALERT_SEVERITY.HIGH]: '#ef4444',
      [ALERT_SEVERITY.CRITICAL]: '#dc2626'
    };
    return colors[severity] || '#6b7280';
  };

  const getAlertColor = (severity) => {
    return getSeverityColor(severity);
  };

  const createHazardInfoContent = (hazard) => {
    return `
      <div class="p-4 max-w-sm">
        <div class="flex items-center mb-2">
          <div class="w-3 h-3 rounded-full mr-2" style="background-color: ${getSeverityColor(hazard.severity)}"></div>
          <h3 class="font-semibold text-gray-900">${hazard.title}</h3>
        </div>
        <p class="text-sm text-gray-600 mb-2">${hazard.hazardType.replace('_', ' ').toUpperCase()}</p>
        <p class="text-sm text-gray-700 mb-2">${hazard.description}</p>
        <div class="text-xs text-gray-500">
          <p>Reported: ${new Date(hazard.createdAt?.toDate?.() || hazard.createdAt).toLocaleString()}</p>
          <p>Status: ${hazard.status}</p>
          ${hazard.reporterName ? `<p>Reporter: ${hazard.reporterName}</p>` : ''}
        </div>
        ${hazard.media?.images?.length > 0 ? `
          <div class="mt-2">
            <img src="${hazard.media.images[0]}" alt="Hazard image" class="w-full h-32 object-cover rounded" />
          </div>
        ` : ''}
      </div>
    `;
  };

  const createAlertInfoContent = (alert) => {
    return `
      <div class="p-4 max-w-sm">
        <div class="flex items-center mb-2">
          <div class="w-3 h-3 rounded-full mr-2" style="background-color: ${getAlertColor(alert.severity)}"></div>
          <h3 class="font-semibold text-gray-900">${alert.title}</h3>
        </div>
        <p class="text-sm text-gray-600 mb-2">${alert.hazardType.replace('_', ' ').toUpperCase()} ALERT</p>
        <p class="text-sm text-gray-700 mb-2">${alert.description}</p>
        <div class="text-xs text-gray-500">
          <p>Issued: ${new Date(alert.createdAt?.toDate?.() || alert.createdAt).toLocaleString()}</p>
          <p>Severity: ${alert.severity.toUpperCase()}</p>
          <p>Radius: ${alert.location.radius || 5} km</p>
        </div>
        ${alert.actions?.length > 0 ? `
          <div class="mt-2">
            <p class="text-xs font-semibold text-gray-700">Actions:</p>
            <ul class="text-xs text-gray-600">
              ${alert.actions.map(action => `<li>• ${action.action}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getTimeRangeLabel = (range) => {
    const labels = {
      '1h': 'Last Hour',
      '24h': 'Last 24 Hours',
      '7d': 'Last 7 Days',
      '30d': 'Last 30 Days'
    };
    return labels[range] || range;
  };

  return (
    <div className="w-full">
      {/* Map Controls */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Hazard Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hazard Types</label>
            <select
              multiple
              value={filters.hazardTypes}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                handleFilterChange('hazardTypes', values);
              }}
              className="w-48 p-2 border border-gray-300 rounded-lg text-sm"
            >
              {Object.entries(HAZARD_TYPES).map(([key, value]) => (
                <option key={key} value={value}>
                  {value.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select
              multiple
              value={filters.severities}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                handleFilterChange('severities', values);
              }}
              className="w-32 p-2 border border-gray-300 rounded-lg text-sm"
            >
              {Object.entries(ALERT_SEVERITY).map(([key, value]) => (
                <option key={key} value={value}>
                  {value.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select
              value={filters.timeRange}
              onChange={(e) => handleFilterChange('timeRange', e.target.value)}
              className="w-32 p-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => {
              loadHazards();
              loadAlerts();
            }}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <Icon name={loading ? "Loader2" : "RefreshCw"} className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapRef}
          style={{ height: height }}
          className="w-full rounded-lg border border-gray-300"
        />
        
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Loader2" className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-gray-700">Loading hazards...</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border">
        <h3 className="font-semibold text-gray-900 mb-3">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Hazard Types</h4>
            <div className="space-y-1">
              {Object.entries(HAZARD_TYPES).slice(0, 4).map(([key, value]) => (
                <div key={key} className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getSeverityColor('medium') }}></div>
                  {value.replace('_', ' ').toUpperCase()}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Severity Levels</h4>
            <div className="space-y-1">
              {Object.entries(ALERT_SEVERITY).map(([key, value]) => (
                <div key={key} className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getSeverityColor(value) }}></div>
                  {value.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Map Features</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
                Hazard Reports
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 border-2 border-red-500 bg-transparent"></div>
                Alert Areas
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Statistics</h4>
            <div className="text-xs text-gray-600">
              <p>Hazards: {hazards.length}</p>
              <p>Alerts: {alerts.length}</p>
              <p>Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveHazardMap;
