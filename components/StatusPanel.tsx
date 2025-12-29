
import React, { useMemo } from 'react';
import { DSKYState, DSKYStatusItem } from '../types';

interface StatusPanelProps {
  status: DSKYState['status'];
}

const StatusPanel: React.FC<StatusPanelProps> = React.memo(({ status }) => {
  const statusItems = useMemo(() => {
    return Object.entries(status)
      .map(([id, config]) => {
        const item = config as DSKYStatusItem;
        return { id: parseInt(id), ...item };
      })
      .sort((a, b) => a.id - b.id);
  }, [status]);

  return (
    <div className="grid grid-cols-3 gap-1.5 p-3 bg-[#1a1a1a] border-2 border-[#121212] rounded shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] h-full content-start">
      {statusItems.map(({ id, label, color, active }) => {
        const isRed = color === 'red';
        
        return (
          <div
            key={id}
            className={`
              status-light flex items-center justify-center px-1 
              text-[9px] font-black border-2 rounded-sm text-center leading-none 
              transition-all duration-300 uppercase
              h-12 w-full
              ${active 
                ? isRed
                  ? 'bg-[#ff1a1a] text-[#200] border-[#f55] shadow-[0_0_20px_rgba(255,26,26,0.6),inset_0_0_10px_rgba(255,255,255,0.4)] z-10'
                  : 'bg-[#ffaa00] text-[#210] border-[#ffca40] shadow-[0_0_20px_rgba(255,170,0,0.6),inset_0_0_10px_rgba(255,255,255,0.4)] z-10'
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
});

export default StatusPanel;
