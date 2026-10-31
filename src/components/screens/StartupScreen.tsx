import React from 'react';
import { NavixArrow } from '../icons/NavixArrow';

export const StartupScreen: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: '#000000',
        animation: 'fadeIn 0.8s ease-out forwards',
        userSelect: 'none',
      }}
    >
      {/* Brand Navigation Arrow */}
      <div style={{ marginBottom: 12, animation: 'slideUp 0.6s ease-out forwards' }}>
        <NavixArrow type="brand-logo" size={54} color="#FFFFFF" />
      </div>

      {/* Brand Title */}
      <h1
        style={{
          margin: 0,
          color: '#FFFFFF',
          fontSize: '32px',
          fontWeight: 700,
          letterSpacing: '0.38em',
          textIndent: '0.38em', // balances trailing letter-spacing
          fontFamily: 'system-ui, -apple-system, sans-serif',
          animation: 'slideUp 0.7s ease-out forwards',
        }}
      >
        NAVIX
      </h1>

      {/* Brand Tagline */}
      <p
        style={{
          margin: '12px 0 0 0',
          color: '#888888',
          fontSize: '15px',
          fontWeight: 400,
          fontStyle: 'italic',
          letterSpacing: '0.04em',
          animation: 'fadeIn 1s ease-out 0.2s both',
        }}
      >
        Every Turn, Clear.
      </p>

      {/* Pagination dots at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
          }}
        />
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#444444',
          }}
        />
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#444444',
          }}
        />
      </div>
    </div>
  );
};
