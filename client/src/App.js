import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import PerformanceEngine from './pages/PerformanceEngine';
import MetricsCollector from './pages/MetricsCollector';
import TrafficGenerator from './pages/TrafficGenerator';
import VisualizationDashboard from './pages/VisualizationDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/performance" element={<PerformanceEngine />} />
        <Route path="/metrics" element={<MetricsCollector />} />
        <Route path="/traffic" element={<TrafficGenerator />} />
        <Route path="/dashboard" element={<VisualizationDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
