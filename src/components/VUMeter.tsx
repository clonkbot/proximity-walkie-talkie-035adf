import React from 'react';

interface VUMeterProps {
  level: number;
  isActive: boolean;
}

export const VUMeter: React.FC<VUMeterProps> = ({ level, isActive }) => {
  const segments = 20;
  const activeSegments = Math.floor(level * segments);

  const getSegmentColor = (index: number) => {
    const threshold = index / segments;
    if (threshold > 0.8) return 'var(--red)';
    if (threshold > 0.6) return 'var(--amber-bright)';
    return 'var(--amber)';
  };

  return (
    <div className={`vu-meter ${isActive ? 'active' : ''}`}>
      <div className="meter-label">AUDIO LEVEL</div>
      <div className="meter-display">
        <div className="meter-scale">
          <span>-40</span>
          <span>-20</span>
          <span>-10</span>
          <span>0</span>
          <span>+3</span>
        </div>
        <div className="meter-bars">
          {Array.from({ length: segments }).map((_, i) => (
            <div
              key={i}
              className={`meter-segment ${i < activeSegments ? 'active' : ''}`}
              style={{
                backgroundColor: i < activeSegments ? getSegmentColor(i) : undefined,
                boxShadow: i < activeSegments ? `0 0 8px ${getSegmentColor(i)}` : undefined,
              }}
            />
          ))}
        </div>
        <div className="meter-peak">
          <div
            className="peak-indicator"
            style={{ left: `${Math.min(level * 100, 100)}%` }}
          />
        </div>
      </div>
      <div className="meter-status">
        {isActive ? (
          <span className="status-active">
            <span className="blink-dot" />
            REC
          </span>
        ) : (
          <span className="status-idle">STANDBY</span>
        )}
      </div>
    </div>
  );
};