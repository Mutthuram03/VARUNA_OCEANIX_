import React from 'react';
import Icon from '../../../components/AppIcon';

const MapLegend = () => {

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Map Legend</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Hazard Types */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Hazard Types</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">High Wave</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Flood</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Oil Spill</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Dead Fish</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Coastal Erosion</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-indigo-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Unusual Tide</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-pink-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Marine Pollution</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Other</span>
            </div>
          </div>
        </div>

        {/* Severity Levels */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Severity Levels</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-600 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Critical</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">High</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Medium</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Low</span>
            </div>
          </div>
        </div>

        {/* Map Features */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Map Features</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Hazard Reports</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-red-500 bg-transparent rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Alert Areas</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Verified Reports</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;