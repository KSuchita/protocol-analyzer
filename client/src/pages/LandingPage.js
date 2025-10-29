import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Separate CSS file for styling

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-box">
        <h1>🌐 Network Protocol Performance Analyzer</h1>
        <p>
          Welcome! This application allows you to simulate network protocols, monitor live metrics, 
          visualize data, and generate reports. Analyze network behavior, compare protocols, and optimize performance.
        </p>
        <button onClick={() => navigate('/home')}>Enter Dashboard</button>
      </div>
    </div>
  );
}

export default LandingPage;
