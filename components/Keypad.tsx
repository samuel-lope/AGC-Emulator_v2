
import React from 'react';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  compact?: boolean;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress, compact = false }) => {
  const keys = [
    ['VERB', '7', '8', '9'],
    ['NOUN', '4', '5', '6'],
    ['PROG', '1', '2', '3'],
    ['CLR', '0', '+', '-'],
    ['KEY REL', 'ENTR', 'RSET', 'LAMP']
  ];

  return (
    <div className={`grid grid-cols-4 gap-2 ${compact ? 'p-2' : 'p-4'} bg-[#222] rounded-lg border-b-4 border-r-4 border-[#111]`}>
      {keys.flat().map((key, i) => (
        key ? (
          <button
            key={i}
            onClick={() => onKeyPress(key)}
            className={`
              dsky-button rounded flex items-center justify-center font-bold shadow-md active:shadow-sm transition-all
              ${compact ? 'h-10 text-[10px]' : 'h-14 text-xs'}
              ${['VERB', 'NOUN', 'PROG', 'CLR', 'KEY REL', 'ENTR', 'RSET', 'LAMP'].includes(key) 
                ? 'bg-[#3a3a3a] text-gray-100 px-1' 
                : 'bg-[#444] text-[#39ff14] text-lg'
              }
              ${key === 'ENTR' ? 'bg-gray-700' : ''}
              ${key === 'CLR' ? 'text-red-400' : ''}
              ${key === 'LAMP' ? 'text-amber-400 border-amber-900/50' : ''}
              ${['+', '-'].includes(key) ? 'text-xl' : ''}
            `}
          >
            {key}
          </button>
        ) : <div key={i} />
      ))}
    </div>
  );
};

export default Keypad;
