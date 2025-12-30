
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
    <div className="grid grid-cols-3 gap-2 p-4 bg-[#1a1a1a] border-2 border-[#121212] rounded shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] h-full content-start">
      {statusItems.map(({ id, label, color, active }) => {
        const isRed = color === 'red';
        
        return (
          <div
            key={id}
            className={`
              status-light flex items-center justify-center px-2 py-1
              text-lg font-['VT323'] border-2 rounded-sm text-center leading-none 
              transition-all duration-200 uppercase
              h-16 w-full tracking-wide
              ${active 
                ? isRed
                  ? 'bg-[#330000] text-[#ff3333] border-[#550000] term-glow-red z-10'
                  : 'bg-[#332200] text-[#ffcc00] border-[#553300] term-glow-amber z-10'
                : 'text-[#444] bg-[#0a0a0a] border-[#151515] opacity-60 grayscale'
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
