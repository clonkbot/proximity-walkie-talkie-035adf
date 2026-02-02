import React from 'react';

interface NearbyDevice {
  id: string;
  name: string;
  rssi: number;
  angle: number;
  channel?: string;
}

interface RadarDisplayProps {
  devices: NearbyDevice[];
  isScanning: boolean;
  scanAngle: number;
}

export const RadarDisplay: React.FC<RadarDisplayProps> = ({
  devices,
  isScanning,
  scanAngle,
}) => {
  const getDevicePosition = (device: NearbyDevice) => {
    const distance = Math.min(90, Math.max(20, 100 + device.rssi));
    const radians = (device.angle * Math.PI) / 180;
    const x = 50 + (distance * 0.4) * Math.cos(radians);
    const y = 50 + (distance * 0.4) * Math.sin(radians);
    return { x, y };
  };

  return (
    <div className="radar-container">
      <svg viewBox="0 0 100 100" className="radar-svg">
        {/* Background grid */}
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--amber)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Radar background */}
        <circle cx="50" cy="50" r="48" fill="url(#radarGlow)" />

        {/* Concentric circles */}
        {[12, 24, 36, 48].map((r) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="var(--amber)"
            strokeWidth="0.3"
            strokeOpacity="0.4"
          />
        ))}

        {/* Cross hairs */}
        <line x1="2" y1="50" x2="98" y2="50" stroke="var(--amber)" strokeWidth="0.3" strokeOpacity="0.4" />
        <line x1="50" y1="2" x2="50" y2="98" stroke="var(--amber)" strokeWidth="0.3" strokeOpacity="0.4" />

        {/* Diagonal lines */}
        <line x1="15" y1="15" x2="85" y2="85" stroke="var(--amber)" strokeWidth="0.2" strokeOpacity="0.3" />
        <line x1="85" y1="15" x2="15" y2="85" stroke="var(--amber)" strokeWidth="0.2" strokeOpacity="0.3" />

        {/* Sweep beam */}
        {isScanning && (
          <g style={{ transform: `rotate(${scanAngle}deg)`, transformOrigin: '50px 50px' }}>
            <defs>
              <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="var(--amber)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M50,50 L50,2 A48,48 0 0,1 85,15 Z"
              fill="url(#sweepGradient)"
              className="sweep-beam"
            />
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="2"
              stroke="var(--amber)"
              strokeWidth="1"
              filter="url(#glow)"
            />
          </g>
        )}

        {/* Center point */}
        <circle cx="50" cy="50" r="2" fill="var(--amber)" filter="url(#glow)" />

        {/* Device blips */}
        {devices.map((device) => {
          const pos = getDevicePosition(device);
          return (
            <g key={device.id} className="device-blip">
              <circle
                cx={pos.x}
                cy={pos.y}
                r="3"
                fill="var(--amber)"
                filter="url(#glow)"
                className="blip-core"
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r="5"
                fill="none"
                stroke="var(--amber)"
                strokeWidth="0.5"
                className="blip-ring"
              />
            </g>
          );
        })}

        {/* Range markers */}
        <text x="50" y="16" fill="var(--amber)" fontSize="3" textAnchor="middle" opacity="0.6">10m</text>
        <text x="50" y="28" fill="var(--amber)" fontSize="3" textAnchor="middle" opacity="0.6">25m</text>
        <text x="50" y="40" fill="var(--amber)" fontSize="3" textAnchor="middle" opacity="0.6">50m</text>
      </svg>

      <div className="radar-frame">
        <div className="frame-corner frame-tl" />
        <div className="frame-corner frame-tr" />
        <div className="frame-corner frame-bl" />
        <div className="frame-corner frame-br" />
      </div>
    </div>
  );
};