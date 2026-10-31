import React, { useState } from 'react';
import type { ScreenType, TrafficLightState } from '../types';
import {
  calculateGoogleRoute,
  type GoogleRouteData,
} from '../services/googleMapsService';

interface DevPanelProps {
  screen: ScreenType;
  onScreenChange: (screen: ScreenType) => void;
  isPlaying: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  autoSwitch: boolean;
  onAutoSwitchChange: (val: boolean) => void;
  simSpeed: number;
  onSimSpeedChange: (val: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  speedLimit: number;
  onSpeedLimitChange: (limit: number) => void;
  distanceToTurn: number;
  onDistanceChange: (dist: number) => void;
  currentStreet: string;
  onCurrentStreetChange: (val: string) => void;
  nextStreet: string;
  onNextStreetChange: (val: string) => void;
  trafficLightState: TrafficLightState;
  onTrafficLightChange: (tl: TrafficLightState) => void;
  nightMode: boolean;
  onNightModeToggle: (val: boolean) => void;
  bluetoothDisconnected: boolean;
  onBluetoothToggle: (val: boolean) => void;
  gpsLost: boolean;
  onGpsLostToggle: (val: boolean) => void;
  lowBattery: boolean;
  onLowBatteryToggle: (val: boolean) => void;
  displaySize: 360 | 412;
  onDisplaySizeChange: (size: 360 | 412) => void;
  // Google Route Integration
  isGoogleRouteActive: boolean;
  onLoadGoogleRoute: (data: GoogleRouteData) => void;
  onLoadPresetRoute: () => void;
}

const SCREENS: { id: ScreenType; label: string }[] = [
  { id: 'startup', label: '1. Startup Screen' },
  { id: 'connected', label: '2. Connected (Ready)' },
  { id: 'active-nav', label: '3. Active Navigation' },
  { id: 'turn-emphasis', label: '4. Turn Emphasis' },
  { id: 'bridge-warning', label: '5. Bridge Warning' },
  { id: 'roundabout', label: '6. Roundabout Guidance' },
  { id: 'traffic-light', label: '7. Traffic Light Indicator' },
  { id: 'dest-approaching', label: '8. Destination Approaching' },
  { id: 'dest-reached', label: '9. Destination Reached' },
  { id: 'rerouting', label: '10. Rerouting...' },
  { id: 'bluetooth-disconnected', label: '11. Bluetooth Disconnected' },
  { id: 'gps-lost', label: '12. GPS Signal Lost' },
  { id: 'low-battery', label: '13. Low Battery' },
  { id: 'night-mode', label: '14. Night Mode' },
];

export const DevPanel: React.FC<DevPanelProps> = ({
  screen,
  onScreenChange,
  isPlaying,
  onStart,
  onPause,
  onReset,
  autoSwitch,
  onAutoSwitchChange,
  simSpeed,
  onSimSpeedChange,
  speed,
  onSpeedChange,
  speedLimit,
  onSpeedLimitChange,
  distanceToTurn,
  onDistanceChange,
  currentStreet,
  onCurrentStreetChange,
  nextStreet,
  onNextStreetChange,
  trafficLightState,
  onTrafficLightChange,
  nightMode,
  onNightModeToggle,
  bluetoothDisconnected,
  onBluetoothToggle,
  gpsLost,
  onGpsLostToggle,
  lowBattery,
  onLowBatteryToggle,
  displaySize,
  onDisplaySizeChange,
  isGoogleRouteActive,
  onLoadGoogleRoute,
  onLoadPresetRoute,
}) => {
  // Google Directions Input State
  const [startPoint, setStartPoint] = useState('Indiranagar, Bengaluru');
  const [destPoint, setDestPoint] = useState('Koramangala, Bengaluru');
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  const handleFetchRoute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!startPoint.trim() || !destPoint.trim()) return;

    setIsLoadingRoute(true);
    setRouteError(null);

