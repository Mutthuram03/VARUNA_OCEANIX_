import React from 'react';


const AuthTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'login', label: 'Sign In', description: 'Access your account' },
    { id: 'register', label: 'Sign Up', description: 'Create new account' }
  ];

  return (
    <div className="flex bg-muted rounded-lg p-1 mb-8">
      {tabs?.map((tab) => (
        <button
          key={tab?.id}
          onClick={() => onTabChange(tab?.id)}
          className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === tab?.id
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="text-center">
            <div className="font-semibold">{tab?.label}</div>
            <div className="text-xs opacity-75 mt-0.5">{tab?.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default AuthTabs;