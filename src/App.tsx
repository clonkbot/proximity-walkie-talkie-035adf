import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RadarDisplay } from './components/RadarDisplay';
import { ChannelPanel } from './components/ChannelPanel';
import { TransmitButton } from './components/TransmitButton';
import { VUMeter } from './components/VUMeter';
import { DeviceList } from './components/DeviceList';
import { StatusBar } from './components/StatusBar';
import './styles.css';

interface NearbyDevice {
  id: string;
  name: string;
  rssi: number;
  angle: number;
  channel?: string;
}

type ConnectionStatus = 'disconnected' | 'scanning' | 'connected';

function App() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [currentChannel, setCurrentChannel] = useState('ALPHA-7');
  const [nearbyDevices, setNearbyDevices] = useState<NearbyDevice[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [bluetoothSupported, setBluetoothSupported] = useState(true);
  const [scanAngle, setScanAngle] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check Bluetooth support
  useEffect(() => {
    if (!navigator.bluetooth) {
      setBluetoothSupported(false);
    }
  }, []);

  // Radar sweep animation
  useEffect(() => {
    if (connectionStatus === 'scanning') {
      const interval = setInterval(() => {
        setScanAngle(prev => (prev + 3) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [connectionStatus]);

  // Simulate device discovery during scanning
  useEffect(() => {
    if (connectionStatus === 'scanning') {
      const interval = setInterval(() => {
        const mockDevices: NearbyDevice[] = [
          { id: '1', name: 'UNIT-BRAVO', rssi: -45, angle: Math.random() * 360, channel: 'ALPHA-7' },
          { id: '2', name: 'UNIT-CHARLIE', rssi: -62, angle: Math.random() * 360, channel: 'DELTA-3' },
          { id: '3', name: 'UNIT-ECHO', rssi: -78, angle: Math.random() * 360 },
        ];
        setNearbyDevices(mockDevices);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [connectionStatus]);

  const startScanning = useCallback(async () => {
    setConnectionStatus('scanning');

    if (navigator.bluetooth) {
      try {
        // Request Bluetooth device - this will show the browser's device picker
        await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['generic_access']
        });
        setConnectionStatus('connected');
      } catch {
        // User cancelled or error - continue with simulation
        setTimeout(() => {
          setConnectionStatus('connected');
        }, 3000);
      }
    } else {
      // Simulate connection for demo
      setTimeout(() => {
        setConnectionStatus('connected');
      }, 3000);
    }
  }, []);

  const stopScanning = useCallback(() => {
    setConnectionStatus('disconnected');
    setNearbyDevices([]);
  }, []);

  const startTransmitting = useCallback(async () => {
    setIsTransmitting(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const updateLevel = () => {
        if (analyserRef.current && isTransmitting) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average / 255);
          requestAnimationFrame(updateLevel);
        }
      };
      updateLevel();
    } catch {
      // Microphone access denied - simulate audio levels
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 0.8);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isTransmitting]);

  const stopTransmitting = useCallback(() => {
    setIsTransmitting(false);
    setAudioLevel(0);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  }, []);

  return (
    <div className="app-container">
      <div className="scanlines" />
      <div className="noise-overlay" />

      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
              <path d="M20 8 L20 20 L28 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="20" cy="20" r="4" fill="currentColor" />
            </svg>
          </div>
          <div className="logo-text">
            <h1>PROXIMITY</h1>
            <span className="logo-subtitle">TACTICAL COMM SYSTEM</span>
          </div>
        </div>
        <StatusBar
          connectionStatus={connectionStatus}
          bluetoothSupported={bluetoothSupported}
          channel={currentChannel}
        />
      </header>

      <main className="main-content">
        <section className="radar-section">
          <div className="section-label">
            <span className="label-line" />
            <span>PROXIMITY SCANNER</span>
            <span className="label-line" />
          </div>
          <RadarDisplay
            devices={nearbyDevices}
            isScanning={connectionStatus === 'scanning'}
            scanAngle={scanAngle}
          />
          <div className="radar-controls">
            {connectionStatus === 'disconnected' ? (
              <button className="control-button scan-button" onClick={startScanning}>
                <span className="button-icon">◉</span>
                INITIATE SCAN
              </button>
            ) : (
              <button className="control-button stop-button" onClick={stopScanning}>
                <span className="button-icon">■</span>
                TERMINATE
              </button>
            )}
          </div>
        </section>

        <section className="comm-section">
          <ChannelPanel
            currentChannel={currentChannel}
            onChannelChange={setCurrentChannel}
          />

          <div className="transmit-area">
            <div className="section-label">
              <span className="label-line" />
              <span>TRANSMISSION</span>
              <span className="label-line" />
            </div>
            <VUMeter level={audioLevel} isActive={isTransmitting} />
            <TransmitButton
              isTransmitting={isTransmitting}
              isConnected={connectionStatus === 'connected'}
              onPress={startTransmitting}
              onRelease={stopTransmitting}
            />
          </div>

          <DeviceList
            devices={nearbyDevices}
            currentChannel={currentChannel}
          />
        </section>
      </main>

      <footer className="app-footer">
        <span>Requested by @aiob_me · Built by @clonkbot</span>
      </footer>
    </div>
  );
}

export default App;