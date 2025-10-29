import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function MetricsCollector() {
  const [metrics, setMetrics] = useState([]);
  const [status, setStatus] = useState('');
  const [summary, setSummary] = useState(null);
  const [stopped, setStopped] = useState(false);
  const protocol = "HTTP"; // You can change this dynamically later

  useEffect(() => {
    if (stopped) return;

    const fetchMetrics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/metrics/collect');
        setMetrics(prev => {
          const updated = [...prev, ...res.data];
          if (updated.length >= 10) {
            analyzeProtocol(updated.slice(-10));
            setStopped(true);
          }
          return updated.slice(-10);
        });
      } catch (err) {
        console.error('Error fetching metrics:', err);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, [stopped]);

  const analyzeProtocol = (data) => {
    const avgDelay = (data.reduce((a, b) => a + b.delay, 0) / data.length).toFixed(2);
    const avgLoss = (data.reduce((a, b) => a + b.packetLoss, 0) / data.length).toFixed(2);
    const avgThroughput = (data.reduce((a, b) => a + b.throughput, 0) / data.length).toFixed(2);

    let conclusion = '';
    if (avgDelay < 150 && avgLoss < 2 && avgThroughput > 800) {
      conclusion = `✅ ${protocol} Protocol is working fine and stable.`;
    } else {
      conclusion = `⚠️ ${protocol} Protocol is not working properly or unstable.`;
    }

    setStatus(conclusion);
    setSummary({ avgDelay, avgLoss, avgThroughput, conclusion });

    // Auto-generate PDF after analysis
    //setTimeout(downloadPDF, 2000);
  };

  const labels = metrics.map((_, i) => `t${i + 1}`);

  const createChart = (label, data, color) => ({
    labels,
    datasets: [
      {
        label,
        data,
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
        tension: 0.3,
      },
    ],
  });

  // --- Improved PDF generation with darker text and sharp image ---
  /*const downloadPDF = () => {
    const input = document.getElementById('metrics-report');

    html2canvas(input, { scale: 2, backgroundColor: '#ffffff' }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 1.0); // use high quality JPEG
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Dark title text
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text(`${protocol} Metrics Analysis Report`, 14, 20);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      pdf.text(`Protocol: ${protocol}`, 14, 38);

      if (summary) {
        pdf.text(`Average Delay: ${summary.avgDelay} ms`, 14, 48);
        pdf.text(`Average Packet Loss: ${summary.avgLoss} %`, 14, 56);
        pdf.text(`Average Throughput: ${summary.avgThroughput} kbps`, 14, 64);

        // Bold conclusion for emphasis
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Conclusion: ${summary.conclusion}`, 14, 74);
      }

      // Add chart image
      pdf.addImage(imgData, 'JPEG', 10, 85, pdfWidth - 20, pdfHeight / 2);
      pdf.save(`HTTP_metrics_report_${Date.now()}.pdf`);
    });
  };*/

  return (
    <div className="container">
      <h1>📊 {protocol} Metrics Collector (Live)</h1>

      {metrics.length > 0 ? (
        <>
          <div id="metrics-report">
            <div className="charts-row">
              <div className="chart-card">
                <h3>Throughput (kbps)</h3>
                <Line data={createChart('Throughput (kbps)', metrics.map(m => m.throughput), '#28a745')} />
              </div>
              <div className="chart-card">
                <h3>Delay (ms)</h3>
                <Line data={createChart('Delay (ms)', metrics.map(m => m.delay), '#007bff')} />
              </div>
            </div>

            <div className="charts-row">
              <div className="chart-card">
                <h3>Packet Loss (%)</h3>
                <Line data={createChart('Packet Loss (%)', metrics.map(m => m.packetLoss), '#dc3545')} />
              </div>
              <div className="chart-card">
                <h3>Retransmissions</h3>
                <Line data={createChart('Retransmissions', metrics.map(m => m.retransmissions), '#fd7e14')} />
              </div>
            </div>

            <div className="charts-row">
              <div className="chart-card">
                <h3>Congestion Level (%)</h3>
                <Line data={createChart('Congestion Level (%)', metrics.map(m => m.congestion), '#6f42c1')} />
              </div>
            </div>

            {summary && (
              <div className="summary-box">
                <h2>📘 Summary Report</h2>
                <p><strong>Protocol:</strong> {protocol}</p>
                <p><strong>Average Delay:</strong> {summary.avgDelay} ms</p>
                <p><strong>Average Packet Loss:</strong> {summary.avgLoss} %</p>
                <p><strong>Average Throughput:</strong> {summary.avgThroughput} kbps</p>
                <p><strong>Conclusion:</strong> {summary.conclusion}</p>
              </div>
            )}
          </div>

          {status && (
            <div className="status-box">
              <h3>{status}</h3>
            </div>
          )}
        </>
      ) : (
        <p>Loading metrics...</p>
      )}
    </div>
  );
}

export default MetricsCollector;
