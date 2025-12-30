
import React from 'react';
import { KEYPAD_LAYOUT } from '../constants';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  compact?: boolean;
}

const Keypad: React.FC<KeypadProps> = React.memo(({ onKeyPress, compact = false }) => {
  const isFunctional = (key: string) => 
    ['VERB', 'NOUN', 'PROC', 'CLR', 'ENTR', 'RSET', 'LAMP', 'F1', 'F2', 'F3', 'F4', 'F5'].includes(key);

  const getLabelColor = (key: string) => {
    if (isFunctional(key)) return 'text-[#d4af37]';
    if (['+', '-'].includes(key)) return 'text-[#39ff14]';
    return 'text-[#f0f0f0]';
  };

  return (
    <div className={`grid grid-cols-6 gap-4 ${compact ? 'p-2' : 'p-6'} bg-[#121212] rounded-lg shadow-[inset_0_2px_10px_rgba(0,0,0,1)] border border-[#222] h-full content-center`}>
      {KEYPAD_LAYOUT.flat().map((key, i) => (
        key ? (
          <button
            key={i}
            onClick={() => onKeyPress(key)}
            className={`
              dsky-button rounded-sm flex flex-col items-center justify-center font-mono font-bold
              ${compact ? 'h-10 text-[9px]' : 'h-20 text-xl'} 
              ${getLabelColor(key)}
              cursor-pointer select-none active:scale-[0.98] w-full
            `}
          >
            <span className={`${!isFunctional(key) ? 'text-3xl' : 'text-lg'} leading-tight tracking-wider`}>
              {key}
            </span>
            {isFunctional(key) && (
              <div className="w-1.5 h-1.5 bg-[#d4af37]/40 rounded-full mt-1.5 shadow-[0_0_5px_rgba(212,175,55,0.2)]"></div>
            )}
          </button>
        ) : <div key={i} />
      ))}
    </div>
  );
});

export default Keypad;
