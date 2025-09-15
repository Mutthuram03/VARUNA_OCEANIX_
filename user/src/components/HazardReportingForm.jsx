import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { useFileUpload } from '../hooks/useFileUpload.js';
import { useOfflineStorage } from '../hooks/useOfflineStorage.js';
import { HazardReportService } from '../services/firebase.js';
import { HAZARD_TYPES, ALERT_SEVERITY } from '../../../shared/firestore-schemas.js';
import Icon from './AppIcon';

const HazardReportingForm = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const { location, error: locationError, getCurrentLocation, getAddressFromCoords } = useGeolocation();
  const { uploadFiles, uploading, error: uploadError, validateFiles } = useFileUpload();
  const { isOnline, addOfflineReport, pendingReports } = useOfflineStorage();
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [address, setAddress] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const hazardType = watch('hazardType');
  const severity = watch('severity');

  useEffect(() => {
    if (location) {
      getAddressFromCoords(location.latitude, location.longitude).then(setAddress);
    }
  }, [location, getAddressFromCoords]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validation = validateFiles(files);
    
    if (validation.allValid) {
      setSelectedFiles(validation.validFiles);
    } else {
      alert('Some files are invalid: ' + validation.errors.map(e => e.error).join(', '));
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmitForm = async (data) => {
    if (!location) {
      alert('Please allow location access to submit a report');
      return;
    }

    setSubmitting(true);

    try {
      // Upload files if any
      let mediaUrls = { images: [], videos: [], audio: [] };
      if (selectedFiles.length > 0) {
        const uploadResult = await uploadFiles(selectedFiles, `hazard-reports/${Date.now()}`);
        if (uploadResult.success) {
          uploadResult.uploads.forEach(upload => {
            const fileType = upload.file.type.split('/')[0];
            if (fileType === 'image') mediaUrls.images.push(upload.downloadURL);
            else if (fileType === 'video') mediaUrls.videos.push(upload.downloadURL);
            else if (fileType === 'audio') mediaUrls.audio.push(upload.downloadURL);
          });
        }
      }

      // Prepare report data
      const reportData = {
        reporterId: 'anonymous', // Will be updated when auth is implemented
        reporterName: data.reporterName || 'Anonymous',
        reporterPhone: data.reporterPhone || '',
        hazardType: data.hazardType,
        title: data.title,
        description: data.description,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: address,
          accuracy: location.accuracy
        },
        media: mediaUrls,
        severity: data.severity,
        isEmergency: isEmergency,
        isPublic: true,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        weatherConditions: {
          temperature: data.temperature ? parseFloat(data.temperature) : null,
          humidity: data.humidity ? parseFloat(data.humidity) : null,
          windSpeed: data.windSpeed ? parseFloat(data.windSpeed) : null,
          visibility: data.visibility ? parseFloat(data.visibility) : null
        }
      };

      let result;
      
      if (isOnline) {
        // Submit online
        result = await HazardReportService.createReport(reportData);
        
        if (result.success) {
          alert('Report submitted successfully!');
          onSubmit?.(result.reportId);
        } else {
          alert('Error submitting report: ' + result.error);
        }
      } else {
        // Save offline
        result = addOfflineReport(reportData);
        
        if (result.success) {
          alert('Report saved offline and will be submitted when you\'re back online!');
          onSubmit?.(result.reportId);
        } else {
          alert('Error saving report offline');
        }
      }
    } catch (error) {
      alert('Error submitting report: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Ocean Hazard</h2>
        <p className="text-gray-600">Help keep our coastal communities safe by reporting hazards you observe.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        {/* Emergency Toggle */}
        <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <input
            type="checkbox"
            id="isEmergency"
            checked={isEmergency}
            onChange={(e) => setIsEmergency(e.target.checked)}
            className="w-5 h-5 text-red-600 border-red-300 rounded focus:ring-red-500"
          />
          <label htmlFor="isEmergency" className="text-red-800 font-medium">
            This is an emergency requiring immediate attention
          </label>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Location</h3>
          
          {locationError && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">{locationError}</p>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="mt-2 text-yellow-600 hover:text-yellow-800 text-sm underline"
              >
                Try again
              </button>
            </div>
          )}

          {location && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                <Icon name="MapPin" className="inline w-4 h-4 mr-1" />
                Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                {address && <span className="block mt-1">{address}</span>}
              </p>
            </div>
          )}
        </div>

        {/* Hazard Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hazard Type *
          </label>
          <select
            {...register('hazardType', { required: 'Please select a hazard type' })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select hazard type</option>
            {Object.entries(HAZARD_TYPES).map(([key, value]) => (
              <option key={key} value={value}>
                {value.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
          {errors.hazardType && (
            <p className="mt-1 text-sm text-red-600">{errors.hazardType.message}</p>
          )}
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severity Level *
          </label>
          <select
            {...register('severity', { required: 'Please select severity level' })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select severity</option>
            {Object.entries(ALERT_SEVERITY).map(([key, value]) => (
              <option key={key} value={value}>
                {value.toUpperCase()}
              </option>
            ))}
          </select>
          {errors.severity && (
            <p className="mt-1 text-sm text-red-600">{errors.severity.message}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Title *
          </label>
          <input
            type="text"
            {...register('title', { required: 'Please enter a title' })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description of the hazard"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description *
          </label>
          <textarea
            {...register('description', { required: 'Please provide a description' })}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe what you observed, when it happened, and any other relevant details..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos/Videos (Optional)
          </label>
          <input
            type="file"
            multiple
            accept="image/*,video/*,audio/*"
            onChange={handleFileSelect}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          
          {selectedFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Icon name="X" className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reporter Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              {...register('reporterName')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Anonymous if left blank"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              {...register('reporterPhone')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="For follow-up if needed"
            />
          </div>
        </div>

        {/* Weather Conditions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Weather Conditions (Optional)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
              <input
                type="number"
                {...register('temperature')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Humidity (%)</label>
              <input
                type="number"
                {...register('humidity')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="70"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wind Speed (km/h)</label>
              <input
                type="number"
                {...register('windSpeed')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visibility (km)</label>
              <input
                type="number"
                {...register('visibility')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (Optional)
          </label>
          <input
            type="text"
            {...register('tags')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="flooding, coastal, emergency (comma-separated)"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={submitting || uploading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {submitting ? (
              <>
                <Icon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Icon name="Send" className="w-5 h-5 mr-2" />
                Submit Report
              </>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>

        {uploadError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">Upload error: {uploadError}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default HazardReportingForm;
