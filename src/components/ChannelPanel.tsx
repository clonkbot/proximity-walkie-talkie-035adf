import React, { useState } from 'react';

interface ChannelPanelProps {
  currentChannel: string;
  onChannelChange: (channel: string) => void;
}

const PRESET_CHANNELS = [
  'ALPHA-7',
  'BRAVO-3',
  'CHARLIE-9',
  'DELTA-1',
  'ECHO-5',
  'FOXTROT-2',
];

export const ChannelPanel: React.FC<ChannelPanelProps> = ({
  currentChannel,
  onChannelChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customChannel, setCustomChannel] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customChannel.trim()) {
      onChannelChange(customChannel.toUpperCase());
      setIsEditing(false);
      setCustomChannel('');
    }
  };

  return (
    <div className="channel-panel">
      <div className="section-label">
        <span className="label-line" />
        <span>CHANNEL SELECT</span>
        <span className="label-line" />
      </div>

      <div className="channel-display">
        <div className="channel-screen">
          <div className="screen-border">
            <div className="screen-inner">
              <span className="channel-label">ACTIVE FREQ</span>
              <span className="channel-value">{currentChannel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="channel-presets">
        {PRESET_CHANNELS.map((channel) => (
          <button
            key={channel}
            className={`preset-button ${channel === currentChannel ? 'active' : ''}`}
            onClick={() => onChannelChange(channel)}
          >
            <span className="preset-indicator" />
            <span className="preset-name">{channel}</span>
          </button>
        ))}
      </div>

      <div className="custom-channel">
        {isEditing ? (
          <form onSubmit={handleCustomSubmit} className="custom-form">
            <input
              type="text"
              value={customChannel}
              onChange={(e) => setCustomChannel(e.target.value)}
              placeholder="CUSTOM-ID"
              maxLength={12}
              autoFocus
              className="custom-input"
            />
            <button type="submit" className="custom-submit">SET</button>
            <button
              type="button"
              className="custom-cancel"
              onClick={() => setIsEditing(false)}
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            className="custom-trigger"
            onClick={() => setIsEditing(true)}
          >
            <span className="trigger-icon">+</span>
            <span>CUSTOM CHANNEL</span>
          </button>
        )}
      </div>
    </div>
  );
};