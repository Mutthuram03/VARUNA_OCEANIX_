import { useState } from 'react';
import { 
  Database, 
  TrendingUp, 
  MessageSquare, 
  Download, 
  Moon, 
  Sun,
  Menu,
  X
} from 'lucide-react';
import DataExplorer from '../components/DataExplorer';
import Trends from '../components/Trends';
import SocialMediaAnalysis from '../components/SocialMediaAnalysis';
import ExportTools from '../components/ExportTools';

export default function AnalystPortal() {
  const [activeSection, setActiveSection] = useState('data-explorer');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'data-explorer', label: 'Data Explorer', icon: Database },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'social-media', label: 'Social Media Analysis', icon: MessageSquare },
    { id: 'export', label: 'Export Tools', icon: Download },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'data-explorer':
        return <DataExplorer darkMode={darkMode} />;
      case 'trends':
        return <Trends darkMode={darkMode} />;
      case 'social-media':
        return <SocialMediaAnalysis darkMode={darkMode} />;
      case 'export':
        return <ExportTools darkMode={darkMode} />;
      default:
        return <DataExplorer darkMode={darkMode} />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} font-inter`}>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-30 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r w-64`}>
        
        {/* Header */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Analyst Portal
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`lg:hidden p-1 rounded-md ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <X size={20} />
            </button>
          </div>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Research View Only
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? darkMode 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-100 text-blue-700'
                        : darkMode
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-md mr-4 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <Menu size={20} />
              </button>
              <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {menuItems.find(item => item.id === activeSection)?.label}
              </h2>
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}