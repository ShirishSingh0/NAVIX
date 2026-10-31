import React from 'react';
import type { TrafficLightState } from '../../types';
import { NavixArrow } from '../icons/NavixArrow';
import { MapCanvas } from '../MapCanvas';

interface TrafficLightScreenProps {
  distance?: number;
  trafficLightState?: TrafficLightState;
  speed?: number;
  speedLimit?: number;
  heading?: number;
  riderX?: number;
  riderY?: number;
  displaySize?: 360 | 412;
}

export const TrafficLightScreen: React.FC<TrafficLightScreenProps> = ({
  distance = 200,
  trafficLightState = 'red',
  speed = 45,
  speedLimit = 60,
  heading = 0,
  riderX = 800,
  riderY = 380,
  displaySize = 412,
}) => {
  const R = displaySize / 2;
  const safeHalfWidth = (yFromCenter: number) =>
    Math.sqrt(Math.max(0, R * R - yFromCenter * yFromCenter));
  const topYFromCenter = R - R * 0.13;
  const topSafeWidth = safeHalfWidth(topYFromCenter) * 2;
  const botYFromCenter = 0.82 * displaySize - R;
  const botSafeWidth = safeHalfWidth(Math.abs(botYFromCenter)) * 2;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#000000',
        color: '#FFFFFF',
        position: 'relative',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* ─── MAP: fills the full circle ──────────────────────────────── */}
      <MapCanvas
        riderX={riderX}
        riderY={riderY}
        heading={heading}
        width={displaySize}
        height={displaySize}
        showTrafficLight={true}
        trafficLightState={trafficLightState}
      />

      {/* ─── TOP OVERLAY: Distance & Label ───────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '26%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 70%, transparent 100%)',
          zIndex: 10,
          paddingTop: 10,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            maxWidth: topSafeWidth,
          }}
        >
          <NavixArrow type="straight" size={34} color="#FFFFFF" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '26px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {Math.round(distance)} m
            </div>
            <div style={{ fontSize: '13px', color: '#888888', fontWeight: 500, marginTop: 1 }}>
              Traffic Light
            </div>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM OVERLAY: Speed & Speed Limit ─────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '24%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 20,
          boxSizing: 'border-box',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 70%, transparent 100%)',
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: Math.min(botSafeWidth * 0.82, displaySize * 0.62),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
              {Math.round(speed)}
            </span>
            <span style={{ fontSize: '10px', color: '#888888', fontWeight: 600, textTransform: 'uppercase' }}>
              km/h
            </span>
          </div>
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
    </div>
  );
};
