import React from 'react';

interface RoundaboutIconProps {
  size?: number;
  exitNumber?: number; // 1, 2, 3, etc.
  className?: string;
}

export const RoundaboutIcon: React.FC<RoundaboutIconProps> = ({
  size = 140,
  exitNumber = 2,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background road network: 4 branches entering roundabout */}
      {/* South entry road */}
      <line x1="80" y1="150" x2="80" y2="108" stroke="#333333" strokeWidth="14" strokeLinecap="round" />
      {/* East exit (1st exit) */}
      <line x1="108" y1="80" x2="150" y2="80" stroke="#333333" strokeWidth="14" strokeLinecap="round" />
      {/* North exit (2nd exit) */}
      <line x1="80" y1="52" x2="80" y2="10" stroke="#333333" strokeWidth="14" strokeLinecap="round" />
      {/* West exit (3rd exit) */}
      <line x1="52" y1="80" x2="10" y2="80" stroke="#333333" strokeWidth="14" strokeLinecap="round" />

      {/* Roundabout circular ring - base road */}
      <circle cx="80" cy="80" r="28" stroke="#333333" strokeWidth="14" fill="none" />
      <circle cx="80" cy="80" r="18" fill="#000000" />

      {/* Dim exit arrows for inactive exits */}
      {exitNumber !== 1 && (
        <path d="M136 74L146 80L136 86" stroke="#555555" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {exitNumber !== 3 && (
        <path d="M24 74L14 80L24 86" stroke="#555555" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      )}

      {/* Active Route Highlight (pure white) */}
      {exitNumber === 2 ? (
        <>
          {/* Active path: Enters south, wraps counter-clockwise around right half, exits north */}
          <path
            d="M80 148V108A28 28 0 0 0 108 80A28 28 0 0 0 80 52V14"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Arrowhead at North exit */}
          <path
            d="M72 22L80 12L88 22"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : exitNumber === 1 ? (
        <>
          {/* Active path: Enters south, takes 1st exit east */}
          <path
            d="M80 148V108A28 28 0 0 0 108 80H146"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M138 72L148 80L138 88"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          {/* Active path: Enters south, circles to West 3rd exit */}
          <path
            d="M80 148V108A28 28 0 0 0 108 80A28 28 0 0 0 80 52A28 28 0 0 0 52 80H14"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M22 72L12 80L22 88"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}

      {/* Center island hub */}
      <circle cx="80" cy="80" r="14" fill="#141414" stroke="#2a2a2a" strokeWidth="2" />

      {/* Position dot entering roundabout */}
      <circle cx="80" cy="136" r="4.5" fill="#FFFFFF" />
    </svg>
  );
};
