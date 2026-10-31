import React, { useMemo } from 'react';
import type { TrafficLightState } from '../types';
import { NavixArrow } from './icons/NavixArrow';
import { ROUTE_WAYPOINTS } from '../hooks/useSimulation';

interface MapCanvasProps {
  riderX: number;
  riderY: number;
  heading: number;
  width?: number;
  height?: number;
  showTrafficLight?: boolean;
  trafficLightState?: TrafficLightState;
  currentWaypointIndex?: number;
}

// ─── ROAD NETWORK ─────────────────────────────────────────────────────────────
// Roads are defined in the same 1200×1200 coordinate space as waypoints.
// We draw the underlying city grid first, then the route on top.

const ROADS = {
  // Main route roads (wider, lighter)
  primary: [
    // Hosur Road: vertical x=300, y=50→1120
    { x1: 300, y1: 50,   x2: 300,  y2: 1120, w: 22 },
    // Church Street: horizontal y=730, x=100→820
    { x1: 100, y1: 730,  x2: 820,  y2: 730,  w: 22 },
    // Bridge Road: horizontal y=730, x=820→900 (bridge section)
    { x1: 820, y1: 730,  x2: 920,  y2: 730,  w: 22 },
    // Queens Ave: vertical x=810, y=100→750
    { x1: 810, y1: 100,  x2: 810,  y2: 750,  w: 22 },
    // Ring Road: horizontal y=300, x=200→830
    { x1: 200, y1: 300,  x2: 830,  y2: 300,  w: 22 },
    // Park Road: vertical x=490, y=60→320
    { x1: 490, y1: 60,   x2: 490,  y2: 320,  w: 18 },
    // Station Road: horizontal y=60, x=490→760
    { x1: 490, y1: 60,   x2: 760,  y2: 60,   w: 18 },
  ],
  // Secondary grid (thinner, darker)
  secondary: [
    { x1: 150, y1: 50,   x2: 150,  y2: 1120, w: 12 },
    { x1: 600, y1: 50,   x2: 600,  y2: 1120, w: 12 },
    { x1: 960, y1: 50,   x2: 960,  y2: 1120, w: 12 },
    { x1: 50,  y1: 450,  x2: 1050, y2: 450,  w: 12 },
    { x1: 50,  y1: 600,  x2: 1050, y2: 600,  w: 12 },
    { x1: 50,  y1: 900,  x2: 1050, y2: 900,  w: 12 },
    { x1: 50,  y1: 150,  x2: 1050, y2: 150,  w: 12 },
    { x1: 720, y1: 50,   x2: 720,  y2: 500,  w: 12 },
    { x1: 380, y1: 50,   x2: 380,  y2: 700,  w: 12 },
  ],
};

// City block fills (dark rectangles between roads)
const BLOCKS = [
  { x: 160, y: 60,   w: 120, h: 360 },
  { x: 160, y: 460,  w: 120, h: 120 },
  { x: 160, y: 610,  w: 120, h: 100 },
  { x: 160, y: 740,  w: 120, h: 140 },
  { x: 160, y: 910,  w: 120, h: 180 },
  { x: 310, y: 60,   w: 260, h: 360 },
  { x: 310, y: 460,  w: 260, h: 120 },
  { x: 310, y: 610,  w: 260, h: 100 },
  { x: 390, y: 740,  w: 180, h: 140 },
  { x: 310, y: 910,  w: 260, h: 180 },
  { x: 610, y: 60,   w: 90,  h: 360 },
  { x: 610, y: 460,  w: 90,  h: 120 },
  { x: 610, y: 610,  w: 90,  h: 100 },
  { x: 610, y: 740,  w: 180, h: 140 },  // space for bridge on right side
  { x: 610, y: 910,  w: 320, h: 180 },
  { x: 730, y: 60,   w: 210, h: 380 },
  { x: 820, y: 460,  w: 120, h: 120 },
  { x: 820, y: 610,  w: 120, h: 100 },
  { x: 970, y: 60,   w: 160, h: 380 },
  { x: 970, y: 460,  w: 160, h: 620 },
  { x: 500, y: 160,  w: 190, h: 120 },
  { x: 500, y: 310,  w: 280, h: 130 },
];

// Bridge segment on Church Street (x: 680→810, y=730)
const BRIDGE = { x1: 680, y1: 730, x2: 810, y2: 730 };

// Roundabout center
const ROUNDABOUT = { cx: 490, cy: 300, r: 42 };

// Traffic light position (on Queens Ave at y=450)
const TRAFFIC_LIGHT_POS = { x: 810, y: 450 };

