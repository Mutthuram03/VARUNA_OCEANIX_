import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const AlertCard = ({ alert, onMarkResolved, onRequestUpdate, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'high':
        return {
          border: 'border-l-4 border-error',
          bg: 'bg-error/10',
          icon: 'text-error',
          badge: 'bg-error text-error-foreground'
        };
      case 'medium':
        return {
          border: 'border-l-4 border-warning',
          bg: 'bg-warning/10',
          icon: 'text-warning',
          badge: 'bg-warning text-warning-foreground'
        };
      case 'low':
        return {
          border: 'border-l-4 border-success',
          bg: 'bg-success/10',
          icon: 'text-success',
          badge: 'bg-success text-success-foreground'
        };
      default:
        return {
          border: 'border-l-4 border-primary',
          bg: 'bg-primary/10',
          icon: 'text-primary',
          badge: 'bg-primary text-primary-foreground'
        };
    }
  };

  const getHazardIcon = (type) => {
    switch (type) {
      case 'High Wave': return 'Waves';
      case 'Flood': return 'CloudRain';
      case 'Oil Spill': return 'Droplets';
      case 'Dead Fish': return 'Fish';
      case 'Cyclone': return 'Wind';
      case 'Tsunami': return 'Waves';
      default: return 'AlertTriangle';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return 'CheckCircle';
      case 'pending': return 'Clock';
      case 'investigating': return 'Search';
      case 'resolved': return 'CheckCircle2';
      default: return 'AlertCircle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-success';
      case 'pending': return 'text-warning';
      case 'investigating': return 'text-primary';
      case 'resolved': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const formatDistance = (distance) => {
    if (distance < 1) return `${Math.round(distance * 1000)}m away`;
    return `${distance?.toFixed(1)}km away`;
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const styles = getSeverityStyles(alert?.severity);

  return (
    <div className={`bg-card rounded-lg shadow-ocean ${styles?.border} ${styles?.bg} transition-all duration-200 hover:shadow-ocean-lg ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-card ${styles?.icon}`}>
              <Icon name={getHazardIcon(alert?.type)} size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{alert?.type}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="MapPin" size={14} />
                <span>{alert?.location}</span>
                {alert?.distance && (
                  <>
                    <span>•</span>
                    <span>{formatDistance(alert?.distance)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles?.badge}`}>
              {alert?.severity?.toUpperCase()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              iconSize={16}
              className="p-1"
            />
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-2 mb-3">
          <p className="text-sm text-foreground line-clamp-2">
            {alert?.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={12} />
                <span>{formatDate(alert?.submittedAt)}</span>
              </div>
              <div className={`flex items-center space-x-1 ${getStatusColor(alert?.status)}`}>
                <Icon name={getStatusIcon(alert?.status)} size={12} />
                <span className="capitalize">{alert?.status}</span>
              </div>
            </div>
            
            {alert?.validUntil && (
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>Valid until {formatDate(alert?.validUntil)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-border pt-3 space-y-3">
            {/* Additional Details */}
            {alert?.additionalInfo && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Additional Information</h4>
                <p className="text-sm text-muted-foreground">{alert?.additionalInfo}</p>
              </div>
            )}

            {/* Photos */}
            {alert?.photos && alert?.photos?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Attached Photos</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {alert?.photos?.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={photo?.url}
                        alt={`Hazard photo ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INCOIS Validation */}
            {alert?.incoisValidation && (
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Shield" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">INCOIS Validation</span>
                </div>
                <p className="text-sm text-muted-foreground">{alert?.incoisValidation?.comment}</p>
                <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                  <span>Validated by: {alert?.incoisValidation?.officer}</span>
                  <span>•</span>
                  <span>{formatDate(alert?.incoisValidation?.validatedAt)}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Link to={`/interactive-risk-map?location=${encodeURIComponent(alert?.location)}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Map"
                    iconSize={14}
                  >
                    View on Map
                  </Button>
                </Link>
                
                {alert?.status !== 'resolved' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRequestUpdate(alert?.id)}
                    iconName="RefreshCw"
                    iconSize={14}
                  >
                    Request Update
                  </Button>
                )}
              </div>

              {alert?.status !== 'resolved' && alert?.canMarkResolved && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => onMarkResolved(alert?.id)}
                  iconName="Check"
                  iconSize={14}
                >
                  Mark Resolved
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertCard;