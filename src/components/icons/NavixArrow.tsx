import React from 'react';
import type { ManoeuvreType } from '../../types';

interface NavixArrowProps {
  type?: ManoeuvreType | 'brand-logo' | 'position-marker';
  size?: number;
  className?: string;
  color?: string;
}

export const NavixArrow: React.FC<NavixArrowProps> = ({
  type = 'straight',
  size = 48,
  className = '',
  color = '#FFFFFF',
}) => {
  if (type === 'brand-logo') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* NAVIX brand navigation arrowhead icon */}
        <path
          d="M38 10L14 26L23 28L25 37L38 10Z"
          fill={color}
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === 'position-marker') {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Subtle pulsating radar halo */}
        <div
          style={{
            position: 'absolute',
            width: size * 1.35,
            height: size * 1.35,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 60%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
        {/* Crisp vector navigation arrowhead (SVG recreated exactly from uploaded image) */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.85)) drop-shadow(0 0 10px rgba(255,255,255,0.35))',
          }}
        >
          {/* Outer glowing white arrowhead with smooth rounded vertices */}
          <path
            d="M256 32 C278 32, 298 56, 312 80 L466 388 C484 424, 468 468, 430 478 C406 484, 380 472, 362 454 L256 394 L150 454 C132 472, 106 484, 82 478 C44 468, 28 424, 46 388 L200 80 C214 56, 234 32, 256 32 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    );
  }

  // Large Bold Manoeuvre arrows
  switch (type) {
    case 'straight':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M32 10L18 24M32 10L46 24M32 10V52"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'turn-right':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Thick sweeping right turn arrow matching the reference */}
          <path
            d="M32 82V48C32 37 41 28 52 28H76"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M60 12L78 28L60 44"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'turn-left':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M68 82V48C68 37 59 28 48 28H24"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M40 12L22 28L40 44"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'slight-right':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M26 54V38C26 31 30 25 36 21L48 13"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M36 10H50V24"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'slight-left':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M38 54V38C38 31 34 25 28 21L16 13"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M28 10H14V24"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'u-turn':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M46 54V28C46 18 38 12 28 12C18 12 18 20 18 26V48"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M9 40L18 50L27 40"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'roundabout':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <circle cx="32" cy="32" r="16" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
          <path
            d="M32 54V48"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M32 48A16 16 0 0 1 16 32A16 16 0 0 1 32 16"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M32 16V8"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M26 14L32 8L38 14"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    default:
      return null;
  }
};
