import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function PerformanceEngine() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const [formData, setFormData] = useState({
    protocol: 'TCP',
    latency: 50,
    bandwidth: 1000,
    errorRate: 0.5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Simulate behavior based on selected protocol and input parameters
  const simulateMetrics = () => {
    setLoading(true);

    const data = [];
    for (let i = 0; i < 15; i++) {
      let throughput = formData.bandwidth - Math.random() * formData.errorRate * formData.bandwidth;
      let latency = parseInt(formData.latency) + Math.random() * 50;
      let packetLoss = parseFloat(formData.errorRate) + Math.random() * 5;

      // Example protocol effect
      if (formData.protocol === 'UDP') {
        packetLoss += 2; // UDP less reliable
      } else if (formData.protocol === 'ICMP') {
        throughput *= 0.8;
        latency += 20;
      }

      data.push({
        latency: parseFloat(latency.toFixed(2)),
        throughput: parseFloat(throughput.toFixed(2)),
        packetLoss: parseFloat(packetLoss.toFixed(2)),
      });
    }

    setMetrics(data);
    setShowForm(false);
    setLoading(false);
  };

  const chartData = {
    labels: metrics.map((_, i) => `t${i + 1}`),
    datasets: [
      { label: 'Latency (ms)', data: metrics.map(m => m.latency), borderColor: '#0078d4', fill: false, tension: 0.3 },
      { label: 'Throughput (kbps)', data: metrics.map(m => m.throughput), borderColor: '#28a745', fill: false, tension: 0.3 },
      { label: 'Packet Loss (%)', data: metrics.map(m => m.packetLoss), borderColor: '#dc3545', fill: false, tension: 0.3 },
    ],
  };

  return (
    <div className="container">
      <h1>📊 Performance Engine (Protocol Simulator)</h1>

      {showForm && (
        <div className="form-box">
          <h3>Configure Scenario</h3>
          <div className="form-group">
            <label>Protocol</label>
            <select name="protocol" value={formData.protocol} onChange={handleChange}>
              <option value="TCP">TCP</option>
              <option value="UDP">UDP</option>
            </select>
          </div>
          <div className="form-group">
            <label>Latency (ms)</label>
            <input type="number" name="latency" value={formData.latency} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Bandwidth (kbps)</label>
            <input type="number" name="bandwidth" value={formData.bandwidth} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Error Rate (%)</label>
            <input type="number" step="0.01" name="errorRate" value={formData.errorRate} onChange={handleChange} />
          </div>
          <button onClick={simulateMetrics}>Run Simulation</button>
        </div>
      )}

      {loading && <p>Running simulation...</p>}

      {metrics.length > 0 && (
        <div className="chart">
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
}

export default PerformanceEngine;
