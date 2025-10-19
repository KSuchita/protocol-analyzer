const express = require('express');
const router = express.Router();
const Metric = require('../models/Metric');

router.post('/run', async (req, res) => {
  const { protocol, latency, bandwidth, errorRate } = req.body;

  try {
    const metric = new Metric({
      protocol,
      latency,
      throughput: bandwidth,
      packetLoss: errorRate,
    });

    await metric.save();
    res.json({ message: 'Simulation saved', metric });
  } catch (err) {
    res.status(500).json({ error: 'Simulation failed', details: err.message });
  }
});

module.exports = router;
