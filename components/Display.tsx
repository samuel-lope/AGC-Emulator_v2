
import React from 'react';

interface DisplayProps {
  value: string;
  length: number;
  sign?: '+' | '-' | '';
  label?: string;
  glow?: boolean;
  size?: 'sm' | 'md' | 'lg';
  flash?: boolean;
}

const Display: React.FC<DisplayProps> = React.memo(({ value, length, sign, label, glow = true, size = 'md', flash = false }) => {
  // Ensure value fits and format it
  const isNumeric = /^\d+$/.test(value);
  const displayValue = isNumeric 
    ? value.padStart(length, '0').slice(-length) 
    : value.padStart(length, ' ').slice(-length);

  // Adjusted sizes for cleaner horizontal layout (slightly more compact)
  const sizeClasses = {
    sm: { 
      label: 'w-8 text-[10px]', 
      box: 'h-8 px-1', 
      text: 'text-xl',
      gap: 'gap-1'
    },
    md: { 
      // Used for PROG, VERB, NOUN
      label: 'w-10 text-xs', 
      box: 'h-16 px-2', // Reduced from h-20
      text: 'text-5xl leading-none', 
      gap: 'gap-2'
    },
    lg: { 
      // Used for Registers (R1, R2, R3)
      label: 'w-10 text-sm', 
      box: 'h-20 px-3', // Reduced from h-24
      text: 'text-6xl leading-none', 
      gap: 'gap-3'
    }
  }[size];

  return (
    <div className={`flex items-center ${sizeClasses.gap} w-full justify-end group min-w-0`}>
      {label && (
        <span className={`${sizeClasses.label} text-gray-500 font-mono font-bold tracking-wider uppercase text-right leading-none shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300`}>
          {label}
        </span>
      )}
      <div className={`
        relative flex items-center justify-end bg-[#050505] ${sizeClasses.box} 
        border-t-2 border-l-2 border-[#000] border-b border-r border-[#222]
        rounded-sm shadow-[inset_0_4px_10px_rgba(0,0,0,1),0_1px_2px_rgba(255,255,255,0.02)]
        overflow-hidden flex-1 min-w-0
      `}>
        {/* CRT Scanline effect overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-20 opacity-40"></div>
        
        {/* Inner Glow reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-10"></div>
        
        {/* Text Content */}
        <div className={`
          font-['VT323'] text-[#39ff14] tracking-widest
          ${sizeClasses.text}
          ${glow ? 'term-glow' : 'opacity-30'}
          z-0 flex items-baseline justify-end w-full pr-2
        `}>
           {sign && (
             <span className="mr-3 opacity-80">{sign}</span>
           )}
           <span>
             {displayValue.split('').map((char, i) => (
               <span 
                 key={i} 
                 className={flash && char === '_' ? 'animate-pulse' : ''}
               >
                 {char}
               </span>
             ))}
           </span>
        </div>
      </div>
    </div>
  );
});

export default Display;
