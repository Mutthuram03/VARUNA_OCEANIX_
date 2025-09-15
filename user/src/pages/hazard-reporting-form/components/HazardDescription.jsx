import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const HazardDescription = ({ 
  value, 
  onChange, 
  error,
  maxLength = 500,
  className = '' 
}) => {
  const [charCount, setCharCount] = useState(value?.length || 0);

  const handleChange = (e) => {
    const newValue = e?.target?.value;
    setCharCount(newValue?.length);
    onChange(newValue);
  };

  const getCharCountColor = () => {
    const percentage = (charCount / maxLength) * 100;
    if (percentage >= 90) return 'text-error';
    if (percentage >= 75) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <Icon name="FileText" size={20} className="text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Description</h3>
        <span className="text-sm text-muted-foreground">(Optional)</span>
      </div>

      <div className="space-y-2">
        <textarea
          value={value || ''}
          onChange={handleChange}
          maxLength={maxLength}
          placeholder="Describe the hazard in detail... (e.g., wave height, affected area, severity, time observed, etc.)"
          className="w-full min-h-[120px] px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background resize-vertical"
          rows={5}
        />
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="Info" size={12} />
              <span>Include time, severity, and affected area if known</span>
            </div>
          </div>
          
          <div className={`font-mono ${getCharCountColor()}`}>
            {charCount}/{maxLength}
          </div>
        </div>
      </div>

      {/* Helpful Tips */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
          <Icon name="Lightbulb" size={16} className="text-accent" />
          <span>Helpful Tips</span>
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Include the time you observed the hazard</li>
          <li>• Describe the severity level (mild, moderate, severe)</li>
          <li>• Mention affected area size if visible</li>
          <li>• Note any immediate dangers to people or property</li>
          <li>• Include weather conditions if relevant</li>
        </ul>
      </div>

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

export default HazardDescription;