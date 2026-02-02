import React from 'react';

interface NearbyDevice {
  id: string;
  name: string;
  rssi: number;
  angle: number;
  channel?: string;
}

interface DeviceListProps {
  devices: NearbyDevice[];
  currentChannel: string;
}

export const DeviceList: React.FC<DeviceListProps> = ({ devices, currentChannel }) => {
  const getSignalStrength = (rssi: number): number => {
    if (rssi > -50) return 4;
    if (rssi > -60) return 3;
    if (rssi > -70) return 2;
    return 1;
  };

  const getDistance = (rssi: number): string => {
    if (rssi > -50) return '< 5m';
    if (rssi > -60) return '5-15m';
    if (rssi > -70) return '15-30m';
    return '> 30m';
  };

  return (
    <div className="device-list">
      <div className="section-label">
        <span className="label-line" />
        <span>NEARBY UNITS</span>
        <span className="label-line" />
      </div>

      <div className="list-container">
        {devices.length === 0 ? (
          <div className="no-devices">
            <div className="no-devices-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <span>NO UNITS DETECTED</span>
            <span className="hint">Initiate scan to discover nearby devices</span>
          </div>
        ) : (
          <ul className="device-items">
            {devices.map((device, index) => {
              const signalBars = getSignalStrength(device.rssi);
              const isOnChannel = device.channel === currentChannel;

              return (
                <li
                  key={device.id}
                  className={`device-item ${isOnChannel ? 'on-channel' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="device-indicator">
                    <span className={`indicator-dot ${isOnChannel ? 'active' : ''}`} />
                  </div>

                  <div className="device-info">
                    <span className="device-name">{device.name}</span>
                    <span className="device-meta">
                      {device.channel ? (
                        <span className={`device-channel ${isOnChannel ? 'match' : ''}`}>
                          {device.channel}
                        </span>
                      ) : (
                        <span className="device-channel unknown">NO CHANNEL</span>
                      )}
                      <span className="device-distance">{getDistance(device.rssi)}</span>
                    </span>
                  </div>

                  <div className="device-signal">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`signal-bar ${bar <= signalBars ? 'active' : ''}`}
                        style={{ height: `${bar * 4}px` }}
                      />
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="list-footer">
        <span className="unit-count">
          {devices.length} UNIT{devices.length !== 1 ? 'S' : ''} IN RANGE
        </span>
        <span className="channel-match">
          {devices.filter(d => d.channel === currentChannel).length} ON CHANNEL
        </span>
      </div>
    </div>
  );
};