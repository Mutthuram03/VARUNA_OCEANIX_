import React from 'react';
import FirebaseTest from '../components/FirebaseTest';

const TestPage = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Test Page - VARUNA Platform</h1>
      <p>If you can see this, the routing is working!</p>
      
      <FirebaseTest />
      
      <div style={{ marginTop: '20px' }}>
        <h2>Available Pages:</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><a href="/home-dashboard">Home Dashboard</a></li>
          <li><a href="/hazard-reporting-form">Hazard Reporting Form</a></li>
          <li><a href="/interactive-risk-map">Interactive Risk Map</a></li>
          <li><a href="/my-alerts-dashboard">My Alerts Dashboard</a></li>
        </ul>
      </div>
    </div>
  );
};

export default TestPage;
