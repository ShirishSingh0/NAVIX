import React from 'react';
import { BluetoothIcon, BatteryIcon, PhoneIcon } from '../icons/StatusIcons';

interface ConnectedScreenProps {
  batteryLevel?: number;
}

export const ConnectedScreen: React.FC<ConnectedScreenProps> = ({
  batteryLevel = 80,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '36px 20px',
        boxSizing: 'border-box',
        background: '#000000',
        color: '#FFFFFF',
        animation: 'fadeIn 0.5s ease-out forwards',
        userSelect: 'none',
      }}
    >
      {/* Top Bluetooth Status */}
      <div style={{ marginTop: 8 }}>
        <BluetoothIcon size={34} color="#FFFFFF" />
      </div>

      {/* Center Phone & Status Text */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <PhoneIcon size={46} color="#FFFFFF" />
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '26px',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: '#FFFFFF',
            }}
          >
            Connected
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#888888',
              marginTop: 4,
              letterSpacing: '0.02em',
            }}
          >
            Ready to navigate
          </div>
        </div>
      </div>

      {/* Bottom Battery Indicator */}
      <div
        style={{
          marginBottom: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <BatteryIcon size={40} level={batteryLevel} color="#FFFFFF" />
        <span style={{ fontSize: '11px', color: '#666666' }}>{batteryLevel}%</span>
      </div>
    </div>
  );
};
