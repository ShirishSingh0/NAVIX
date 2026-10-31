import React, { useState, useEffect, useRef } from 'react';
import {
  fetchPlacePredictions,
  type PlacePrediction,
  type GoogleRouteData,
  calculateGoogleRoute,
} from '../services/googleMapsService';

interface PhoneCompanionAppProps {
  onRouteLoaded: (routeData: GoogleRouteData) => void;
  onStartNavigation: () => void;
  onPauseNavigation: () => void;
  isNavigating: boolean;
  navSpeed: number;
  distanceToTurn: number;
  totalDistanceRemaining: number;
  nextStreet: string;
  manoeuvre: string;
  eta: string;
  isEspConnected: boolean;
  onToggleConnection: () => void;
}

export const PhoneCompanionApp: React.FC<PhoneCompanionAppProps> = ({
  onRouteLoaded,
  onStartNavigation,
  onPauseNavigation,
  isNavigating,
  distanceToTurn,
  totalDistanceRemaining,
  nextStreet,
  eta,
  isEspConnected,
  onToggleConnection,
}) => {
  const [startInput, setStartInput] = useState('Indiranagar, Bengaluru');
  const [destInput, setDestInput] = useState('Koramangala, Bengaluru');

  // Autocomplete state
  const [activeField, setActiveField] = useState<'start' | 'dest' | null>(null);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger autofill suggestions
  const handleInputChange = (field: 'start' | 'dest', value: string) => {
    if (field === 'start') setStartInput(value);
    else setDestInput(value);
    setActiveField(field);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      if (value.trim().length >= 2) {
        const results = await fetchPlacePredictions(value);
        setPredictions(results);
      } else {
        setPredictions([]);
      }
    }, 280);
  };

  const handleSelectPrediction = (item: PlacePrediction) => {
    if (activeField === 'start') {
      setStartInput(item.description);
    } else if (activeField === 'dest') {
      setDestInput(item.description);
    }
    setPredictions([]);
    setActiveField(null);
  };

  const handleSendToEsp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!startInput.trim() || !destInput.trim()) return;

    setLoadingRoute(true);
    setErrorMsg(null);
    setPredictions([]);
    setActiveField(null);

    try {
      const data = await calculateGoogleRoute(startInput.trim(), destInput.trim());
      onRouteLoaded(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Route failed to load');
    } finally {
      setLoadingRoute(false);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleGlobalClick = () => {
      setPredictions([]);
      setActiveField(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div
      style={{
        width: 320,
        height: 640,
        backgroundColor: '#0a0a0a',
        borderRadius: 44,
        border: '4px solid #222222',
        boxShadow: '0 20px 60px rgba(0,0,0,0.85), inset 0 0 0 2px #111111',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Phone Speaker Notch */}
      <div
        style={{
          width: 90,
          height: 18,
          backgroundColor: '#161616',
          borderRadius: '0 0 12px 12px',
          alignSelf: 'center',
          position: 'absolute',
          top: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: 36, height: 3, backgroundColor: '#333333', borderRadius: 2 }} />
      </div>

      {/* Top Status Bar */}
      <div
        style={{
          padding: '12px 20px 6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#888888',
          letterSpacing: '0.04em',
        }}
      >
        <span style={{ fontWeight: 600, color: '#dddddd' }}>NAVIX Companion</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10 }}>5G</span>
          <span style={{ fontSize: 10 }}>100%</span>
        </div>
      </div>

      {/* ESP-32 BLE Connection Status Pill */}
      <div
        style={{
          margin: '4px 16px 8px',
          padding: '8px 12px',
          borderRadius: 12,
          backgroundColor: isEspConnected ? '#0e1812' : '#1a1010',
          border: `1px solid ${isEspConnected ? '#1e3828' : '#331a1a'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: isEspConnected ? '#44dd88' : '#ff4444',
              boxShadow: isEspConnected ? '0 0 8px #44dd88' : 'none',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#f0f0f0' }}>
              ESP-32 Moto Gauge
            </span>
            <span style={{ fontSize: 10, color: '#777777' }}>
              {isEspConnected ? 'Connected via BLE' : 'Disconnected'}
            </span>
          </div>
        </div>
        <button
          onClick={onToggleConnection}
          style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '4px 8px',
            borderRadius: 6,
            background: 'transparent',
            border: '1px solid #333333',
            color: '#aaaaaa',
            cursor: 'pointer',
          }}
        >
          {isEspConnected ? 'Disconnect' : 'Connect'}
        </button>
      </div>

      {/* Inputs Section */}
      <form
        onSubmit={handleSendToEsp}
        style={{
          padding: '8px 16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          position: 'relative',
        }}
      >
        {/* Starting Point Input */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#44dd88' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#777777', textTransform: 'uppercase' }}>
              Starting Point
            </span>
          </div>
          <input
            type="text"
            value={startInput}
            onChange={(e) => handleInputChange('start', e.target.value)}
            onFocus={() => {
              setActiveField('start');
              if (startInput.length >= 2) handleInputChange('start', startInput);
            }}
            placeholder="Search start location..."
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: '#141414',
              border: `1px solid ${activeField === 'start' ? '#44dd88' : '#222222'}`,
              borderRadius: 10,
              padding: '9px 12px',
              fontSize: 12,
              color: '#ffffff',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        {/* Destination Point Input */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#777777', textTransform: 'uppercase' }}>
              Destination Point
            </span>
          </div>
          <input
            type="text"
            value={destInput}
            onChange={(e) => handleInputChange('dest', e.target.value)}
            onFocus={() => {
              setActiveField('dest');
              if (destInput.length >= 2) handleInputChange('dest', destInput);
            }}
            placeholder="Search destination..."
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: '#141414',
              border: `1px solid ${activeField === 'dest' ? '#ffffff' : '#222222'}`,
              borderRadius: 10,
              padding: '9px 12px',
              fontSize: 12,
              color: '#ffffff',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        {/* Send to ESP32 Button */}
        <button
          type="submit"
          disabled={loadingRoute || !isEspConnected}
          style={{
            marginTop: 4,
            padding: '11px',
            borderRadius: 12,
            backgroundColor: isEspConnected ? '#ffffff' : '#222222',
            color: isEspConnected ? '#000000' : '#666666',
            fontWeight: 700,
            fontSize: 12,
            border: 'none',
            cursor: isEspConnected ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {loadingRoute ? 'Calculating Motorcycle Route...' : '🏍️ Sync Two-Wheeler Route'}
        </button>

        {errorMsg && (
          <div style={{ fontSize: 11, color: '#ff5555', textAlign: 'center', marginTop: 2 }}>
            {errorMsg}
          </div>
        )}

        {/* Autocomplete Dropdown Menu */}
        {activeField && predictions.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: activeField === 'start' ? 56 : 124,
              left: 16,
              right: 16,
              backgroundColor: '#161616',
              borderRadius: 12,
              border: '1px solid #333333',
              boxShadow: '0 12px 32px rgba(0,0,0,0.95)',
              zIndex: 99,
              maxHeight: 210,
              overflowY: 'auto',
            }}
          >
            {predictions.map((p, idx) => (
              <div
                key={p.placeId || idx}
                onClick={() => handleSelectPrediction(p)}
                style={{
                  padding: '10px 12px',
                  borderBottom: idx === predictions.length - 1 ? 'none' : '1px solid #222222',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#222222')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span style={{ fontSize: 12, color: '#ffffff', fontWeight: 600 }}>{p.mainText}</span>
                <span style={{ fontSize: 10, color: '#777777', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.secondaryText || p.description}
                </span>
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Live Active Navigation Card (Minimalist HUD Sync) */}
      <div
        style={{
          flex: 1,
          margin: '0 16px 16px',
          backgroundColor: '#121212',
          borderRadius: 16,
          border: '1px solid #1c1c1c',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Live ESP-32 Telemetry
            </span>
            <span
              style={{
                fontSize: 10,
                color: isNavigating ? '#44dd88' : '#888888',
                fontWeight: 600,
              }}
            >
              {isNavigating ? '● RIDING' : 'IDLE'}
            </span>
          </div>

          {/* Next Turn */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
              {distanceToTurn >= 1000 ? `${(distanceToTurn / 1000).toFixed(1)} km` : `${Math.round(distanceToTurn)} m`}
            </div>
            <div style={{ fontSize: 12, color: '#999999', marginTop: 4, fontWeight: 500 }}>
              {nextStreet || 'Continue on route'}
            </div>
          </div>
        </div>

        {/* Trip Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            padding: '10px 0',
            borderTop: '1px solid #1a1a1a',
            borderBottom: '1px solid #1a1a1a',
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: '#666666' }}>REMAINING</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#dddddd', marginTop: 2 }}>
              {totalDistanceRemaining.toFixed(1)} km
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#666666' }}>EST. ARRIVAL</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#dddddd', marginTop: 2 }}>
              {eta}
            </div>
          </div>
        </div>

        {/* Ride Navigation Play/Pause Button */}
        <button
          onClick={isNavigating ? onPauseNavigation : onStartNavigation}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: 10,
            backgroundColor: isNavigating ? '#222222' : '#ffffff',
            color: isNavigating ? '#ffffff' : '#000000',
            border: 'none',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {isNavigating ? '⏸ Pause Ride Simulation' : '▶ Start Ride Simulation'}
        </button>
      </div>

      {/* Bottom Home Indicator Bar */}
      <div
        style={{
          width: 90,
          height: 3,
          backgroundColor: '#333333',
          borderRadius: 2,
          alignSelf: 'center',
          marginBottom: 8,
        }}
      />
    </div>
  );
};
