// server/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

// Routes
const captureRoutes = require('./routes/capture');
const dashboardRoutes = require('./routes/dashboard');
const metricsRoutes = require('./routes/metrics');
const simulateRoutes = require('./routes/simulate');
const trafficRoutes = require('./routes/traffic');

// Models
const Metric = require('./models/Metric');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect('mongodb://localhost:27017/protocolAnalyzer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => console.log('✅ MongoDB connected'));
mongoose.connection.on('error', (err) => console.error('❌ MongoDB error:', err));

// --- Mount Routes ---
app.use('/api/capture', captureRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/simulate', simulateRoutes);
app.use('/api/traffic', trafficRoutes);

// --- Fallback route for quick test ---
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running properly 🚀' });
});

// --- HTTP + WebSocket Setup ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});

// --- Emit Random Live Metrics every 5s ---
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  const emitMetrics = async () => {
    // Randomly simulate live network metrics
    const liveData = [
      {
        throughput: Math.floor(Math.random() * 1000) + 500,
        delay: Math.floor(Math.random() * 100) + 10,
        packetLoss: Math.random() * 5,
      },
    ];

    // Optionally save metrics in MongoDB
    try {
      await Metric.create({
        protocol: 'ICMP',
        latency: liveData[0].delay,
        throughput: liveData[0].throughput,
        packetLoss: liveData[0].packetLoss,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error('⚠️ Failed to save metric:', err.message);
    }

    // Emit metrics to all clients
    io.emit('protocolMetrics', liveData);
  };

  const interval = setInterval(emitMetrics, 5000);

  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log('❌ Client disconnected:', socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
