
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
  const isNumeric = /^\d+$/.test(value);
  const displayValue = isNumeric 
    ? value.padStart(length, '0').slice(-length) 
    : value.padStart(length, ' ').slice(-length);

  const sizeClasses = {
    sm: { 
      label: 'w-8 text-[10px]', 
      box: 'h-8 px-1', 
      text: 'text-xl',
      gap: 'gap-1'
    },
    md: { 
      label: 'w-10 text-[11px]', 
      box: 'h-16 px-3',
      text: 'text-5xl leading-none', 
      gap: 'gap-2'
    },
    lg: { 
      label: 'w-10 text-[13px]', 
      box: 'h-20 px-4',
      text: 'text-6xl leading-none', 
      gap: 'gap-3'
    }
  }[size];

  return (
    <div className={`flex items-center ${sizeClasses.gap} w-full justify-end group min-w-0`}>
      {label && (
        <span className={`${sizeClasses.label} text-[#888] font-engraved font-bold tracking-widest uppercase text-right leading-none shrink-0 text-shadow-sm`}>
          {label}
        </span>
      )}
      
      {/* The physical display window */}
      <div className={`
        relative flex items-center justify-end bg-[#020202] ${sizeClasses.box} 
        rounded-sm overflow-hidden flex-1 min-w-0
        /* Bezel effect around the individual window */
        shadow-[inset_0_1px_3px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.1)]
        border-b border-[#222]
      `}>
        
        {/* Faint Grid Texture inside the glass */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none z-0"
          style={{ backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '4px 4px' }}
        ></div>

        {/* Text Content */}
        <div className={`
          font-['VT323'] text-[#2f6] tracking-widest
          ${sizeClasses.text}
          ${glow ? 'term-glow' : 'opacity-30'}
          z-10 flex items-baseline justify-end w-full relative
          filter drop-shadow(0 0 2px rgba(40,255,40,0.5))
        `}>
           {sign && (
             <span className="mr-3 opacity-90">{sign}</span>
           )}
           <span>
             {displayValue.split('').map((char, i) => (
               <span 
                 key={i} 
                 className={`${flash && char === '_' ? 'animate-pulse text-[#4f8]' : ''} relative inline-block`}
               >
                 {/* Ghost Segment (88) behind active number for realism */}
                 {char !== ' ' && char !== '_' && (
                   <span className="absolute left-0 top-0 text-[#112211] -z-10 select-none blur-[0.5px]">8</span>
                 )}
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
