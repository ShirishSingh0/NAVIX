import React from 'react';
import type { ManoeuvreType } from '../../types';
import { NavixArrow } from '../icons/NavixArrow';

interface TurnEmphasisScreenProps {
  distanceToTurn?: number;
  nextStreet?: string;
  speed?: number;
  speedLimit?: number;
  manoeuvre?: ManoeuvreType;
  displaySize?: 360 | 412;
}

export const TurnEmphasisScreen: React.FC<TurnEmphasisScreenProps> = ({
  distanceToTurn = 300,
  nextStreet = 'Main St',
  speed = 48,
  speedLimit = 60,
  manoeuvre = 'turn-right',
  displaySize = 412,
}) => {
  // Circle-safe widths
  const R = displaySize / 2;
  const safeHalfWidth = (yFromCenter: number) =>
    Math.sqrt(Math.max(0, R * R - yFromCenter * yFromCenter));
  const botYFromCenter = 0.84 * displaySize - R;
  const botSafeWidth = safeHalfWidth(Math.abs(botYFromCenter)) * 2;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '32px 28px',
        boxSizing: 'border-box',
        background: '#000000',
        color: '#FFFFFF',
        userSelect: 'none',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* ─── TOP: Distance & Next Street ─────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 4,
        }}
      >
        <div
          style={{
            fontSize: '34px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            lineHeight: 1,
          }}
        >
          {distanceToTurn >= 1000
            ? `${(distanceToTurn / 1000).toFixed(1)} km`
            : `${Math.round(distanceToTurn)} m`}
        </div>
        <div
          style={{
            fontSize: '15px',
            color: '#888888',
            marginTop: 4,
            fontWeight: 500,
          }}
        >
          {nextStreet}
        </div>
      </div>

      {/* ─── CENTER: Prominent Bold Turn Arrow ───────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <NavixArrow type={manoeuvre} size={displaySize === 360 ? 108 : 120} color="#FFFFFF" />
      </div>

      {/* ─── BOTTOM: Speed & Speed Limit ─────────────────────────────── */}
      <div
        style={{
          width: Math.min(botSafeWidth * 0.84, displaySize * 0.62),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        {/* Speed */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <span
            style={{
              fontSize: '30px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {Math.round(speed)}
          </span>
          <span
            style={{
              fontSize: '10px',
              color: '#888888',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            km/h
          </span>
        </div>

        {/* Speed Limit */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: '2.5px solid #FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000000',
            fontWeight: 800,
            fontSize: '13px',
            color: '#FFFFFF',
          }}
        >
          {speedLimit}
        </div>
      </div>
    </div>
  );
};
