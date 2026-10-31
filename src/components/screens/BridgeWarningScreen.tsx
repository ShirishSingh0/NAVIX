import React from 'react';
import { BridgeIcon } from '../icons/BridgeIcon';

interface BridgeWarningScreenProps {
  distance?: number;
  speed?: number;
  speedLimit?: number;
}

export const BridgeWarningScreen: React.FC<BridgeWarningScreenProps> = ({
  distance = 200,
  speed = 48,
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
        padding: '36px 28px',
        boxSizing: 'border-box',
        background: '#000000',
        color: '#FFFFFF',
        userSelect: 'none',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* ─── TOP: Bridge Icon ────────────────────────────────────────── */}
      <div style={{ marginTop: 10 }}>
        <BridgeIcon size={76} color="#FFFFFF" />
      </div>

      {/* ─── CENTER: Warning Title & Distance ────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 6,
        }}
      >
        <div
          style={{
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            color: '#FFFFFF',
            lineHeight: 1.15,
          }}
        >
          TAKE THE BRIDGE
        </div>
        <div
          style={{
            fontSize: '16px',
            color: '#888888',
            fontWeight: 500,
          }}
        >
          in {Math.round(distance)} m
        </div>
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
