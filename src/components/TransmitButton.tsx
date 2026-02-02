import React from 'react';

interface TransmitButtonProps {
  isTransmitting: boolean;
  isConnected: boolean;
  onPress: () => void;
  onRelease: () => void;
}

export const TransmitButton: React.FC<TransmitButtonProps> = ({
  isTransmitting,
  isConnected,
  onPress,
  onRelease,
}) => {
  const handleMouseDown = () => {
    if (isConnected) {
      onPress();
    }
  };

  const handleMouseUp = () => {
    if (isTransmitting) {
      onRelease();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isConnected) {
      onPress();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isTransmitting) {
      onRelease();
    }
  };

  return (
    <div className="transmit-wrapper">
      <button
        className={`transmit-button ${isTransmitting ? 'transmitting' : ''} ${!isConnected ? 'disabled' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        disabled={!isConnected}
      >
        <div className="button-outer-ring" />
        <div className="button-middle-ring" />
        <div className="button-inner">
          <div className="button-face">
            <svg viewBox="0 0 24 24" className="mic-icon">
              <path
                d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"
                fill="currentColor"
              />
              <path
                d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
        <div className="button-shadow" />
      </button>

      <div className="transmit-label">
        {!isConnected ? (
          <span className="label-offline">OFFLINE</span>
        ) : isTransmitting ? (
          <span className="label-transmitting">
            <span className="pulse-dot" />
            TRANSMITTING
          </span>
        ) : (
          <span className="label-ready">PUSH TO TALK</span>
        )}
      </div>

      <div className="ptt-hint">
        Hold to transmit
      </div>
    </div>
  );
};