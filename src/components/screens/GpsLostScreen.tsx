import React from 'react';
import { GpsIcon } from '../icons/StatusIcons';

export const GpsLostScreen: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '38px 24px',
        boxSizing: 'border-box',
        background: '#000000',
        color: '#FFFFFF',
        userSelect: 'none',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* Top Lost GPS Icon */}
      <div style={{ marginTop: 10 }}>
        <GpsIcon size={52} lost={true} />
      </div>

      {/* Center GPS Lost Text */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
          }}
        >
          GPS Signal Lost
        </div>
        <div
          style={{
            fontSize: '14px',
            color: '#888888',
            marginTop: 6,
          }}
        >
          Waiting for signal...
        </div>
      </div>

      {/* Bottom Pulsing Animated Dots */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#FFFFFF',
            animation: 'pulse 1.2s infinite ease-in-out',
          }}
        />
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#FFFFFF',
            animation: 'pulse 1.2s infinite ease-in-out 0.25s',
          }}
        />
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#FFFFFF',
            animation: 'pulse 1.2s infinite ease-in-out 0.5s',
          }}
        />
      </div>
    </div>
  );
};
