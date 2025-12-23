
import React from 'react';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  compact?: boolean;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress, compact = false }) => {
  const keys = [
    ['VERB', '7', '8', '9', 'F1'],
    ['NOUN', '4', '5', '6', 'F2'],
    ['PROC', '1', '2', '3', 'F3'],
    ['CLR', '0', '+', '-', 'F4'],
    ['KEY REL', 'ENTR', 'RSET', 'LAMP', 'F5']
  ];

  const isFunctional = (key: string) => 
    ['VERB', 'NOUN', 'PROC', 'CLR', 'KEY REL', 'ENTR', 'RSET', 'LAMP', 'F1', 'F2', 'F3', 'F4', 'F5'].includes(key);

  const getLabelColor = (key: string) => {
    if (isFunctional(key)) return 'text-[#d4af37]'; // Gold/Amber para funções estilo HP 12C
    if (['+', '-'].includes(key)) return 'text-[#39ff14]'; // Verde AGC para sinais
    return 'text-[#f0f0f0]'; // Branco para números
  };

  return (
    <div className={`grid grid-cols-5 gap-3 ${compact ? 'p-2' : 'p-4'} bg-[#121212] rounded-lg shadow-[inset_0_2px_10px_rgba(0,0,0,1)] border border-[#222]`}>
      {keys.flat().map((key, i) => (
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
