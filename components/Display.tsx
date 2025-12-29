
import React from 'react';
import Digit16Seg from './Digit16Seg';

interface DisplayProps {
  value: string;
  length: number;
  sign?: '+' | '-' | '';
  label?: string;
  glow?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Display: React.FC<DisplayProps> = React.memo(({ value, length, sign, label, glow = true, size = 'md' }) => {
  const paddedValue = value.padStart(length, '0').slice(-length);
  
  // Revised sizes for 1600x900 base resolution
  const sizeClasses = {
    sm: { 
      label: 'w-10 text-[10px]', 
      box: 'h-10 px-2', 
      digitHeight: 'h-6',
      gap: 'gap-1'
    },
    md: { 
      // Used for PROG, VERB, NOUN
      label: 'w-14 text-[12px]', 
      box: 'h-[4.5rem] px-3', // ~72px height
      digitHeight: 'h-[2.5rem]', // ~40px digit
      gap: 'gap-2'
    },
    lg: { 
      // Used for Registers (R1, R2, R3)
      label: 'w-16 text-[14px]', 
      box: 'h-[5.5rem] px-4', // ~88px height
      digitHeight: 'h-[3.5rem]', // ~56px digit
      gap: 'gap-3'
    }
  }[size];

  return (
    <div className="flex items-center gap-3 w-full justify-start pl-1 group min-w-0">
      {label && (
        <span className={`${sizeClasses.label} text-gray-500 font-mono font-bold tracking-wider uppercase text-right leading-none shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300`}>
          {label}
        </span>
      )}
      <div className={`
        relative flex items-center bg-[#010101] ${sizeClasses.box} 
        border-t-2 border-l-2 border-[#000] border-b border-r border-[#222]
        rounded-sm shadow-[inset_0_4px_10px_rgba(0,0,0,1),0_1px_2px_rgba(255,255,255,0.02)]
        overflow-hidden shrink-0
      `}>
        {/* Glass reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-10"></div>
        
        {sign !== undefined && (
          <div className={`${sizeClasses.digitHeight} flex items-center justify-center mr-3 scale-110`}>
            <Digit16Seg char={sign || ''} active={glow} className={sizeClasses.digitHeight} />
          </div>
        )}
        
        <div className={`flex ${sizeClasses.gap} items-center`}>
          {paddedValue.split('').map((char, idx) => (
            <div key={idx} className={`${sizeClasses.digitHeight} flex items-center`}>
              <Digit16Seg 
                char={glow && value === 'AAAAA' ? 'AAAAA' : char} 
                active={glow} 
                className={sizeClasses.digitHeight} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Display;
