import React, { useState } from 'react';
import './App.css';
import type { ScreenType } from './types';
import { useSimulation } from './hooks/useSimulation';
import { CircularDisplay } from './components/CircularDisplay';
import { DevPanel } from './components/DevPanel';
import { PhoneCompanionApp } from './components/PhoneCompanionApp';

// Screen Components
import { StartupScreen } from './components/screens/StartupScreen';
import { ConnectedScreen } from './components/screens/ConnectedScreen';
import { ActiveNavScreen } from './components/screens/ActiveNavScreen';
import { TurnEmphasisScreen } from './components/screens/TurnEmphasisScreen';
import { BridgeWarningScreen } from './components/screens/BridgeWarningScreen';
import { RoundaboutScreen } from './components/screens/RoundaboutScreen';
import { TrafficLightScreen } from './components/screens/TrafficLightScreen';
import { DestApproachingScreen } from './components/screens/DestApproachingScreen';
import { DestReachedScreen } from './components/screens/DestReachedScreen';
import { ReroutingScreen } from './components/screens/ReroutingScreen';
import { BluetoothDisconnScreen } from './components/screens/BluetoothDisconnScreen';
import { GpsLostScreen } from './components/screens/GpsLostScreen';
import { LowBatteryScreen } from './components/screens/LowBatteryScreen';
import { NightModeScreen } from './components/screens/NightModeScreen';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenType>('active-nav');
  const [simSpeed, setSimSpeed] = useState(1);
  const [showPhoneApp, setShowPhoneApp] = useState(true);

  const {
    isPlaying,
    autoSwitchScreens,
    navState,
    googleRoute,
    loadCustomGoogleRoute,
    loadPresetRoute,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setAutoSwitchScreens,
    setSpeed,
    setSpeedLimit,
    setDistanceToTurn,
    setCurrentStreet,
    setNextStreet,
    setTrafficLight,
    setDisplaySize,
    setNightMode,
    setBluetoothConnected,
  } = useSimulation(screen, setScreen, simSpeed);

  // Quick helper to handle screen and device toggles
  const handleBluetoothToggle = (disconnected: boolean) => {
    setBluetoothConnected(!disconnected);
    if (disconnected) {
      setScreen('bluetooth-disconnected');
    } else if (screen === 'bluetooth-disconnected') {
      setScreen('active-nav');
    }
  };

  const handleGpsToggle = (lost: boolean) => {
    if (lost) {
      setScreen('gps-lost');
    } else if (screen === 'gps-lost') {
      setScreen('active-nav');
    }
  };

  const handleLowBatteryToggle = (low: boolean) => {
    if (low) {
      setScreen('low-battery');
    } else if (screen === 'low-battery') {
      setScreen('active-nav');
    }
  };

  const handleNightModeToggle = (night: boolean) => {
    setNightMode(night);
  };

  // Render the current active screen inside the circular gauge
  const renderScreen = () => {
    switch (screen) {
      case 'startup':
        return <StartupScreen />;
      case 'connected':
        return <ConnectedScreen batteryLevel={navState.batteryLevel} />;
      case 'active-nav':
        return (
          <ActiveNavScreen
            distanceToTurn={navState.distanceToTurn}
            nextStreet={navState.nextStreet}
            currentStreet={navState.currentStreet}
            speed={navState.currentSpeed}
            speedLimit={navState.speedLimit}
            totalDistanceRemaining={navState.totalDistanceRemaining}
            eta={navState.eta}
            manoeuvre={navState.manoeuvre}
            heading={navState.heading}
            riderX={navState.riderX}
            riderY={navState.riderY}
            displaySize={navState.displaySize}
            isGoogleRoute={navState.isGoogleRoute}
            googleLocation={navState.googleLocation}
            googleOverviewPath={navState.googleOverviewPath}
            currentWaypointIndex={navState.currentWaypointIndex}
            nightMode={navState.nightMode}
          />
        );
      case 'turn-emphasis':
        return (
          <TurnEmphasisScreen
            distanceToTurn={navState.distanceToTurn}
            nextStreet={navState.nextStreet}
            speed={navState.currentSpeed}
            speedLimit={navState.speedLimit}
            manoeuvre={navState.manoeuvre}
            displaySize={navState.displaySize}
          />
        );
      case 'bridge-warning':
        return (
          <BridgeWarningScreen
            distance={navState.distanceToTurn}
            speed={navState.currentSpeed}
            speedLimit={navState.speedLimit}
          />
        );
      case 'roundabout':
        return (
          <RoundaboutScreen
            distance={navState.distanceToTurn}
            exitNumber={2}
            speed={navState.currentSpeed}
            speedLimit={navState.speedLimit}
          />
        );
      case 'traffic-light':
        return (
          <TrafficLightScreen
            distance={navState.distanceToTurn}
            trafficLightState={navState.trafficLight}
            speed={navState.currentSpeed}
            speedLimit={navState.speedLimit}
            heading={navState.heading}
            riderX={navState.riderX}
            riderY={navState.riderY}
            displaySize={navState.displaySize}
          />
        );
      case 'dest-approaching':
        return (
          <DestApproachingScreen
            distance={navState.distanceToTurn}
            speed={navState.currentSpeed}
            speedLimit={navState.speedLimit}
          />
        );
      case 'dest-reached':
        return <DestReachedScreen />;
      case 'rerouting':
        return <ReroutingScreen />;
      case 'bluetooth-disconnected':
        return <BluetoothDisconnScreen />;
      case 'gps-lost':
        return <GpsLostScreen />;
      case 'low-battery':
        return <LowBatteryScreen batteryLevel={15} />;
      case 'night-mode':
        return <NightModeScreen />;
      default:
        return <StartupScreen />;
    }
  };

  return (
    <div className="app-layout">
      {/* ─── WORKSPACE (Stage: Phone App + ESP32 Cluster) ─────────────── */}
      <main className="workspace">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, width: '100%', maxWidth: 1100 }}>
          {/* 📱 Phone Companion App (Connects to ESP-32) */}
          {showPhoneApp && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: '#555555', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase' }}>
                Smartphone App
              </div>
              <PhoneCompanionApp
                onRouteLoaded={(routeData) => {
                  loadCustomGoogleRoute(routeData);
                  setScreen('active-nav');
                }}
                onStartNavigation={startSimulation}
                onPauseNavigation={pauseSimulation}
                isNavigating={isPlaying}
                navSpeed={navState.currentSpeed}
                distanceToTurn={navState.distanceToTurn}
                totalDistanceRemaining={navState.totalDistanceRemaining}
                nextStreet={navState.nextStreet}
                manoeuvre={navState.manoeuvre}
                eta={navState.eta}
                isEspConnected={navState.bluetoothConnected && screen !== 'bluetooth-disconnected'}
                onToggleConnection={() => {
                  const currentlyConn = navState.bluetoothConnected && screen !== 'bluetooth-disconnected';
                  handleBluetoothToggle(currentlyConn);
                }}
              />
            </div>
          )}

          {/* 🏍️ ESP-32 Circular Handlebar Display */}
          <div className="cockpit-atmosphere">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="cockpit-badge" style={{ marginBottom: 16 }}>
                <span className="live-dot" />
                <span>
                  ESP-32 MOTO GAUGE • {navState.isGoogleRoute ? 'LIVE GPS ROUTE' : 'PROTOTYPE'}
                </span>
              </div>
              <button
                onClick={() => setShowPhoneApp(!showPhoneApp)}
                style={{
                  marginBottom: 16,
                  padding: '5px 12px',
                  borderRadius: 20,
                  fontSize: 11,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#aaaaaa',
                  cursor: 'pointer',
                }}
              >
                {showPhoneApp ? 'Hide Phone' : 'Show Phone App'}
              </button>
            </div>

            {/* Motorcycle Handlebar Mount Visual Accent */}
            <div className="handlebar-mount">
              <div className="handlebar-bar" />
              <div className="mount-clamp" />
            </div>

            {/* The Circular Screen Shell */}
            <CircularDisplay
              size={navState.displaySize}
              nightMode={navState.nightMode || screen === 'night-mode'}
            >
              {renderScreen()}
            </CircularDisplay>

            {/* Current Screen Indicator Pill */}
            <div className="state-pill">
              State: <strong>{screen}</strong> ({navState.displaySize}×{navState.displaySize}px)
              {navState.isGoogleRoute && (
                <span style={{ marginLeft: 8, color: '#44dd88', fontWeight: 600 }}>
                  • Synced with Phone App
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ─── DEVELOPER CONTROL PANEL ─────────────────────────────────── */}
      <DevPanel
        screen={screen}
        onScreenChange={setScreen}
        isPlaying={isPlaying}
        onStart={startSimulation}
        onPause={pauseSimulation}
        onReset={resetSimulation}
        autoSwitch={autoSwitchScreens}
        onAutoSwitchChange={setAutoSwitchScreens}
        simSpeed={simSpeed}
        onSimSpeedChange={setSimSpeed}
        speed={navState.currentSpeed}
        onSpeedChange={setSpeed}
        speedLimit={navState.speedLimit}
        onSpeedLimitChange={setSpeedLimit}
        distanceToTurn={navState.distanceToTurn}
        onDistanceChange={setDistanceToTurn}
        currentStreet={navState.currentStreet}
        onCurrentStreetChange={setCurrentStreet}
        nextStreet={navState.nextStreet}
        onNextStreetChange={setNextStreet}
        trafficLightState={navState.trafficLight}
        onTrafficLightChange={setTrafficLight}
        nightMode={navState.nightMode}
        onNightModeToggle={handleNightModeToggle}
        bluetoothDisconnected={screen === 'bluetooth-disconnected' || !navState.bluetoothConnected}
        onBluetoothToggle={handleBluetoothToggle}
        gpsLost={screen === 'gps-lost'}
        onGpsLostToggle={handleGpsToggle}
        lowBattery={screen === 'low-battery'}
        onLowBatteryToggle={handleLowBatteryToggle}
        displaySize={navState.displaySize}
        onDisplaySizeChange={setDisplaySize}
        isGoogleRouteActive={Boolean(googleRoute)}
        onLoadGoogleRoute={loadCustomGoogleRoute}
        onLoadPresetRoute={loadPresetRoute}
      />
    </div>
  );
};

export default App;
