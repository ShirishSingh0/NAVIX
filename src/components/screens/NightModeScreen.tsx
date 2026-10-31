import React from 'react';
import { MoonIcon } from '../icons/StatusIcons';

export const NightModeScreen: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 20px',
        boxSizing: 'border-box',
        background: '#000000',
        color: '#FFFFFF',
        userSelect: 'none',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <div style={{ marginBottom: 18, filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.25))' }}>
        <MoonIcon size={56} color="#FFFFFF" />
      </div>

      <div
        style={{
          fontSize: '26px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
        }}
      >
        Night Mode
      </div>

      <div
        style={{
          fontSize: '15px',
          color: '#888888',
          marginTop: 6,
        }}
      >
        Brightness adjusted
      </div>
    </div>
  );
};