// Route polyline through waypoints
const ROUTE_POINTS = ROUTE_WAYPOINTS.map(w => ({ x: w.x, y: w.y }));

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export const MapCanvas: React.FC<MapCanvasProps> = ({
  riderX,
  riderY,
  heading,
  width = 412,
  height = 412,
  showTrafficLight = false,
  trafficLightState = 'red',
  currentWaypointIndex = 0,
}) => {
  const cx = width / 2;
  const cy = height / 2;

  // Active route polyline only from current rider position onwards (no line behind rider)
  const remainingPolyline = useMemo(() => {
    const upcomingPoints = ROUTE_POINTS.slice(currentWaypointIndex + 1);
    const activePoints = [{ x: riderX, y: riderY }, ...upcomingPoints];
    return activePoints.map((p) => `${p.x},${p.y}`).join(' ');
  }, [currentWaypointIndex, riderX, riderY]);

  // Colours for traffic light
  const tlColors = useMemo(() => ({
    red:   trafficLightState === 'red'   ? '#ff3333' : '#330000',
    amber: trafficLightState === 'amber' ? '#ffaa00' : '#332200',
    green: trafficLightState === 'green' ? '#00cc44' : '#003311',
  }), [trafficLightState]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        background: '#0b0d0f',
        flexShrink: 0,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block' }}
      >
        <defs>
          {/* Route glow filter */}
          <filter id="rg" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Traffic light glow */}
          <filter id="tlglow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Vignette */}
          <radialGradient id="vig" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="transparent" />
            <stop offset="82%" stopColor="rgba(0,0,0,0.35)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.88)" />
          </radialGradient>
        </defs>

        {/* ── World group: rotated & panned to keep rider at center ── */}
        <g
          transform={`translate(${cx},${cy}) rotate(${-heading}) translate(${-riderX},${-riderY})`}
          style={{ transition: 'transform 0.25s cubic-bezier(0.25,0,0.1,1)' }}
        >
          {/* Map base */}
          <rect x="-500" y="-500" width="2200" height="2200" fill="#0b0d0f" />

          {/* ── City blocks ── */}
          {BLOCKS.map((b, i) => (
            <rect
              key={`b${i}`}
              x={b.x} y={b.y} width={b.w} height={b.h}
              rx="3"
              fill="#13171c"
              stroke="#1a2029"
              strokeWidth="1"
            />
          ))}

          {/* ── Secondary roads ── */}
          {ROADS.secondary.map((r, i) => (
            <line
              key={`sr${i}`}
              x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
              stroke="#1c222a"
              strokeWidth={r.w}
              strokeLinecap="round"
            />
          ))}

          {/* ── Primary roads ── */}
          {ROADS.primary.map((r, i) => (
            <line
              key={`pr${i}`}
              x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
              stroke="#252e3a"
              strokeWidth={r.w}
              strokeLinecap="round"
            />
          ))}

          {/* ── Road centre dashes (secondary) ── */}
          {ROADS.secondary.map((r, i) => (
            <line
              key={`sd${i}`}
              x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
              stroke="#1e2530"
              strokeWidth="1"
              strokeDasharray="14 10"
              strokeLinecap="round"
            />
          ))}

          {/* ── BRIDGE on Church Street x:680→810 ── */}
          {/* Bridge deck (slightly lighter road colour) */}
          <line
            x1={BRIDGE.x1} y1={BRIDGE.y1}
            x2={BRIDGE.x2} y2={BRIDGE.y2}
            stroke="#2e3a47"
            strokeWidth="26"
            strokeLinecap="round"
          />
          {/* Bridge railings */}
          <line
            x1={BRIDGE.x1} y1={BRIDGE.y1 - 14}
            x2={BRIDGE.x2} y2={BRIDGE.y2 - 14}
            stroke="#4a5c70"
            strokeWidth="2.5"
          />
          <line
            x1={BRIDGE.x1} y1={BRIDGE.y1 + 14}
            x2={BRIDGE.x2} y2={BRIDGE.y2 + 14}
            stroke="#4a5c70"
            strokeWidth="2.5"
          />
          {/* Bridge vertical struts */}
          {[700, 720, 740, 760, 780].map(bx => (
            <line key={`bs${bx}`}
              x1={bx} y1={BRIDGE.y1 - 14}
              x2={bx} y2={BRIDGE.y1 + 14}
              stroke="#3d4f61"
              strokeWidth="1.5"
            />
          ))}
          {/* Arch (decorative) */}
          <path
            d={`M ${BRIDGE.x1} ${BRIDGE.y1 - 14} Q 745 ${BRIDGE.y1 - 44} ${BRIDGE.x2} ${BRIDGE.y2 - 14}`}
            fill="none"
            stroke="#4a5c70"
            strokeWidth="2"
          />

          {/* ── ROUNDABOUT ── */}
          {/* Outer ring road */}
          <circle
            cx={ROUNDABOUT.cx} cy={ROUNDABOUT.cy} r={ROUNDABOUT.r + 12}
            fill="none"
            stroke="#252e3a"
            strokeWidth="20"
          />
          {/* Inner island */}
          <circle
            cx={ROUNDABOUT.cx} cy={ROUNDABOUT.cy} r={ROUNDABOUT.r - 10}
            fill="#13171c"
            stroke="#1a2029"
            strokeWidth="1.5"
          />
          {/* Entry roads into roundabout */}
          {/* West entry (from Ring Road) */}
          <line x1={200} y1={300} x2={ROUNDABOUT.cx - ROUNDABOUT.r - 12} y2={300}
            stroke="#252e3a" strokeWidth="22" />
          {/* East exit (Park Road north) */}
          <line x1={ROUNDABOUT.cx + ROUNDABOUT.r + 12} y1={300} x2={600} y2={300}
            stroke="#252e3a" strokeWidth="22" />
          {/* South entry (if any) */}
          <line x1={490} y1={ROUNDABOUT.cy + ROUNDABOUT.r + 12} x2={490} y2={400}
            stroke="#252e3a" strokeWidth="18" />
          {/* North exit (Park Road) */}
          <line x1={490} y1={ROUNDABOUT.cy - ROUNDABOUT.r - 12} x2={490} y2={60}
            stroke="#252e3a" strokeWidth="18" />

          {/* ── TRAFFIC LIGHT pole ── */}
          {/* Pole */}
          <line
            x1={TRAFFIC_LIGHT_POS.x + 18} y1={TRAFFIC_LIGHT_POS.y - 5}
            x2={TRAFFIC_LIGHT_POS.x + 18} y2={TRAFFIC_LIGHT_POS.y + 55}
            stroke="#333d4a"
            strokeWidth="3"
          />
          {/* Housing */}
          <rect
            x={TRAFFIC_LIGHT_POS.x + 10} y={TRAFFIC_LIGHT_POS.y - 50}
            width="16" height="46"
            rx="3"
            fill="#1a1f26"
            stroke="#2a323e"
            strokeWidth="1"
          />
          {/* Lights */}
          <circle cx={TRAFFIC_LIGHT_POS.x + 18} cy={TRAFFIC_LIGHT_POS.y - 40} r="5"
            fill={showTrafficLight ? tlColors.red : '#1f1208'}
            filter={showTrafficLight && trafficLightState === 'red' ? 'url(#tlglow)' : undefined}
          />
          <circle cx={TRAFFIC_LIGHT_POS.x + 18} cy={TRAFFIC_LIGHT_POS.y - 25} r="5"
            fill={showTrafficLight ? tlColors.amber : '#1f1208'}
            filter={showTrafficLight && trafficLightState === 'amber' ? 'url(#tlglow)' : undefined}
          />
          <circle cx={TRAFFIC_LIGHT_POS.x + 18} cy={TRAFFIC_LIGHT_POS.y - 10} r="5"
            fill={showTrafficLight ? tlColors.green : '#0a1a0e'}
            filter={showTrafficLight && trafficLightState === 'green' ? 'url(#tlglow)' : undefined}
          />

          {/* ── Always-visible dim TL (map landmark) ── */}
          {!showTrafficLight && (
            <>
              <circle cx={TRAFFIC_LIGHT_POS.x + 18} cy={TRAFFIC_LIGHT_POS.y - 40} r="4" fill="#1a0a0a" />
              <circle cx={TRAFFIC_LIGHT_POS.x + 18} cy={TRAFFIC_LIGHT_POS.y - 25} r="4" fill="#1a1200" />
              <circle cx={TRAFFIC_LIGHT_POS.x + 18} cy={TRAFFIC_LIGHT_POS.y - 10} r="4" fill="#0a1500" />
            </>
          )}

          {/* ── DESTINATION flag ── */}
          <g transform={`translate(${ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1].x - 6}, ${ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1].y - 22})`}>
            <line x1="0" y1="0" x2="0" y2="22" stroke="#FFFFFF" strokeWidth="2" />
            <rect x="0" y="0" width="7" height="5"  fill="#FFFFFF" />
            <rect x="7" y="0" width="7" height="5"  fill="#000" stroke="#FFFFFF" strokeWidth="0.5" />
            <rect x="0" y="5" width="7" height="5"  fill="#000" stroke="#FFFFFF" strokeWidth="0.5" />
            <rect x="7" y="5" width="7" height="5"  fill="#FFFFFF" />
          </g>

          {/* ── ROUTE LINE (Ahead of rider only) ── */}
          <polyline
            points={remainingPolyline}
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={remainingPolyline}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#rg)"
          />

          {/* Route direction arrows along straight segments */}
          {ROUTE_WAYPOINTS.slice(0, -2).map((wp, i) => {
            const next = ROUTE_WAYPOINTS[i + 1];
            const mx = (wp.x + next.x) / 2;
            const my = (wp.y + next.y) / 2;
            const angle = Math.atan2(next.y - wp.y, next.x - wp.x) * 180 / Math.PI + 90;
            const dist = Math.hypot(next.x - wp.x, next.y - wp.y);
            if (dist < 60) return null;
            return (
              <polygon
                key={`arr${i}`}
                points="0,-6 5,4 -5,4"
                transform={`translate(${mx},${my}) rotate(${angle})`}
                fill="rgba(255,255,255,0.35)"
              />
            );
          })}
        </g>

        {/* ── Vignette overlay ── */}
        <rect width={width} height={height} fill="url(#vig)" pointerEvents="none" />

        {/* ── Position Marker: always at center, pointing up ── */}
        <foreignObject x={cx - 20} y={cy - 20} width={40} height={40}>
          <NavixArrow type="position-marker" size={40} />
        </foreignObject>
      </svg>
    </div>
  );
};
