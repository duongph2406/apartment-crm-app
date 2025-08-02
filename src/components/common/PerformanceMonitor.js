import React, { useEffect, useState } from 'react';
import { Activity, Zap, Database } from 'lucide-react';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    memory: null,
    timing: null,
    connection: null
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const updateMetrics = () => {
      const newMetrics = {};

      // Memory usage
      if ('memory' in performance) {
        newMetrics.memory = {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        };
      }

      // Navigation timing
      if ('timing' in performance) {
        const timing = performance.timing;
        newMetrics.timing = {
          loadTime: timing.loadEventEnd - timing.navigationStart,
          domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
          firstPaint: timing.responseStart - timing.navigationStart
        };
      }

      // Connection info
      if ('connection' in navigator) {
        newMetrics.connection = {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt
        };
      }

      setMetrics(newMetrics);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="performance-monitor">
      <div className="performance-header">
        <Activity size={16} />
        <span>Performance Monitor</span>
      </div>
      
      {metrics.memory && (
        <div className="metric-group">
          <Database size={14} />
          <span>Memory: {metrics.memory.used}MB / {metrics.memory.total}MB</span>
        </div>
      )}
      
      {metrics.timing && (
        <div className="metric-group">
          <Zap size={14} />
          <span>Load: {metrics.timing.loadTime}ms</span>
        </div>
      )}
      
      {metrics.connection && (
        <div className="metric-group">
          <span>Network: {metrics.connection.effectiveType}</span>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;