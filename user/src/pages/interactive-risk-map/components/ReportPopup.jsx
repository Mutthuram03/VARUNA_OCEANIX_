import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ReportPopup = ({
  report = null,
  onClose = () => {}
}) => {
  if (!report) return null;

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Hazard Report</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Icon name="X" size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${getSeverityColor(report.severity)}`}>
              {report.severity?.toUpperCase()} - {report.hazardType}
            </span>
          </div>

          <div className="flex items-start space-x-2">
            <Icon name="MapPin" size={16} className="text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-700">{report.location?.address || 'Unknown location'}</p>
              <p className="text-xs text-gray-500">
                {report.location?.latitude?.toFixed(6)}, {report.location?.longitude?.toFixed(6)}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Icon name="FileText" size={16} className="text-gray-400 mt-1" />
            <p className="text-sm text-gray-700">{report.description || 'No description'}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {formatDate(report.createdAt?.toDate?.() || report.createdAt)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={16} className="text-gray-400" />
            <span className={`text-sm font-medium ${
              report.status === 'verified' ? 'text-green-600' :
              report.status === 'pending' ? 'text-yellow-600' :
              report.status === 'investigating' ? 'text-blue-600' :
              'text-gray-600'
            }`}>
              {report.status?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPopup;