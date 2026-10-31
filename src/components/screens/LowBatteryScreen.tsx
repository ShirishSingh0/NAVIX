import React from 'react';
import { BatteryIcon } from '../icons/StatusIcons';

interface LowBatteryScreenProps {
  batteryLevel?: number;
}

export const LowBatteryScreen: React.FC<LowBatteryScreenProps> = ({
  batteryLevel = 15,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 20px',
        boxSizing: 'border-box',
        background: '#000000',
        color: '#FFFFFF',
        userSelect: 'none',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* Battery Icon with red low warning */}
      <div style={{ marginBottom: 18 }}>
        <BatteryIcon size={56} level={batteryLevel} isLow={true} color="#FF453A" />
      </div>

      <div
        style={{
          fontSize: '26px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
        }}
      >
        Low Battery
      </div>

      <div
        style={{
          fontSize: '15px',
          color: '#888888',
          marginTop: 6,
        }}
      >
        {batteryLevel}% remaining
      </div>
    </div>
  );
};
