import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const HazardTypeSelector = ({ 
  value, 
  onChange, 
  error, 
  required = true,
  className = '' 
}) => {
  const hazardTypes = [
    { 
      value: 'high-wave', 
      label: 'High Wave', 
      description: 'Dangerous wave conditions threatening coastal safety'
    },
    { 
      value: 'flood', 
      label: 'Coastal Flood', 
      description: 'Water overflow affecting coastal areas'
    },
    { 
      value: 'oil-spill', 
      label: 'Oil Spill', 
      description: 'Marine pollution from oil discharge'
    },
    { 
      value: 'dead-fish', 
      label: 'Dead Fish/Marine Life', 
      description: 'Unusual marine life mortality events'
    },
    { 
      value: 'debris', 
      label: 'Marine Debris', 
      description: 'Floating debris posing navigation hazards'
    },
    { 
      value: 'algae-bloom', 
      label: 'Algae Bloom', 
      description: 'Harmful algal blooms affecting water quality'
    },
    { 
      value: 'erosion', 
      label: 'Coastal Erosion', 
      description: 'Severe shoreline erosion or land loss'
    },
    { 
      value: 'other', 
      label: 'Other Hazard', 
      description: 'Other coastal or marine hazards not listed'
    }
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <Icon name="AlertTriangle" size={20} className="text-warning" />
        <h3 className="text-lg font-semibold text-foreground">Hazard Type</h3>
        {required && <span className="text-error text-sm">*</span>}
      </div>
      <Select
        label="Select the type of hazard you're reporting"
        placeholder="Choose hazard type..."
        options={hazardTypes}
        value={value}
        onChange={onChange}
        error={error}
        required={required}
        searchable
        className="w-full"
      />
      {value && (
        <div className="mt-3 p-3 bg-muted rounded-lg border border-border">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {hazardTypes?.find(type => type?.value === value)?.label}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {hazardTypes?.find(type => type?.value === value)?.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HazardTypeSelector;