import React, { useState, useEffect } from 'react';

interface StatusBarProps {
  connectionStatus: 'disconnected' | 'scanning' | 'connected';
  bluetoothSupported: boolean;
  channel: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  connectionStatus,
  bluetoothSupported,
  channel,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getStatusText = () => {
    if (!bluetoothSupported) return 'BT UNAVAILABLE';
    switch (connectionStatus) {
      case 'connected': return 'ONLINE';
      case 'scanning': return 'SCANNING';
      default: return 'OFFLINE';
    }
  };

  const getStatusClass = () => {
    if (!bluetoothSupported) return 'error';
    return connectionStatus;
  };

  return (
    <div className="status-bar">
      <div className="status-item time">
        <span className="status-icon">⏱</span>
        <span className="status-value">{formatTime(time)}</span>
      </div>

      <div className={`status-item connection ${getStatusClass()}`}>
        <span className="status-indicator">
          <span className="indicator-ring" />
          <span className="indicator-core" />
        </span>
        <span className="status-value">{getStatusText()}</span>
      </div>

      <div className="status-item channel">
        <span className="status-icon">◈</span>
        <span className="status-value">{channel}</span>
      </div>

      <div className="status-item bluetooth">
        <svg viewBox="0 0 24 24" className="bt-icon" fill="currentColor">
          <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z" />
        </svg>
        <span className={`bt-status ${bluetoothSupported ? 'available' : 'unavailable'}`}>
          {bluetoothSupported ? 'BT' : 'NO BT'}
        </span>
      </div>
    </div>
  );
};