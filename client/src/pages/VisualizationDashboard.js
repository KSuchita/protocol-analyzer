import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { io } from 'socket.io-client';
import 'chart.js/auto';

function VisualizationDashboard() {
  const [simulated, setSimulated] = useState([]);
  const [realtime, setRealtime] = useState([]);

  // ---- Simulated Random Data ----
  useEffect(() => {
    const generateSimulated = () => {
      setSimulated(prev => {
        const newData = {
          time: `T${prev.length + 1}`,
          throughput: Math.floor(Math.random() * 1000) + 500,
          delay: Math.floor(Math.random() * 100) + 20,
          packetLoss: parseFloat((Math.random() * 5).toFixed(2)),
        };
        const updated = [...prev, newData];
        return updated.slice(-10); // keep last 10 points
      });
    };
    const interval = setInterval(generateSimulated, 3000);
    return () => clearInterval(interval);
  }, []);

  // ---- Real-time Data from Server ----
  useEffect(() => {
    const socket = io('http://localhost:5000');

    const handleMetrics = (newMetrics) => {
      setRealtime(prev => {
        const mapped = newMetrics.map((m, i) => ({
          time: `Live${prev.length + i + 1}`,
          throughput: m.throughput || 0,
          delay: m.delay || 0,
          packetLoss: m.packetLoss || 0,
        }));
        return [...prev, ...mapped].slice(-10); // last 10 points
      });
    };

    socket.on('protocolMetrics', handleMetrics);

    return () => {
      socket.off('protocolMetrics', handleMetrics);
      socket.disconnect();
    };
  }, []);

  const extract = (arr, key) => arr.map(m => m[key]);

  // ---- Chart Data ----
  const simulatedData = {
    labels: simulated.map(s => s.time),
    datasets: [
      { label: 'Throughput (kbps)', data: extract(simulated, 'throughput'), borderColor: '#28a745', fill: false, tension: 0.3 },
      { label: 'Delay (ms)', data: extract(simulated, 'delay'), borderColor: '#ff9900', fill: false, tension: 0.3 },
      { label: 'Packet Loss (%)', data: extract(simulated, 'packetLoss'), borderColor: '#6f42c1', fill: false, tension: 0.3 },
    ],
  };

  const realtimeData = {
    labels: realtime.map(r => r.time),
    datasets: [
      { label: 'Throughput (kbps)', data: extract(realtime, 'throughput'), borderColor: '#007bff', fill: false, tension: 0.3 },
      { label: 'Delay (ms)', data: extract(realtime, 'delay'), borderColor: '#dc3545', fill: false, tension: 0.3 },
      { label: 'Packet Loss (%)', data: extract(realtime, 'packetLoss'), borderColor: '#17a2b8', fill: false, tension: 0.3 },
    ],
  };

  return (
    <div className="container">
      <h1>📊 Visualization Dashboard</h1>
      <p>Compare simulated and real-time network performance metrics in live mode.</p>

      <div className="dashboard-grid">
        <div className="chart-card">
          <h3>🧪 Simulated Data (Random)</h3>
          <Line data={simulatedData} />
          <p>This chart shows randomly generated network metrics for testing and comparison purposes.</p>
        </div>

        <div className="chart-card">
          <h3>⚡ Real-Time Data (Live from Server)</h3>
          <Line data={realtimeData} />
          <p>This chart displays live network metrics received from the server using Socket.IO.</p>
        </div>
      </div>
    </div>
  );
}

export default VisualizationDashboard;
