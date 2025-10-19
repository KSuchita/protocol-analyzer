const express = require('express');
const si = require('systeminformation');
const { exec } = require('child_process');
const router = express.Router();

router.get('/collect', async (req, res) => {
  try {
    const stats = await si.networkStats();
    const iface = stats[0];

    exec('ping -n 5 8.8.8.8', (error, stdout) => {
      let packetLoss = 0;
      const match = stdout.match(/Lost = (\d+)/);
      if (match) packetLoss = parseInt(match[1]);

      const metrics = [{
        throughput: Math.floor((iface.tx_sec + iface.rx_sec) / 1024),
        delay: Math.floor(Math.random() * 50 + 10),
        packetLoss,
        retransmissions: 0,
        congestion: Math.floor((iface.tx_sec + iface.rx_sec) / 100000),
      }];

      res.json(metrics);
    });
  } catch (err) {
    console.error('Error collecting metrics:', err);
    res.status(500).json({ error: 'Failed to collect metrics' });
  }
});

module.exports = router;
