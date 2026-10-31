import React from 'react';
import { BluetoothIcon } from '../icons/StatusIcons';

export const BluetoothDisconnScreen: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '40px 24px',
        boxSizing: 'border-box',
        background: '#000000',
        color: '#FFFFFF',
        userSelect: 'none',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* Top Disconnected Bluetooth Icon */}
      <div style={{ marginTop: 8 }}>
        <BluetoothIcon size={46} disconnected={true} />
      </div>

      {/* Center Status Text */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            fontSize: '26px',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: '#FFFFFF',
            lineHeight: 1.15,
          }}
        >
          Bluetooth
        </div>
        <div
          style={{
            fontSize: '22px',
            fontWeight: 600,
            color: '#FF453A',
            marginTop: 4,
          }}
        >
          Disconnected
        </div>
      </div>

      {/* Bottom Hint */}
      <div
        style={{
          fontSize: '13px',
          color: '#888888',
          marginBottom: 10,
        }}
      >
        Reconnect to continue
      </div>
    </div>
  );
};
