import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-box">
      <h1>Network Simulation Suite</h1>

      <div className="module-card">
        <h2>🔧 Performance Engine</h2>
        <p>Simulate protocol behavior under varying network conditions. Analyze latency, throughput, and packet loss.</p>
        <button onClick={() => navigate('/performance')}>Launch</button>
      </div>

      <div className="module-card">
        <h2>🚦 Traffic Generator</h2>
        <p>Create synthetic traffic patterns—burst, constant, random—to test protocol efficiency and resilience.</p>
        <button onClick={() => navigate('/traffic')}>Launch</button>
      </div>

      <div className="module-card">
        <h2>📊 Metrics Collector</h2>
        <p>Track throughput, delay, packet loss, retransmissions, and congestion indicators in real time.</p>
        <button onClick={() => navigate('/metrics')}>Launch</button>
      </div>
      <div className="module-card">
        <h2>📈 Visualization Dashboard</h2>
        <p>Graph protocol performance across scenarios for easy comparison and analysis.</p>
        <button onClick={() => navigate('/dashboard')}>Launch</button>
      </div>

    </div>
    
  );
}

export default Home;
