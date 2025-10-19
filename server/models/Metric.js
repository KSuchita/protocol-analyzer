const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema({
  protocol: String,
  latency: Number,
  throughput: Number,
  packetLoss: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Metric', MetricSchema);
