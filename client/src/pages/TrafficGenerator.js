import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function TrafficGenerator() {
  const [pattern, setPattern] = useState('burst');
  const [duration, setDuration] = useState(10);
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [trafficData, setTrafficData] = useState([]);

  const generateSyntheticTraffic = (pattern, duration) => {
    const data = [];
    for (let i = 0; i < duration; i++) {
      if (pattern === 'burst') {
        data.push(i % 3 === 0 ? Math.floor(Math.random() * 100 + 100) : 10);
      } else if (pattern === 'constant') {
        data.push(50);
      } else if (pattern === 'random') {
        data.push(Math.floor(Math.random() * 100));
      }
    }
    return data;
  };

  const generateTraffic = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/traffic/generate', {
      pattern,
      duration: Number(duration),
    });
    setStatus(`✅ Traffic pattern "${pattern}" generated for ${duration} seconds.`);
    setTrafficData(generateSyntheticTraffic(pattern, duration));
    setShowForm(false);
  };

  const chartData = {
    labels: Array.from({ length: duration }, (_, i) => `t${i + 1}`),
    datasets: [
      {
        label: `Traffic Pattern: ${pattern}`,
        data: trafficData,
        borderColor: '#0078d4',
        backgroundColor: 'rgba(0,120,212,0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="container">
      {showForm ? (
        <form className="form-box" onSubmit={generateTraffic}>
          <h3>🚦 Traffic Generator</h3>

          <div className="form-group">
            <label>Pattern</label>
            <select value={pattern} onChange={e => setPattern(e.target.value)}>
              <option value="burst">Burst</option>
              <option value="constant">Constant</option>
              <option value="random">Random</option>
            </select>
          </div>

          <div className="form-group">
            <label>Duration (seconds)</label>
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              min="1"
            />
          </div>

          <button type="submit">Generate Traffic</button>
        </form>
      ) : (
        <div className="form-box">
          <h3>✅ Traffic Generated</h3>
          <p>{status}</p>
        </div>
      )}

      {trafficData.length > 0 && (
        <div className="chart">
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
}

export default TrafficGenerator;
