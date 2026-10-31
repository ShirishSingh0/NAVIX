import React from 'react';

interface BridgeIconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const BridgeIcon: React.FC<BridgeIconProps> = ({
  size = 64,
  className = '',
  color = '#FFFFFF',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Arch Bridge / Flyover Structure matching reference */}
      {/* Central arch */}
      <path
        d="M10 46C20 20 60 20 70 46"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Horizontal road deck */}
      <path
        d="M6 34H74"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* Vertical suspension / support pillars */}
      <path
        d="M26 34V22"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M40 34V18"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M54 34V22"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Bottom foundation piers */}
      <path
        d="M14 34V46"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M66 34V46"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};
