import React from 'react';

// Bluetooth Icon (with optional disconnected slash)
export const BluetoothIcon: React.FC<{
  size?: number;
  disconnected?: boolean;
  color?: string;
  className?: string;
}> = ({ size = 40, disconnected = false, color = '#FFFFFF', className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Bluetooth Rune */}
      <path
        d="M14 13L26 23L20 28V12L26 17L14 27"
        stroke={disconnected ? '#999999' : color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {disconnected && (
        <path
          d="M10 10L30 30"
          stroke="#FF3B30"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
};

// Battery Indicator
export const BatteryIcon: React.FC<{
  size?: number;
  level?: number; // 0 - 100
  color?: string;
  isLow?: boolean;
  className?: string;
}> = ({ size = 48, level = 80, color = '#FFFFFF', isLow = false, className = '' }) => {
  const barWidth = Math.max(2, Math.min(26, (level / 100) * 26));
  const fillColor = isLow || level <= 20 ? '#FF3B30' : color;

  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox="0 0 48 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Battery Body Outline */}
      <rect
        x="3"
        y="3"
        width="36"
        height="18"
        rx="4"
        stroke={color}
        strokeWidth="2.5"
      />
      {/* Battery Positive Terminal Tip */}
      <path
        d="M41 8C42.1 8 43 8.9 43 10V14C43 15.1 42.1 16 41 16"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Battery Charge Fill Bar */}
      <rect
        x="6"
        y="6"
        width={barWidth}
        height="12"
        rx="2"
        fill={fillColor}
      />
    </svg>
  );
};

// GPS / Satellite Icon
export const GpsIcon: React.FC<{
  size?: number;
  lost?: boolean;
  color?: string;
  className?: string;
}> = ({ size = 44, lost = false, color = '#FFFFFF', className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Satellite Body angled */}
      <rect
        x="18"
        y="18"
        width="12"
        height="12"
        transform="rotate(45 24 24)"
        stroke={lost ? '#999999' : color}
        strokeWidth="2.5"
        fill="none"
      />
      {/* Solar Panel Wings */}
      <line x1="14" y1="14" x2="6" y2="6" stroke={lost ? '#999999' : color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="34" y1="34" x2="42" y2="42" stroke={lost ? '#999999' : color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="34" y1="14" x2="42" y2="6" stroke={lost ? '#999999' : color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="14" y1="34" x2="6" y2="42" stroke={lost ? '#999999' : color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Dish Beam */}
      <path
        d="M17 31C13 35 13 41 17 41"
        stroke={lost ? '#666666' : color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {lost && (
        <path
          d="M8 8L40 40"
          stroke="#FF3B30"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
};

// Smartphone Icon
export const PhoneIcon: React.FC<{
  size?: number;
  color?: string;
  className?: string;
}> = ({ size = 40, color = '#FFFFFF', className = '' }) => {
  return (
    <svg
      width={size * 0.6}
      height={size}
      viewBox="0 0 30 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="2"
        y="2"
        width="26"
        height="46"
        rx="6"
        stroke={color}
        strokeWidth="2.5"
      />
      {/* Speaker ear piece */}
      <line x1="11" y1="7" x2="19" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Screen inner window */}
      <rect x="5" y="11" width="20" height="28" rx="2" stroke="#444444" strokeWidth="1.5" />
      {/* Home bar */}
      <line x1="11" y1="43" x2="19" y2="43" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

// Crescent Moon Icon
export const MoonIcon: React.FC<{
  size?: number;
  color?: string;
  className?: string;
}> = ({ size = 48, color = '#FFFFFF', className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M34 26.5C32.9 33 27 38 20 38C11.7 38 5 31.3 5 23C5 15.6 10.4 9.5 17.5 8.2C15.8 11.2 15 14.8 15 18.5C15 28.2 22.8 36 32.5 36C33 36 33.5 36 34 26.5Z"
        fill={color}
      />
    </svg>
  );
};

// Checkered Flag Icon
export const CheckeredFlagIcon: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 56, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Flag Pole */}
      <line x1="12" y1="8" x2="12" y2="56" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="12" cy="8" r="2.5" fill="#FFFFFF" />

      {/* Flag Fabric with Checkered Pattern */}
      <g transform="translate(12, 10)">
        {/* Row 1 */}
        <rect x="0" y="0" width="8" height="7" fill="#FFFFFF" />
        <rect x="8" y="0" width="8" height="7" fill="#111111" />
        <rect x="16" y="0" width="8" height="7" fill="#FFFFFF" />
        <rect x="24" y="0" width="8" height="7" fill="#111111" />
        <rect x="32" y="0" width="8" height="7" fill="#FFFFFF" />

        {/* Row 2 */}
        <rect x="0" y="7" width="8" height="7" fill="#111111" />
        <rect x="8" y="7" width="8" height="7" fill="#FFFFFF" />
        <rect x="16" y="7" width="8" height="7" fill="#111111" />
        <rect x="24" y="7" width="8" height="7" fill="#FFFFFF" />
        <rect x="32" y="7" width="8" height="7" fill="#111111" />

        {/* Row 3 */}
        <rect x="0" y="14" width="8" height="7" fill="#FFFFFF" />
        <rect x="8" y="14" width="8" height="7" fill="#111111" />
        <rect x="16" y="14" width="8" height="7" fill="#FFFFFF" />
        <rect x="24" y="14" width="8" height="7" fill="#111111" />
        <rect x="32" y="14" width="8" height="7" fill="#FFFFFF" />

        {/* Row 4 */}
        <rect x="0" y="21" width="8" height="7" fill="#111111" />
        <rect x="8" y="21" width="8" height="7" fill="#FFFFFF" />
        <rect x="16" y="21" width="8" height="7" fill="#111111" />
        <rect x="24" y="21" width="8" height="7" fill="#FFFFFF" />
        <rect x="32" y="21" width="8" height="7" fill="#111111" />

        {/* Flag Border Outline */}
        <rect x="0" y="0" width="40" height="28" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
      </g>
    </svg>
  );
};

// Reroute Circular Rotating Arrow
export const RerouteIcon: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 64, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 270 degree circular arc */}
      <path
        d="M48 24C45 16 38 10 29 11C18 12 10 21 11 32C12 43 21 51 32 51C41 51 49 44 51 35"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Arrowhead at top */}
      <path
        d="M38 23L49 23L49 12"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
