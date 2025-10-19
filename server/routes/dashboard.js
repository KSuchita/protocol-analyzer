// routes/dashboard.js
const express = require('express');
const router = express.Router();
const si = require('systeminformation');
const { exec } = require('child_process');

// Helper function to generate random scenario metrics
const generateRandomScenarios = () => {
  return [
    {
      name: `Scenario-${Date.now() % 100000}`,
      throughput: Math.floor(Math.random() * 1000 + 500),
      delay: Math.floor(Math.random() * 50 + 10),
      packetLoss: Math.floor(Math.random() * 10),
      retransmissions: Math.floor(Math.random() * 5),
      congestion: Math.floor(Math.random() * 100),
    },
  ];
};

// Optional: fetch real network stats
const fetchNetworkStats = async () => {
  try {
    const stats = await si.networkStats();
    const iface = stats[0];

    return [
      {
        name: 'Current Network',
        throughput: Math.floor((iface.tx_sec + iface.rx_sec) / 1024),
        delay: Math.floor(Math.random() * 50 + 10),
        packetLoss: 0, // Will calculate below
        retransmissions: 0,
        congestion: Math.floor((iface.tx_sec + iface.rx_sec) / 100000),
      },
    ];
  } catch (err) {
    console.error('Error fetching network stats:', err);
    return generateRandomScenarios();
  }
};

// Route: GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const useSimulation = req.query.simulate === 'true'; // ?simulate=true for random metrics

    let scenarios;
    if (useSimulation) {
      scenarios = generateRandomScenarios();
    } else {
      scenarios = await fetchNetworkStats();

      // Add packet loss by pinging 8.8.8.8
      exec('ping -n 5 8.8.8.8', (error, stdout) => {
        let packetLoss = 0;
        const match = stdout.match(/Lost = (\d+)/);
        if (match) packetLoss = parseInt(match[1]);
        scenarios.forEach(s => s.packetLoss = packetLoss);
        res.json(scenarios);
      });
      return;
    }

    res.json(scenarios);
  } catch (err) {
    console.error('Error fetching dashboard scenarios:', err);
    res.status(500).json({ error: 'Failed to fetch scenarios' });
  }
});

// Export async helper for server.js live metrics
router.generateScenarios = async (simulate = true) => {
  if (simulate) return generateRandomScenarios();
  return await fetchNetworkStats();
};

module.exports = router;
 