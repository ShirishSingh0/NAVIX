import React from 'react';
import type { ManoeuvreType } from '../../types';
import { NavixArrow } from '../icons/NavixArrow';
import { MapCanvas } from '../MapCanvas';
import { GoogleNavMap } from '../GoogleNavMap';

interface ActiveNavScreenProps {
  distanceToTurn: number;
  nextStreet: string;
  currentStreet: string;
  speed: number;
  speedLimit: number;
  totalDistanceRemaining: number;
  eta: string;
  manoeuvre: ManoeuvreType;
  heading: number;
  riderX: number;
  riderY: number;
  displaySize: 360 | 412;
  isGoogleRoute?: boolean;
  googleLocation?: { lat: number; lng: number };
  googleOverviewPath?: { lat: number; lng: number }[];
  currentWaypointIndex?: number;
  nightMode?: boolean;
}

export const ActiveNavScreen: React.FC<ActiveNavScreenProps> = ({
  distanceToTurn = 300,
  nextStreet = 'Main St',
  speed = 48,
  speedLimit = 60,
  totalDistanceRemaining = 2.4,
  eta = '08:12',
  manoeuvre = 'turn-right',
  heading = 0,
  riderX = 500,
  riderY = 700,
  displaySize = 412,
  isGoogleRoute = false,
  googleLocation,
  googleOverviewPath = [],
  currentWaypointIndex = 0,
  nightMode = false,
}) => {
  const center = displaySize / 2;
  const radius = center - 16;

  const distText =
    distanceToTurn >= 1000
      ? `${(distanceToTurn / 1000).toFixed(1)} km`
      : `${Math.round(distanceToTurn)} m`;

  const topCurveText = `${distText} • ${nextStreet}`.toUpperCase();

  // Helper for polar to Cartesian coords
  const polarToCart = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  // Helper to draw an arc from startAngle to endAngle (clockwise, Left-to-Right)
  const describeClockwiseArc = (startAngle: number, endAngle: number, r: number) => {
    const start = polarToCart(startAngle, r);
    const end = polarToCart(endAngle, r);
    const diff = (endAngle - startAngle + 360) % 360;
    const largeArcFlag = diff <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  // Positions on the curved circular arc (UPRIGHT, NO TILT)
  // Left: ~140°
  const speedPos = polarToCart(140, radius - 28);
  // Center: 180°
  const limitPos = polarToCart(180, radius - 24);
  // Right: ~220°
  const etaPos = polarToCart(220, radius - 28);

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
      {/* ─── MAP CANVAS: fills the full circle ──────────────────────── */}
      {isGoogleRoute && googleLocation ? (
        <GoogleNavMap
          currentLocation={googleLocation}
          heading={heading}
          overviewPath={googleOverviewPath}
          displaySize={displaySize}
          nightMode={nightMode}
        />
      ) : (
        <MapCanvas
          riderX={riderX}
          riderY={riderY}
          heading={heading}
          width={displaySize}
          height={displaySize}
          currentWaypointIndex={currentWaypointIndex}
        />
      )}

      {/* ─── PERIMETER CURVED HUD OVERLAY ────────────────────────────── */}
      <svg
        width={displaySize}
        height={displaySize}
        viewBox={`0 0 ${displaySize} ${displaySize}`}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <defs>
          {/* Top Arc Path from Left (-60° / 300°) to Right (+60° / 60°) Clockwise */}
          <path
            id="top-hud-arc"
            d={describeClockwiseArc(305, 55, radius - 4)}
            fill="none"
          />
          {/* Radial edge vignette */}
          <radialGradient id="edge-shade" cx="50%" cy="50%" r="50%">
            <stop offset="65%" stopColor="transparent" />
            <stop offset="88%" stopColor="rgba(0,0,0,0.55)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.92)" />
          </radialGradient>
        </defs>

        <rect width={displaySize} height={displaySize} fill="url(#edge-shade)" />

        {/* Top curved track dash */}
        <path
          d={describeClockwiseArc(290, 70, radius + 2)}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Top Curved Turn & Street Text */}
        <text
          fill="#FFFFFF"
          fontSize={displaySize === 360 ? '11px' : '12px'}
          fontWeight="700"
          letterSpacing="0.14em"
          style={{ textAnchor: 'middle', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))' }}
        >
          <textPath href="#top-hud-arc" startOffset="50%">
            {topCurveText}
          </textPath>
        </text>

        {/* Bottom subtle border arc track */}
        <path
          d={describeClockwiseArc(120, 240, radius + 2)}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />
      </svg>

      {/* ─── TOP MANOEUVRE INDICATOR ─────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: displaySize === 360 ? 32 : 38,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(0,0,0,0.72)',
          padding: '4px 10px',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <NavixArrow type={manoeuvre} size={displaySize === 360 ? 19 : 22} color="#FFFFFF" />
        <span
          style={{
            fontSize: displaySize === 360 ? '14px' : '16px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
          }}
        >
          {distText}
        </span>
      </div>

      {/* ─── BOTTOM HUD: SPEEDOMETER (Left, Placed along curve, perfectly upright) ── */}
      <div
        style={{
          position: 'absolute',
          left: speedPos.x,
          top: speedPos.y,
          transform: 'translate(-50%, -50%)',
          zIndex: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.72)',
          padding: '4px 9px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <span
            style={{
              fontSize: displaySize === 360 ? '22px' : '26px',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
            }}
          >
            {Math.round(speed)}
          </span>
          <span
            style={{
              fontSize: '8px',
              color: '#888888',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            km/h
          </span>
        </div>
      </div>

      {/* ─── BOTTOM HUD: SPEED LIMIT (Center, perfectly upright) ──────── */}
      <div
        style={{
          position: 'absolute',
          left: limitPos.x,
          top: limitPos.y,
          transform: 'translate(-50%, -50%)',
          zIndex: 12,
          width: displaySize === 360 ? 26 : 30,
          height: displaySize === 360 ? 26 : 30,
          borderRadius: '50%',
          border: '2px solid #FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          fontWeight: 800,
          fontSize: displaySize === 360 ? '12px' : '13px',
          color: '#FFFFFF',
          boxShadow: '0 0 10px rgba(0,0,0,0.9)',
        }}
      >
        {speedLimit}
      </div>

      {/* ─── BOTTOM HUD: REMAINING & ETA (Right, perfectly upright) ────── */}
      <div
        style={{
          position: 'absolute',
          left: etaPos.x,
          top: etaPos.y,
          transform: 'translate(-50%, -50%)',
          zIndex: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          background: 'rgba(0,0,0,0.72)',
          padding: '4px 9px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <span
          style={{
            fontSize: displaySize === 360 ? '12px' : '14px',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.1,
          }}
        >
          {totalDistanceRemaining.toFixed(1)} km
        </span>
        <span
          style={{
            fontSize: '9px',
            color: '#888888',
            fontWeight: 600,
            marginTop: 1,
          }}
        >
          {eta}
        </span>
      </div>
    </div>
  );
};
