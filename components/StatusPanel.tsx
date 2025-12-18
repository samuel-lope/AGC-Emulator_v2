
import React from 'react';
import { STATUS_LABELS } from '../constants';
import { DSKYState } from '../types';

interface StatusPanelProps {
  status: DSKYState['status'];
}

const StatusPanel: React.FC<StatusPanelProps> = ({ status }) => {
  return (
    <div className="grid grid-cols-3 gap-1 p-2 bg-[#1a1a1a] border-2 border-[#121212] rounded shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] h-full overflow-hidden">
      {STATUS_LABELS.map(({ id, label, color }) => {
        const isActive = status[id as keyof typeof status];
        const isRed = color.includes('red');
        
        return (
          <div
            key={id}
            className={`
              status-light flex items-center justify-center px-0.5 text-[6px] sm:text-[8px] font-black border rounded-sm text-center leading-[1.1] transition-all duration-300 h-full min-h-[40px] uppercase
              ${isActive 
                ? isRed
                  ? 'bg-[#ff1a1a] text-[#200] border-[#f55] shadow-[0_0_20px_rgba(255,26,26,0.6),inset_0_0_10px_rgba(255,255,255,0.4)] z-10 scale-[1.02]'
                  : 'bg-[#ffaa00] text-[#210] border-[#ffca40] shadow-[0_0_20px_rgba(255,170,0,0.6),inset_0_0_10px_rgba(255,255,255,0.4)] z-10 scale-[1.02]'
                : 'text-[#7a6d45] bg-[#141411] border-[#1a1a16] opacity-70'
              }
            `}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default StatusPanel;
