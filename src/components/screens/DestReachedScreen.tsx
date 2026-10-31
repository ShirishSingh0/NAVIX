import React from 'react';
import { CheckeredFlagIcon } from '../icons/StatusIcons';

export const DestReachedScreen: React.FC = () => {
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
        animation: 'fadeIn 0.5s ease-out forwards',
        textAlign: 'center',
      }}
    >
      {/* Checkered flag with celebratory pulse */}
      <div
        style={{
          marginBottom: 16,
          animation: 'pulse 2.2s infinite ease-in-out',
        }}
      >
        <CheckeredFlagIcon size={80} />
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: '28px',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
        }}
      >
        You've Arrived
      </h2>

      <p
        style={{
          margin: '8px 0 0 0',
          fontSize: '16px',
          color: '#888888',
          fontWeight: 400,
        }}
      >
        Great ride!
      </p>
    </div>
  );
};
