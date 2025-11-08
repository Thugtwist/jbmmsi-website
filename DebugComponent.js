// DebugComponent.js - Add this to test your connections
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { socketService } from '../services/socketService';

const DebugComponent = () => {
  const [status, setStatus] = useState({});
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnections = async () => {
    addLog('Starting connection tests...');
    
    try {
      // Test API Health
      addLog('Testing API health...');
      const health = await apiService.checkHealth();
      setStatus(prev => ({ ...prev, api: '✅ Connected' }));
      addLog(`API Health: ${health.data.message}`);
    } catch (error) {
      setStatus(prev => ({ ...prev, api: '❌ Failed' }));
      addLog(`API Error: ${error.message}`);
    }

    try {
      // Test Announcements
      addLog('Testing announcements...');
      const announcements = await apiService.getActiveAnnouncements();
      setStatus(prev => ({ ...prev, announcements: `✅ ${announcements.data.data?.length || 0} items` }));
      addLog(`Announcements: ${announcements.data.data?.length || 0} items`);
    } catch (error) {
      setStatus(prev => ({ ...prev, announcements: '❌ Failed' }));
      addLog(`Announcements Error: ${error.message}`);
    }

    try {
      // Test Socket
      addLog('Testing WebSocket...');
      socketService.connect();
      setStatus(prev => ({ ...prev, socket: '✅ Connecting...' }));
      
      setTimeout(() => {
        setStatus(prev => ({ ...prev, socket: socketService.getConnectionStatus() ? '✅ Connected' : '❌ Failed' }));
        addLog(`WebSocket: ${socketService.getConnectionStatus() ? 'Connected' : 'Failed'}`);
      }, 2000);
    } catch (error) {
      setStatus(prev => ({ ...prev, socket: '❌ Failed' }));
      addLog(`Socket Error: ${error.message}`);
    }
  };

  useEffect(() => {
    testConnections();
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', margin: '10px', borderRadius: '5px' }}>
      <h3>Connection Debugger</h3>
      <button onClick={testConnections}>Test Connections</button>
      
      <div style={{ marginTop: '20px' }}>
        <h4>Status:</h4>
        <pre>{JSON.stringify(status, null, 2)}</pre>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h4>Logs:</h4>
        <div style={{ maxHeight: '200px', overflow: 'auto', background: 'white', padding: '10px' }}>
          {logs.map((log, index) => (
            <div key={index} style={{ fontFamily: 'monospace', fontSize: '12px' }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DebugComponent;