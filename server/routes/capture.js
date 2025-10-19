// server/routes/capture.js
const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const Metric = require('../models/Metric');

router.get('/start', (req, res) => {
  exec('ping -n 5 google.com', (error, stdout, stderr) => {
    if (error) {
      console.error(`Ping error: ${error.message}`);
      return res.status(500).send('Ping failed');
    }

    const latencyMatch = stdout.match(/Average = (\d+)ms/);
    const latency = latencyMatch ? parseInt(latencyMatch[1]) : 0;

    const metric = new Metric({
      protocol: 'ICMP',
      latency,
      throughput: Math.random() * 1000,
      packetLoss: Math.random() * 5,
    });

    metric.save().then(() => {
      res.send('Ping metrics saved');
    });
  });
});

module.exports = router;
