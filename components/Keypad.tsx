
import React from 'react';
import { KEYPAD_LAYOUT } from '../constants';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  compact?: boolean;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress, compact = false }) => {
  const isFunctional = (key: string) => 
    ['VERB', 'NOUN', 'PROC', 'CLR', 'ENTR', 'RSET', 'LAMP', 'F1', 'F2', 'F3', 'F4', 'F5'].includes(key);

  const getLabelColor = (key: string) => {
    if (isFunctional(key)) return 'text-[#d4af37]'; // Gold/Amber para funções estilo HP 12C
    if (['+', '-'].includes(key)) return 'text-[#39ff14]'; // Verde AGC para sinais
    return 'text-[#f0f0f0]'; // Branco para números (0-9, A-F)
  };

  return (
    <div className={`grid grid-cols-6 gap-3 ${compact ? 'p-2' : 'p-4'} bg-[#121212] rounded-lg shadow-[inset_0_2px_10px_rgba(0,0,0,1)] border border-[#222]`}>
      {KEYPAD_LAYOUT.flat().map((key, i) => (
        key ? (
          <button
            key={i}
            onClick={() => onKeyPress(key)}
            className={`
              dsky-button rounded-sm flex flex-col items-center justify-center font-mono font-bold
              ${compact ? 'h-10 text-[9px]' : 'h-14 text-[11px]'}
              ${getLabelColor(key)}
              cursor-pointer select-none
            `}
          >
            <span className={`${!isFunctional(key) ? 'text-lg' : ''} leading-tight`}>
              {key}
            </span>
            {/* Legend marker (ponto dourado para teclas funcionais, simulando HP) */}
            {isFunctional(key) && (
              <div className="w-1 h-1 bg-[#d4af37]/30 rounded-full mt-1"></div>
            )}
          </button>
        ) : <div key={i} />
      ))}
    </div>
  );
};

export default Keypad;
