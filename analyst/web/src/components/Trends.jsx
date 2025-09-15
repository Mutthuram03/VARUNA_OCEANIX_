import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Calendar, TrendingUp, MapPin, Clock } from 'lucide-react';

// Mock data for trends
const hazardFrequencyData = [
  { month: 'Jan', floods: 12, wildfires: 8, earthquakes: 3, hurricanes: 2, total: 25 },
  { month: 'Feb', floods: 15, wildfires: 6, earthquakes: 5, hurricanes: 1, total: 27 },
  { month: 'Mar', floods: 18, wildfires: 12, earthquakes: 4, hurricanes: 3, total: 37 },
  { month: 'Apr', floods: 22, wildfires: 15, earthquakes: 2, hurricanes: 4, total: 43 },
  { month: 'May', floods: 28, wildfires: 25, earthquakes: 6, hurricanes: 5, total: 64 },
  { month: 'Jun', floods: 35, wildfires: 32, earthquakes: 3, hurricanes: 8, total: 78 },
  { month: 'Jul', floods: 42, wildfires: 45, earthquakes: 7, hurricanes: 12, total: 106 },
  { month: 'Aug', floods: 38, wildfires: 52, earthquakes: 4, hurricanes: 15, total: 109 },
  { month: 'Sep', floods: 32, wildfires: 38, earthquakes: 8, hurricanes: 18, total: 96 },
  { month: 'Oct', floods: 25, wildfires: 28, earthquakes: 5, hurricanes: 12, total: 70 },
  { month: 'Nov', floods: 18, wildfires: 15, earthquakes: 3, hurricanes: 6, total: 42 },
  { month: 'Dec', floods: 14, wildfires: 10, earthquakes: 4, hurricanes: 3, total: 31 }
];

const hotspotData = [
  { region: 'North America', jan: 45, feb: 52, mar: 48, apr: 55, may: 62, jun: 68 },
  { region: 'Europe', jan: 32, feb: 28, mar: 35, apr: 42, may: 38, jun: 45 },
  { region: 'Asia Pacific', jan: 58, feb: 65, mar: 72, apr: 68, may: 75, jun: 82 },
  { region: 'South America', jan: 28, feb: 32, mar: 35, apr: 38, may: 42, jun: 45 },
  { region: 'Africa', jan: 22, feb: 25, mar: 28, apr: 32, may: 35, jun: 38 }
];

const seasonalData = [
  { season: 'Spring', floods: 65, wildfires: 33, earthquakes: 15, hurricanes: 12 },
  { season: 'Summer', floods: 115, wildfires: 129, earthquakes: 14, hurricanes: 35 },
  { season: 'Fall', floods: 75, wildfires: 81, earthquakes: 16, hurricanes: 36 },
  { season: 'Winter', floods: 41, wildfires: 24, earthquakes: 12, hurricanes: 6 }
];

const severityDistribution = [
  { name: 'Critical', value: 15, color: '#DC2626' },
  { name: 'High', value: 28, color: '#EA580C' },
  { name: 'Medium', value: 35, color: '#D97706' },
  { name: 'Low', value: 22, color: '#16A34A' }
];

export default function Trends({ darkMode }) {
  const [selectedChart, setSelectedChart] = useState('frequency');

  const chartOptions = [
    { id: 'frequency', label: 'Hazard Frequency', icon: TrendingUp },
    { id: 'hotspots', label: 'Regional Hotspots', icon: MapPin },
    { id: 'seasonal', label: 'Seasonal Patterns', icon: Calendar },
    { id: 'severity', label: 'Severity Distribution', icon: Clock }
  ];

  const renderChart = () => {
    switch (selectedChart) {
      case 'frequency':
        return (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hazardFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  dataKey="month" 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                />
                <YAxis 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    color: darkMode ? '#F3F4F6' : '#1F2937'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="floods" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="wildfires" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="earthquakes" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="hurricanes" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'hotspots':
        return (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hotspotData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  dataKey="region" 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    color: darkMode ? '#F3F4F6' : '#1F2937'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="jan" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="feb" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="mar" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                <Area type="monotone" dataKey="apr" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                <Area type="monotone" dataKey="may" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="jun" stackId="1" stroke="#EC4899" fill="#EC4899" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'seasonal':
        return (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonalData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  dataKey="season" 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                />
                <YAxis 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    color: darkMode ? '#F3F4F6' : '#1F2937'
                  }}
                />
                <Legend />
                <Bar dataKey="floods" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="wildfires" fill="#EF4444" radius={[2, 2, 0, 0]} />
                <Bar dataKey="earthquakes" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                <Bar dataKey="hurricanes" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'severity':
        return (
          <div className="h-96 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    color: darkMode ? '#F3F4F6' : '#1F2937'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getChartDescription = () => {
    switch (selectedChart) {
      case 'frequency':
        return 'Monthly hazard occurrence trends showing seasonal patterns and hazard type distribution over time.';
      case 'hotspots':
        return 'Regional hazard evolution showing how different areas experience varying levels of hazard activity.';
      case 'seasonal':
        return 'Seasonal distribution of hazard types revealing patterns in natural disaster occurrence.';
      case 'severity':
        return 'Distribution of hazard severity levels across all reported incidents.';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Hazard Trends Analysis
        </h3>
        <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Interactive charts showing hazard patterns and trends
        </p>
      </div>

      {/* Chart Selection */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Select Analysis Type
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {chartOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setSelectedChart(option.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedChart === option.id
                    ? darkMode
                      ? 'border-blue-500 bg-blue-900/20 text-blue-400'
                      : 'border-blue-500 bg-blue-50 text-blue-700'
                    : darkMode
                      ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900'
                }`}
              >
                <Icon size={24} className="mx-auto mb-2" />
                <div className="text-sm font-medium">{option.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Display */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="mb-6">
          <h4 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {chartOptions.find(option => option.id === selectedChart)?.label}
          </h4>
          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {getChartDescription()}
          </p>
        </div>
        
        {renderChart()}
      </div>

      {/* Key Insights */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Key Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              728
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Total Hazards This Year
            </div>
            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              +12% from last year
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              Summer
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Peak Hazard Season
            </div>
            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              283 incidents recorded
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              Asia Pacific
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Most Active Region
            </div>
            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              425 incidents this year
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}