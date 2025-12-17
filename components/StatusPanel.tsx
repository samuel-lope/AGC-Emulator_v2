
import React from 'react';
import { STATUS_LABELS } from '../constants';
import { DSKYState } from '../types';

interface StatusPanelProps {
  status: DSKYState['status'];
}

const StatusPanel: React.FC<StatusPanelProps> = ({ status }) => {
  return (
    <div className="grid grid-cols-2 gap-1 p-2 bg-[#1a1a1a] border-2 border-[#121212] rounded shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] h-full overflow-hidden">
      {STATUS_LABELS.map(({ id, label, color }) => (
        <div
          key={id}
          className={`
            status-light flex items-center justify-center px-0.5 text-[7px] sm:text-[8px] font-bold border border-black rounded-sm text-center leading-tight transition-all duration-300 h-full min-h-[30px]
            ${status[id as keyof typeof status] 
              ? `${color} bg-gray-800 shadow-[0_0_10px_rgba(255,255,255,0.1)] brightness-150` 
              : 'text-gray-900 bg-[#0c0c0c] border-[#1a1a1a] opacity-30'
            }
          `}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default StatusPanel;
