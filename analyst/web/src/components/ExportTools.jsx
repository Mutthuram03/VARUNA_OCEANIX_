import { useState } from 'react';
import { Download, FileText, Database, Calendar, Filter, CheckCircle, AlertCircle } from 'lucide-react';

// Mock data for export
const exportData = {
  hazardReports: [
    {
      id: 'HR-2024-001',
      hazardType: 'Flood',
      region: 'North America',
      severity: 'High',
      reportDate: '2024-01-15',
      status: 'Active',
      affectedArea: '250 sq km'
    },
    {
      id: 'HR-2024-002',
      hazardType: 'Wildfire',
      region: 'Europe',
      severity: 'Medium',
      reportDate: '2024-01-14',
      status: 'Monitoring',
      affectedArea: '180 sq km'
    }
  ],
  trendsData: {
    totalHazards: 728,
    peakSeason: 'Summer',
    mostActiveRegion: 'Asia Pacific',
    averageSeverity: 'Medium'
  },
  socialMediaData: {
    totalMentions: 12500,
    dominantSentiment: 'Calm',
    topKeyword: 'earthquake',
    mostActivePlatform: 'Twitter'
  }
};

export default function ExportTools({ darkMode }) {
  const [selectedDatasets, setSelectedDatasets] = useState(['hazardReports']);
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-12-31' });
  const [exportFormat, setExportFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  const datasetOptions = [
    {
      id: 'hazardReports',
      label: 'Hazard Reports',
      description: 'Complete database of anonymized hazard reports',
      icon: Database,
      recordCount: 728
    },
    {
      id: 'trendsData',
      label: 'Trends Analysis',
      description: 'Aggregated trend data and statistical insights',
      icon: Calendar,
      recordCount: 12
    },
    {
      id: 'socialMediaData',
      label: 'Social Media Analysis',
      description: 'Sentiment analysis and keyword trends',
      icon: FileText,
      recordCount: 156
    }
  ];

  const formatOptions = [
    { id: 'csv', label: 'CSV', description: 'Comma-separated values for spreadsheet applications' },
    { id: 'json', label: 'JSON', description: 'JavaScript Object Notation for programmatic use' }
  ];

  const handleDatasetToggle = (datasetId) => {
    setSelectedDatasets(prev => 
      prev.includes(datasetId) 
        ? prev.filter(id => id !== datasetId)
        : [...prev, datasetId]
    );
  };

  const generateCSV = (data, filename) => {
    if (Array.isArray(data)) {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).join(',')).join('\n');
      return `${headers}\n${rows}`;
    } else {
      const headers = Object.keys(data).join(',');
      const values = Object.values(data).join(',');
      return `${headers}\n${values}`;
    }
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus(null);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      selectedDatasets.forEach(datasetId => {
        const dataset = exportData[datasetId];
        const timestamp = new Date().toISOString().split('T')[0];
        
        if (exportFormat === 'csv') {
          const csvContent = generateCSV(dataset, `${datasetId}_${timestamp}.csv`);
          downloadFile(csvContent, `${datasetId}_${timestamp}.csv`, 'text/csv');
        } else {
          const jsonContent = JSON.stringify(dataset, null, 2);
          downloadFile(jsonContent, `${datasetId}_${timestamp}.json`, 'application/json');
        }
      });

      setExportStatus({ type: 'success', message: 'Export completed successfully!' });
    } catch (error) {
      setExportStatus({ type: 'error', message: 'Export failed. Please try again.' });
    } finally {
      setIsExporting(false);
    }
  };

  const getTotalRecords = () => {
    return selectedDatasets.reduce((total, datasetId) => {
      const dataset = datasetOptions.find(d => d.id === datasetId);
      return total + (dataset ? dataset.recordCount : 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Export Research Data
        </h3>
        <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Download anonymized research data in CSV or JSON format
        </p>
      </div>

      {/* Dataset Selection */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center mb-4">
          <Database size={20} className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <h4 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Select Datasets
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {datasetOptions.map((dataset) => {
            const Icon = dataset.icon;
            const isSelected = selectedDatasets.includes(dataset.id);
            
            return (
              <div
                key={dataset.id}
                onClick={() => handleDatasetToggle(dataset.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? darkMode
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-blue-500 bg-blue-50'
                    : darkMode
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon 
                    size={24} 
                    className={`${isSelected 
                      ? darkMode ? 'text-blue-400' : 'text-blue-600'
                      : darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} 
                  />
                  {isSelected && (
                    <CheckCircle 
                      size={20} 
                      className={darkMode ? 'text-blue-400' : 'text-blue-600'} 
                    />
                  )}
                </div>
                
                <h5 className={`font-medium mb-2 ${
                  isSelected 
                    ? darkMode ? 'text-blue-400' : 'text-blue-700'
                    : darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {dataset.label}
                </h5>
                
                <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {dataset.description}
                </p>
                
                <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {dataset.recordCount} records
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Configuration */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center mb-4">
          <Filter size={20} className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <h4 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Export Configuration
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Range */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  From
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  To
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Export Format
            </label>
            <div className="space-y-2">
              {formatOptions.map((format) => (
                <label key={format.id} className="flex items-start cursor-pointer">
                  <input
                    type="radio"
                    name="exportFormat"
                    value={format.id}
                    checked={exportFormat === format.id}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {format.label}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {format.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Summary */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Export Summary
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {selectedDatasets.length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Selected Datasets
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {getTotalRecords()}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Total Records
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {exportFormat.toUpperCase()}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Export Format
            </div>
          </div>
        </div>

        {/* Export Status */}
        {exportStatus && (
          <div className={`mb-4 p-4 rounded-lg flex items-center ${
            exportStatus.type === 'success'
              ? darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-800'
              : darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-800'
          }`}>
            {exportStatus.type === 'success' ? (
              <CheckCircle size={20} className="mr-2" />
            ) : (
              <AlertCircle size={20} className="mr-2" />
            )}
            {exportStatus.message}
          </div>
        )}

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={selectedDatasets.length === 0 || isExporting}
          className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedDatasets.length === 0 || isExporting
              ? darkMode 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Download size={20} className="mr-2" />
          {isExporting ? 'Exporting...' : `Export ${selectedDatasets.length} Dataset${selectedDatasets.length !== 1 ? 's' : ''}`}
        </button>
      </div>

      {/* Usage Guidelines */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Data Usage Guidelines
        </h4>
        
        <div className={`space-y-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
            <div>All data is anonymized and aggregated for research purposes only.</div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
            <div>Data should not be used for commercial purposes without proper authorization.</div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
            <div>Please cite this portal when using the data in academic publications.</div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
            <div>Data is provided as-is without warranty. Verify accuracy before critical use.</div>
          </div>
        </div>
      </div>
    </div>
  );
}