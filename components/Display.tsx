
import React from 'react';
import Digit16Seg from './Digit16Seg';

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
  // Normalize value logic
  let displayString = value;
  
  // If numeric, pad with zeros or match formatting
  const isNumeric = /^\d+$/.test(value);
  if (isNumeric) {
    displayString = value.padStart(length, '0').slice(-length);
  } else {
    // For editing modes (like inputBuffer) or errors
    displayString = value.padStart(length, ' ').slice(-length);
  }

  // Split into individual characters for component mapping
  const chars = displayString.split('');

  // Size definitions refactored for better fit within 1024px layout
  // Reduced widths and heights to prevent overflow
  const sizeClasses = {
    sm: { 
      label: 'w-8 text-[9px]', 
      container: 'h-8 px-1 gap-[1px]', 
      digitWidth: 'w-3',
      signWidth: 'w-2'
    },
    md: { 
      // Used for PROG, VERB, NOUN
      label: 'w-10 text-[10px]', 
      container: 'h-14 px-2 gap-0.5', // Reduced from h-16
      digitWidth: 'w-9', // Reduced from w-9
      signWidth: 'w-6'
    },
    lg: { 
      // Used for R1, R2, R3
      label: 'w-10 text-[11px]', 
      container: 'h-16 gap-1', // Reduced from h-20, px-4, NO HORIZONTAL PADDING
      digitWidth: 'w-7', // Reduced from w-11
      signWidth: 'w-6'  // Reduced from w-10
    }
  }[size];

  return (
    <div className="flex items-center w-full justify-end min-w-0">
      {/* Label (PROG, NOUN, etc) */}
      {label && (
        <span className={`${sizeClasses.label} text-[#888] font-engraved font-bold tracking-widest uppercase text-right leading-none shrink-0 mr-2 text-shadow-sm`}>
          {label}
        </span>
      )}
      
      {/* The Physical Housing for this Register */}
      <div className={`
        relative flex items-center bg-[#020202] ${sizeClasses.container}
        rounded-sm overflow-hidden flex-shrink-0
        shadow-[inset_0_2px_5px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.05)]
        border-b border-[#1a1a1a]
        border-t border-[#000]
        max-w-full
      `}>
        
        {/* Subtle Mesh Grid Background behind the glass */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none z-0"
          style={{ 
            backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)', 
            backgroundSize: '4px 4px' 
          }}
        ></div>

        {/* SIGN SLOT (Only rendered if sign prop is passed) */}
        {sign !== undefined && (
          <div className={`relative h-[90%] ${sizeClasses.signWidth} flex items-center justify-center z-10`}>
             <Digit16Seg char={sign} active={true} className={glow ? 'drop-shadow-[0_0_5px_rgba(50,255,50,0.5)]' : ''} />
             
             {/* Physical partition line between sign and numbers */}
             <div className="absolute right-[-2px] top-1 bottom-1 w-[1px] bg-[#111]"></div>
          </div>
        )}

        {/* DIGIT SLOTS */}
        {chars.map((char, index) => {
           // Determine flashing state for this specific character
           const isFlashing = flash && (char === '_' || char === ' '); 
           const shouldBeActive = !isFlashing;

           return (
            <div key={index} className={`relative h-[90%] ${sizeClasses.digitWidth} flex items-center justify-center z-10`}>
              <Digit16Seg 
                char={char} 
                active={shouldBeActive} 
                className={glow && shouldBeActive ? 'drop-shadow-[0_0_5px_rgba(50,255,50,0.5)]' : ''}
              />
            </div>
           );
        })}

        {/* Glass Reflection Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-20"></div>
      </div>
    </div>
  );
});

export default Display;
