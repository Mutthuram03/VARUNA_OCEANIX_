import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { MessageSquare, Hash, TrendingUp, Users, AlertTriangle, Heart, Frown, Meh } from 'lucide-react';

// Mock data for social media analysis
const sentimentData = [
  { name: 'Panic', value: 35, color: '#DC2626', icon: AlertTriangle },
  { name: 'Calm', value: 45, color: '#16A34A', icon: Heart },
  { name: 'Neutral', value: 20, color: '#6B7280', icon: Meh }
];

const trendingKeywords = [
  { word: 'earthquake', frequency: 1250, sentiment: 'panic', size: 48 },
  { word: 'evacuation', frequency: 980, sentiment: 'panic', size: 42 },
  { word: 'safety', frequency: 850, sentiment: 'calm', size: 38 },
  { word: 'wildfire', frequency: 720, sentiment: 'panic', size: 34 },
  { word: 'flood', frequency: 680, sentiment: 'neutral', size: 32 },
  { word: 'emergency', frequency: 620, sentiment: 'panic', size: 30 },
  { word: 'shelter', frequency: 580, sentiment: 'calm', size: 28 },
  { word: 'rescue', frequency: 540, sentiment: 'calm', size: 26 },
  { word: 'hurricane', frequency: 480, sentiment: 'panic', size: 24 },
  { word: 'warning', frequency: 420, sentiment: 'neutral', size: 22 },
  { word: 'prepare', frequency: 380, sentiment: 'calm', size: 20 },
  { word: 'damage', frequency: 340, sentiment: 'panic', size: 18 },
  { word: 'help', frequency: 320, sentiment: 'calm', size: 16 },
  { word: 'alert', frequency: 280, sentiment: 'neutral', size: 14 },
  { word: 'support', frequency: 240, sentiment: 'calm', size: 12 }
];

const platformData = [
  { platform: 'Twitter', panic: 45, calm: 35, neutral: 20 },
  { platform: 'Facebook', panic: 30, calm: 50, neutral: 20 },
  { platform: 'Instagram', panic: 25, calm: 55, neutral: 20 },
  { platform: 'Reddit', panic: 40, calm: 40, neutral: 20 },
  { platform: 'TikTok', panic: 35, calm: 45, neutral: 20 }
];

const timelineData = [
  { time: '00:00', panic: 15, calm: 25, neutral: 10 },
  { time: '04:00', panic: 12, calm: 20, neutral: 8 },
  { time: '08:00', panic: 35, calm: 45, neutral: 20 },
  { time: '12:00', panic: 42, calm: 38, neutral: 25 },
  { time: '16:00', panic: 38, calm: 42, neutral: 22 },
  { time: '20:00', panic: 45, calm: 35, neutral: 18 },
];

export default function SocialMediaAnalysis({ darkMode }) {
  const [selectedView, setSelectedView] = useState('sentiment');

  const viewOptions = [
    { id: 'sentiment', label: 'Sentiment Overview', icon: MessageSquare },
    { id: 'keywords', label: 'Trending Keywords', icon: Hash },
    { id: 'platforms', label: 'Platform Analysis', icon: Users },
    { id: 'timeline', label: 'Timeline Analysis', icon: TrendingUp }
  ];

  const getWordColor = (sentiment) => {
    switch (sentiment) {
      case 'panic': return darkMode ? '#FCA5A5' : '#DC2626';
      case 'calm': return darkMode ? '#86EFAC' : '#16A34A';
      case 'neutral': return darkMode ? '#D1D5DB' : '#6B7280';
      default: return darkMode ? '#D1D5DB' : '#6B7280';
    }
  };

  const renderWordCloud = () => {
    return (
      <div className="relative h-96 flex flex-wrap items-center justify-center p-8 overflow-hidden">
        {trendingKeywords.map((keyword, index) => (
          <div
            key={keyword.word}
            className="m-2 cursor-pointer transition-transform hover:scale-110"
            style={{
              fontSize: `${keyword.size}px`,
              color: getWordColor(keyword.sentiment),
              fontWeight: keyword.frequency > 500 ? 'bold' : 'normal',
              transform: `rotate(${(index % 3 - 1) * 15}deg)`,
            }}
            title={`${keyword.word}: ${keyword.frequency} mentions (${keyword.sentiment})`}
          >
            {keyword.word}
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (selectedView) {
      case 'sentiment':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96">
              <h5 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Overall Sentiment Distribution
              </h5>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
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
            
            <div className="space-y-4">
              <h5 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Sentiment Breakdown
              </h5>
              {sentimentData.map((sentiment) => {
                const Icon = sentiment.icon;
                return (
                  <div key={sentiment.name} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Icon size={24} style={{ color: sentiment.color }} className="mr-3" />
                        <div>
                          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {sentiment.name}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {sentiment.value}% of mentions
                          </div>
                        </div>
                      </div>
                      <div className={`text-2xl font-bold`} style={{ color: sentiment.color }}>
                        {sentiment.value}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      
      case 'keywords':
        return (
          <div>
            <h5 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Trending Hazard Keywords
            </h5>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
              {renderWordCloud()}
            </div>
            <div className="mt-6">
              <h6 className={`text-md font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Top Keywords by Frequency
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {trendingKeywords.slice(0, 9).map((keyword, index) => (
                  <div key={keyword.word} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                    <div>
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        #{keyword.word}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {keyword.frequency} mentions
                      </div>
                    </div>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getWordColor(keyword.sentiment) }}
                      title={`Sentiment: ${keyword.sentiment}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'platforms':
        return (
          <div className="h-96">
            <h5 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Sentiment by Platform
            </h5>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  dataKey="platform" 
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
                <Bar dataKey="panic" fill="#DC2626" radius={[2, 2, 0, 0]} />
                <Bar dataKey="calm" fill="#16A34A" radius={[2, 2, 0, 0]} />
                <Bar dataKey="neutral" fill="#6B7280" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'timeline':
        return (
          <div className="h-96">
            <h5 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Sentiment Timeline (24 Hours)
            </h5>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  dataKey="time" 
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
                <Bar dataKey="panic" stackId="a" fill="#DC2626" />
                <Bar dataKey="calm" stackId="a" fill="#16A34A" />
                <Bar dataKey="neutral" stackId="a" fill="#6B7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Social Media Analysis
        </h3>
        <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Real-time sentiment analysis and trending keywords from social platforms
        </p>
      </div>

      {/* View Selection */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Analysis View
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {viewOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setSelectedView(option.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedView === option.id
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

      {/* Content Display */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {renderContent()}
      </div>

      {/* Summary Stats */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Social Media Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              12.5K
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Total Mentions
            </div>
            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Last 24 hours
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              45%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Calm Sentiment
            </div>
            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Dominant tone
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              #earthquake
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Top Trending
            </div>
            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              1,250 mentions
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              Twitter
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Most Active Platform
            </div>
            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              4.2K mentions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}