import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FilterPanel = ({
  filters = {},
  onFilterChange = () => {},
  totalReports = 0,
  filteredReports = 0
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Hazard type options (matching the main page filters)
  const hazardTypeOptions = [
    { value: 'HIGH WAVE', label: 'High Wave', icon: 'Waves' },
    { value: 'FLOOD', label: 'Flood', icon: 'CloudRain' },
    { value: 'OIL SPILL', label: 'Oil Spill', icon: 'Droplets' },
    { value: 'DEAD FISH', label: 'Dead Fish', icon: 'Fish' },
    { value: 'COASTAL EROSION', label: 'Coastal Erosion', icon: 'Mountain' },
    { value: 'UNUSUAL TIDE', label: 'Unusual Tide', icon: 'Tide' },
    { value: 'MARINE POLLUTION', label: 'Marine Pollution', icon: 'AlertTriangle' },
    { value: 'OTHER', label: 'Other', icon: 'HelpCircle' }
  ];

  // Severity level options
  const severityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical', color: 'text-red-600' }
  ];

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Reports' },
    { value: 'active', label: 'Active Only' },
    { value: 'resolved', label: 'Resolved Only' },
    { value: 'pending', label: 'Pending Verification' }
  ];

  // Handle hazard type selection
  const handleHazardTypeChange = (selectedTypes) => {
    onFilterChange('hazardTypes', selectedTypes);
  };

  // Handle severity level selection
  const handleSeverityChange = (selectedLevels) => {
    onFilterChange('severities', selectedLevels);
  };

  // Handle time range selection
  const handleTimeRangeChange = (value) => {
    onFilterChange('timeRange', value);
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFilterChange('hazardTypes', []);
    onFilterChange('severities', []);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Map Filters</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Showing {filteredReports} of {totalReports} reports</span>
          <button
            onClick={clearAllFilters}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hazard Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hazard Types</label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {hazardTypeOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.hazardTypes?.includes(option.value)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...(filters.hazardTypes || []), option.value]
                      : (filters.hazardTypes || []).filter(type => type !== option.value);
                    handleHazardTypeChange(updated);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Severity Levels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
          <div className="space-y-2">
            {severityOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.severities?.includes(option.value)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...(filters.severities || []), option.value]
                      : (filters.severities || []).filter(sev => sev !== option.value);
                    handleSeverityChange(updated);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`ml-2 text-sm ${option.color}`}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Time Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
          <select
            value={filters.timeRange || '24h'}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;