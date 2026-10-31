import React from 'react';
import type { TrafficLightState } from '../../types';

interface TrafficLightIconProps {
  state?: TrafficLightState;
  size?: number;
  className?: string;
}

export const TrafficLightIcon: React.FC<TrafficLightIconProps> = ({
  state = 'red',
  size = 56,
  className = '',
}) => {
  const isRed = state === 'red';
  const isAmber = state === 'amber';
  const isGreen = state === 'green';

  return (
    <svg
      width={size * 0.44}
      height={size}
      viewBox="0 0 44 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Glow filters for active lights */}
        <filter id="red-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="amber-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="green-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Traffic Light Housing Pill */}
      <rect
        x="2"
        y="2"
        width="40"
        height="96"
        rx="20"
        fill="#0a0a0a"
        stroke="#2e2e2e"
        strokeWidth="2.5"
      />

      {/* Visor caps above lights */}
      <path d="M12 20C12 16 32 16 32 20" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 50C12 46 32 46 32 50" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 80C12 76 32 76 32 80" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" />

      {/* RED Light (Top) */}
      <circle
        cx="22"
        cy="22"
        r="10"
        fill={isRed ? '#FF3B30' : '#2b0909'}
        stroke={isRed ? '#FF6B64' : '#1a0505'}
        strokeWidth="1.5"
        filter={isRed ? 'url(#red-glow)' : undefined}
      />
      {isRed && <circle cx="20" cy="20" r="3" fill="#FFFFFF" opacity="0.6" />}

      {/* AMBER / YELLOW Light (Middle) */}
      <circle
        cx="22"
        cy="50"
        r="10"
        fill={isAmber ? '#FFCC00' : '#2b2207'}
        stroke={isAmber ? '#FFE066' : '#1a1403'}
        strokeWidth="1.5"
        filter={isAmber ? 'url(#amber-glow)' : undefined}
      />
      {isAmber && <circle cx="20" cy="48" r="3" fill="#FFFFFF" opacity="0.6" />}

      {/* GREEN Light (Bottom) */}
      <circle
        cx="22"
        cy="78"
        r="10"
        fill={isGreen ? '#34C759' : '#08250f'}
        stroke={isGreen ? '#68DF86' : '#051408'}
        strokeWidth="1.5"
        filter={isGreen ? 'url(#green-glow)' : undefined}
      />
      {isGreen && <circle cx="20" cy="76" r="3" fill="#FFFFFF" opacity="0.6" />}
    </svg>
  );
};
