import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const AlertFilters = ({ 
  filters, 
  onFiltersChange, 
  alertCount = 0,
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hazardTypeOptions = [
    { value: 'all', label: 'All Hazard Types' },
    { value: 'High Wave', label: 'High Wave' },
    { value: 'Flood', label: 'Flood' },
    { value: 'Oil Spill', label: 'Oil Spill' },
    { value: 'Dead Fish', label: 'Dead Fish' },
    { value: 'Cyclone', label: 'Cyclone' },
    { value: 'Tsunami', label: 'Tsunami' },
    { value: 'Other', label: 'Other' }
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'high', label: 'High Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'low', label: 'Low Risk' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'investigating', label: 'Investigating' },
    { value: 'verified', label: 'Verified' },
    { value: 'resolved', label: 'Resolved' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'severity-desc', label: 'High Severity First' },
    { value: 'distance-asc', label: 'Nearest First' }
  ];

  const radiusOptions = [
    { value: '5', label: 'Within 5km' },
    { value: '10', label: 'Within 10km' },
    { value: '25', label: 'Within 25km' },
    { value: '50', label: 'Within 50km' },
    { value: 'all', label: 'All Locations' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      hazardType: 'all',
      severity: 'all',
      status: 'all',
      dateFrom: '',
      dateTo: '',
      radius: 'all',
      sortBy: 'date-desc'
    });
  };

  const hasActiveFilters = () => {
    return filters?.hazardType !== 'all' || 
           filters?.severity !== 'all' || 
           filters?.status !== 'all' ||
           filters?.dateFrom || 
           filters?.dateTo || 
           filters?.radius !== 'all';
  };

  return (
    <div className={`bg-card rounded-lg shadow-ocean border border-border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <div>
            <h3 className="font-semibold text-foreground">Filter Alerts</h3>
            <p className="text-sm text-muted-foreground">
              {alertCount} alert{alertCount !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconSize={14}
            >
              Clear All
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconSize={16}
            className="lg:hidden"
          />
        </div>
      </div>
      {/* Filters Content */}
      <div className={`p-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Hazard Type */}
          <Select
            label="Hazard Type"
            options={hazardTypeOptions}
            value={filters?.hazardType}
            onChange={(value) => handleFilterChange('hazardType', value)}
          />

          {/* Severity */}
          <Select
            label="Severity"
            options={severityOptions}
            value={filters?.severity}
            onChange={(value) => handleFilterChange('severity', value)}
          />

          {/* Status */}
          <Select
            label="Status"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
          />

          {/* Sort By */}
          <Select
            label="Sort By"
            options={sortOptions}
            value={filters?.sortBy}
            onChange={(value) => handleFilterChange('sortBy', value)}
          />

          {/* Date From */}
          <Input
            label="From Date"
            type="date"
            value={filters?.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
          />

          {/* Date To */}
          <Input
            label="To Date"
            type="date"
            value={filters?.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
          />

          {/* Location Radius */}
          <Select
            label="Location Range"
            options={radiusOptions}
            value={filters?.radius}
            onChange={(value) => handleFilterChange('radius', value)}
          />

          {/* Search */}
          <Input
            label="Search"
            type="search"
            placeholder="Search alerts..."
            value={filters?.search || ''}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
          />
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters() && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <span className="text-sm font-medium text-foreground">Active filters:</span>
              
              {filters?.hazardType !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary text-primary-foreground">
                  {hazardTypeOptions?.find(opt => opt?.value === filters?.hazardType)?.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFilterChange('hazardType', 'all')}
                    className="ml-1 p-0 h-4 w-4"
                  >
                    <Icon name="X" size={12} />
                  </Button>
                </span>
              )}

              {filters?.severity !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                  {severityOptions?.find(opt => opt?.value === filters?.severity)?.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFilterChange('severity', 'all')}
                    className="ml-1 p-0 h-4 w-4"
                  >
                    <Icon name="X" size={12} />
                  </Button>
                </span>
              )}

              {filters?.status !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent text-accent-foreground">
                  {statusOptions?.find(opt => opt?.value === filters?.status)?.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFilterChange('status', 'all')}
                    className="ml-1 p-0 h-4 w-4"
                  >
                    <Icon name="X" size={12} />
                  </Button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertFilters;