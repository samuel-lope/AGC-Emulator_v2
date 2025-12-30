
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
    <div className="grid grid-cols-3 gap-3 p-4 bg-[#080808] border border-[#222] rounded shadow-[inset_0_5px_15px_rgba(0,0,0,1)] h-full content-start">
      {statusItems.map(({ id, label, color, active }) => {
        const isRed = color === 'red';
        
        return (
          <div
            key={id}
            className={`
              status-bulb flex items-center justify-center px-2
              text-[14px] font-engraved font-bold border border-black rounded-[2px] text-center leading-none 
              transition-all duration-300 uppercase
              h-12 w-full tracking-wider select-none
              ${active 
                ? isRed ? 'active-red' : 'active-amber'
                : 'text-[#333] opacity-40'
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
