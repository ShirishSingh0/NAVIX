import React from 'react';
import { RerouteIcon } from '../icons/StatusIcons';

export const ReroutingScreen: React.FC = () => {
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
      }}
    >
      {/* Spinning Reroute Arrow */}
      <div
        style={{
          marginBottom: 20,
          animation: 'spin 1.4s linear infinite',
          transformOrigin: 'center center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <RerouteIcon size={64} />
      </div>

      <div
        style={{
          fontSize: '26px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
        }}
      >
        Rerouting...
      </div>

      <div
        style={{
          fontSize: '14px',
          color: '#888888',
          marginTop: 6,
          fontWeight: 400,
        }}
      >
        Finding the best route
      </div>
    </div>
  );
};
