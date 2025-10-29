import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; // make sure path is correct

function SimulateForm({ onSimulate }) {
  const [protocol, setProtocol] = useState('TCP');
  const [latency, setLatency] = useState(50);
  const [bandwidth, setBandwidth] = useState(1000);
  const [errorRate, setErrorRate] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('http://localhost:5000/api/simulate/run', {
        protocol,
        latency: Number(latency),
        bandwidth: Number(bandwidth),
        errorRate: Number(errorRate),
      });

      setMessage('Simulation completed successfully!');
      onSimulate(); // refresh chart
    } catch (error) {
      console.error('Simulation error:', error);
      setMessage('Error running simulation. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-box" onSubmit={handleSubmit}>
      <h3>Simulate Protocol</h3>

      <div className="form-group">
        <label>Protocol:</label>
        <select value={protocol} onChange={e => setProtocol(e.target.value)}>
          <option value="TCP">TCP</option>
          <option value="UDP">UDP</option>
          <option value="ICMP">ICMP</option>
        </select>
      </div>

      <div className="form-group">
        <label>Latency (ms):</label>
        <input
          type="number"
          value={latency}
          onChange={e => setLatency(e.target.value)}
          min="0"
        />
      </div>

      <div className="form-group">
        <label>Bandwidth (kbps):</label>
        <input
          type="number"
          value={bandwidth}
          onChange={e => setBandwidth(e.target.value)}
          min="1"
        />
      </div>

      <div className="form-group">
        <label>Error Rate (%):</label>
        <input
          type="number"
          value={errorRate}
          onChange={e => setErrorRate(e.target.value)}
          min="0"
          max="100"
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Running...' : 'Run Simulation'}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default SimulateForm;
