
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
    if (isFunctional(key)) return 'text-[#fff]'; 
    if (['+', '-'].includes(key)) return 'text-[#fff]';
    return 'text-[#fff]';
  };

  return (
    <div className={`
      grid grid-cols-6 grid-rows-5 gap-2 
      ${compact ? 'p-1' : 'p-2'} 
      bg-[#121212] rounded border-2 border-[#000] 
      shadow-[inset_0_2px_10px_rgba(0,0,0,1)] 
      h-full w-full box-border texture-noise relative z-10
    `}>
      {KEYPAD_LAYOUT.flat().map((key, i) => (
        key ? (
          <div key={i} className="key-socket h-full w-full">
            <button
              onClick={() => onKeyPress(key)}
              className={`
                dsky-button-physical w-full h-full rounded-sm flex flex-col items-center justify-center font-sans font-bold
                ${compact ? 'text-[9px]' : 'text-xl'} 
                ${getLabelColor(key)}
                cursor-pointer select-none
              `}
            >
              <span className={`
                ${!isFunctional(key) ? 'text-3xl' : 'text-sm'} 
                leading-tight tracking-wide drop-shadow-md opacity-90
              `}>
                {key}
              </span>
              
              {/* Optional: Gold accent dot for functional keys */}
              {isFunctional(key) && !['+', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key) && (
                 <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full mt-1.5 opacity-70 shadow-[0_0_2px_#d4af37]"></div>
              )}
            </button>
          </div>
        ) : <div key={i} />
      ))}
    </div>
  );
});

export default Keypad;
