import React from 'react';
import { NavixArrow } from '../icons/NavixArrow';
import { RoundaboutIcon } from '../icons/RoundaboutIcon';

interface RoundaboutScreenProps {
  distance?: number;
  exitNumber?: number;
  speed?: number;
  speedLimit?: number;
}

export const RoundaboutScreen: React.FC<RoundaboutScreenProps> = ({
  distance = 150,
  exitNumber = 2,
  speed = 42,
  speedLimit = 60,
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
        padding: '24px 28px',
        boxSizing: 'border-box',
        background: '#000000',
        color: '#FFFFFF',
        userSelect: 'none',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* ─── TOP: Distance & Exit Number ─────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginTop: 10,
        }}
      >
        <NavixArrow type="straight" size={32} color="#FFFFFF" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '26px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              lineHeight: 1,
            }}
          >
            {Math.round(distance)} m
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#888888',
              fontWeight: 500,
              marginTop: 2,
            }}
          >
            {exitNumber === 1 ? '1st Exit' : exitNumber === 2 ? '2nd Exit' : `${exitNumber}rd Exit`}
          </div>
        </div>
      </div>

      {/* ─── CENTER: Roundabout Diagram ──────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <RoundaboutIcon size={148} exitNumber={exitNumber} />
      </div>

      {/* ─── BOTTOM: Speed & Limit ───────────────────────────────────── */}
      <div
        style={{
          width: '78%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <span
            style={{
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {Math.round(speed)}
          </span>
          <span
            style={{
              fontSize: '11px',
              color: '#888888',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            km/h
          </span>
        </div>

        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '2.5px solid #FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000000',
            fontWeight: 800,
            fontSize: '14px',
            color: '#FFFFFF',
          }}
        >
          {speedLimit}
        </div>
      </div>
    </div>
  );
};