    try {
      const data = await calculateGoogleRoute(startPoint.trim(), destPoint.trim());
      onLoadGoogleRoute(data);
    } catch (err: any) {
      console.error('Google Maps Route Error:', err);
      setRouteError(err.message || 'Failed to fetch Google route');
    } finally {
      setIsLoadingRoute(false);
    }
  };

  return (
    <aside className="dev-panel">
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, color: '#FFFFFF', fontWeight: 800 }}>NAVIX</span>
          <span style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Dev Controller
          </span>
        </div>
      </div>

      {/* ─── GOOGLE MAPS REAL ROUTE (START & DESTINATION) ──────────────── */}
      <section className="panel-section" style={{ border: '1px solid #1a3328', background: '#0b1612', borderRadius: 8, padding: '12px' }}>
        <div className="section-title" style={{ color: '#44dd88', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>🌐 Google Maps Route</span>
          {isGoogleRouteActive && (
            <span style={{ fontSize: 10, background: '#1c4a30', color: '#7fffb0', padding: '2px 6px', borderRadius: 4 }}>
              LIVE API
            </span>
          )}
        </div>

        <form onSubmit={handleFetchRoute} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          <div>
            <label style={{ fontSize: 11, color: '#88a090', display: 'block', marginBottom: 2 }}>
              Starting Point:
            </label>
            <input
              type="text"
              value={startPoint}
              onChange={(e) => setStartPoint(e.target.value)}
              placeholder="e.g. Times Square, New York"
              className="text-input"
              style={{ width: '100%', boxSizing: 'border-box', background: '#050d0a', borderColor: '#204030', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: '#88a090', display: 'block', marginBottom: 2 }}>
              Destination Point:
            </label>
            <input
              type="text"
              value={destPoint}
              onChange={(e) => setDestPoint(e.target.value)}
              placeholder="e.g. Central Park, New York"
              className="text-input"
              style={{ width: '100%', boxSizing: 'border-box', background: '#050d0a', borderColor: '#204030', color: '#fff' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <button
              type="submit"
              disabled={isLoadingRoute}
              className="btn btn-active"
              style={{ flex: 2, background: '#1c6040', borderColor: '#28885a', color: '#FFFFFF' }}
            >
              {isLoadingRoute ? 'Calculating...' : '📍 Load Route'}
            </button>

            {isGoogleRouteActive && (
              <button
                type="button"
                onClick={onLoadPresetRoute}
                className="btn"
                style={{ flex: 1, fontSize: 11 }}
                title="Switch back to preset simulated SVG route"
              >
                Mock Route
              </button>
            )}
          </div>

          {routeError && (
            <div style={{ color: '#ff6666', fontSize: 11, marginTop: 4, lineHeight: 1.3 }}>
              ⚠️ {routeError}
            </div>
          )}
        </form>
      </section>

      {/* ─── Simulation Controls ────────────────────────────────────────── */}
      <section className="panel-section">
        <div className="section-title">Route Simulation</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <button
            type="button"
            className={`btn ${isPlaying ? 'btn-active' : ''}`}
            onClick={onStart}
            style={{ flex: 1 }}
          >
            ▶ Start
          </button>
          <button
            type="button"
            className={`btn ${!isPlaying ? 'btn-active' : ''}`}
            onClick={onPause}
            style={{ flex: 1 }}
          >
            ⏸ Pause
          </button>
          <button
            type="button"
            className="btn"
            onClick={onReset}
            style={{ flex: 1 }}
          >
            ↺ Reset
          </button>
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={autoSwitch}
            onChange={(e) => onAutoSwitchChange(e.target.checked)}
          />
          <span style={{ fontSize: 12 }}>Auto-switch screen states on route</span>
        </label>

        {/* ── Simulation Playback Speed ── */}
        <div style={{ marginTop: 14, padding: '10px 12px', background: '#0d0d0d', borderRadius: 8, border: '1px solid #1e2a1a' }}>
          <div className="control-row" style={{ marginBottom: 6 }}>
            <span className="label" style={{ color: '#7fff6a', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em' }}>
              ⚡ TEST RUN SPEED
            </span>
            <span style={{
              fontSize: 13,
              fontWeight: 800,
              color: simSpeed === 1 ? '#888' : simSpeed < 3 ? '#ffcc44' : '#ff6644',
              minWidth: 44,
              textAlign: 'right',
            }}>
              {simSpeed === 1 ? '1× (real)' : `${simSpeed}×`}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={simSpeed}
            onChange={(e) => onSimSpeedChange(Number(e.target.value))}
            className="slider"
            style={{ accentColor: '#7fff6a' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#444', marginTop: 3 }}>
            <span>1× real-time</span>
            <span>5× fast</span>
            <span>10× turbo</span>
          </div>
        </div>
      </section>

      {/* ─── 14 Screen States Radio List ─────────────────────────────────── */}
      <section className="panel-section">
        <div className="section-title">Navigation States (14 States)</div>
        <div className="radio-list">
          {SCREENS.map((s) => {
            const isActive = screen === s.id;
            return (
              <label
                key={s.id}
                className={`radio-item ${isActive ? 'radio-item-active' : ''}`}
                onClick={() => onScreenChange(s.id)}
              >
                <input
                  type="radio"
                  name="screenState"
                  checked={isActive}
                  onChange={() => onScreenChange(s.id)}
                />
                <span className="radio-label">{s.label}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* ─── Speed & Limit ──────────────────────────────────────────────── */}
      <section className="panel-section">
        <div className="section-title">Speed & Limits</div>
        <div className="control-row">
          <span className="label">Current Speed</span>
          <span className="value-badge">{Math.round(speed)} km/h</span>
        </div>
        <input
          type="range"
          min="0"
          max="120"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="slider"
        />

        <div className="control-row" style={{ marginTop: 12 }}>
          <span className="label">Speed Limit</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[40, 50, 60, 80].map((lim) => (
              <button
                key={lim}
                type="button"
                className={`chip ${speedLimit === lim ? 'chip-active' : ''}`}
                onClick={() => onSpeedLimitChange(lim)}
              >
                {lim}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Distance to Next Turn ───────────────────────────────────────── */}
      <section className="panel-section">
        <div className="section-title">Turn Indicator</div>
        <div className="control-row">
          <span className="label">Distance to Manoeuvre</span>
          <span className="value-badge">{Math.round(distanceToTurn)} m</span>
        </div>
        <input
          type="range"
          min="10"
          max="1200"
          step="10"
          value={distanceToTurn}
          onChange={(e) => onDistanceChange(Number(e.target.value))}
          className="slider"
        />
      </section>

      {/* ─── Street Names ───────────────────────────────────────────────── */}
      <section className="panel-section">
        <div className="section-title">Street Names</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 2 }}>
              Current Street:
            </label>
            <input
              type="text"
              value={currentStreet}
              onChange={(e) => onCurrentStreetChange(e.target.value)}
              className="text-input"
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 2 }}>
              Next Street:
            </label>
            <input
              type="text"
              value={nextStreet}
              onChange={(e) => onNextStreetChange(e.target.value)}
              className="text-input"
            />
          </div>
        </div>
      </section>

      {/* ─── Special Triggers ───────────────────────────────────────────── */}
      <section className="panel-section">
        <div className="section-title">Quick Triggers</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <button
            type="button"
            className="btn"
            onClick={() => onScreenChange('bridge-warning')}
          >
            Bridge Alert
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => onScreenChange('roundabout')}
          >
            Roundabout
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => onScreenChange('traffic-light')}
          >
            Traffic Light
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => onScreenChange('rerouting')}
          >
            Rerouting
          </button>
        </div>
      </section>

      {/* ─── Traffic Light State ────────────────────────────────────────── */}
      <section className="panel-section">
        <div className="section-title">Simulated Traffic Light</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['red', 'amber', 'green'] as TrafficLightState[]).map((tl) => (
            <button
              key={tl}
              type="button"
              className={`btn ${trafficLightState === tl ? 'btn-active' : ''}`}
              onClick={() => onTrafficLightChange(tl)}
              style={{
                flex: 1,
                textTransform: 'capitalize',
                color:
                  tl === 'red'
                    ? '#ff4444'
                    : tl === 'amber'
                    ? '#ffbb00'
                    : '#00dd55',
              }}
            >
              ● {tl}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Device State Overrides ─────────────────────────────────────── */}
      <section className="panel-section">
        <div className="section-title">Device State Simulation</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={bluetoothDisconnected}
              onChange={(e) => onBluetoothToggle(e.target.checked)}
            />
            <span>Bluetooth Disconnected</span>
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={gpsLost}
              onChange={(e) => onGpsLostToggle(e.target.checked)}
            />
            <span>GPS Signal Lost</span>
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={lowBattery}
              onChange={(e) => onLowBatteryToggle(e.target.checked)}
            />
            <span>Low Battery Warning (15%)</span>
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={nightMode}
              onChange={(e) => onNightModeToggle(e.target.checked)}
            />
            <span>Night Mode (Darkened HUD)</span>
          </label>
        </div>
      </section>

      {/* ─── Display Size ───────────────────────────────────────────────── */}
      <section className="panel-section">
        <div className="section-title">Display Diameter</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            className={`btn ${displaySize === 360 ? 'btn-active' : ''}`}
            onClick={() => onDisplaySizeChange(360)}
            style={{ flex: 1 }}
          >
            360×360 px
          </button>
          <button
            type="button"
            className={`btn ${displaySize === 412 ? 'btn-active' : ''}`}
            onClick={() => onDisplaySizeChange(412)}
            style={{ flex: 1 }}
          >
            412×412 px
          </button>
        </div>
      </section>
    </aside>
  );
};
