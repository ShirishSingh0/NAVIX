import React from 'react';

interface CircularDisplayProps {
  size: 360 | 412;
  nightMode?: boolean;
  children: React.ReactNode;
}

export const CircularDisplay: React.FC<CircularDisplayProps> = ({
  size = 412,
  nightMode = false,
  children,
}) => {
  const outerBezelSize = size + 28;

  return (
    <div
      className="circular-display-container"
      style={{
        width: outerBezelSize,
        height: outerBezelSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: '50%',
        // Premium motorcycle gauge cluster bezel
        background: 'radial-gradient(circle, #1a1a1a 0%, #0d0d0d 70%, #050505 100%)',
        boxShadow:
          '0 0 0 3px #282828, 0 0 0 8px #141414, 0 12px 48px rgba(0, 0, 0, 0.9), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
        padding: '14px',
        boxSizing: 'border-box',
        transition: 'width 0.3s ease, height 0.3s ease',
      }}
    >
      {/* Inner Screen Display */}
      <div
        className="circular-display-screen"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#000000',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 0 16px rgba(0, 0, 0, 0.95), inset 0 0 0 2px #1f1f1f',
          transition: 'width 0.3s ease, height 0.3s ease, filter 0.3s ease',
          filter: nightMode ? 'brightness(0.6) contrast(1.05)' : 'none',
        }}
      >
        {children}

        {/* Night mode dark overlay if active */}
        {nightMode && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.35)',
              pointerEvents: 'none',
              borderRadius: '50%',
              zIndex: 99,
            }}
          />
        )}
      </div>
    </div>
  );
};
