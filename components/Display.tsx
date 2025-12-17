
import React from 'react';

interface DisplayProps {
  value: string;
  length: number;
  sign?: '+' | '-' | '';
  label?: string;
  glow?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Display: React.FC<DisplayProps> = ({ value, length, sign, label, glow = true, size = 'md' }) => {
  const paddedValue = value.padStart(length, '0').slice(-length);
  const background = '8'.repeat(length);

  const sizeClasses = {
    sm: { label: 'w-8 text-[9px]', box: 'p-1', text: 'text-lg sm:text-xl', height: 'h-5 sm:h-6', signWidth: 'w-4' },
    md: { label: 'w-10 text-[10px] sm:text-[11px]', box: 'p-1.5', text: 'text-xl sm:text-2xl', height: 'h-7 sm:h-8', signWidth: 'w-5' },
    lg: { label: 'w-12 text-[12px] sm:text-[13px]', box: 'p-2', text: 'text-2xl sm:text-3xl', height: 'h-9 sm:h-10', signWidth: 'w-6' }
  }[size];

  return (
    <div className="flex items-center gap-2 sm:gap-4 w-full justify-center">
      {label && (
        <span className={`${sizeClasses.label} text-gray-500 font-mono font-bold tracking-[0.1em] uppercase text-right leading-none shrink-0 opacity-80`}>
          {label}
        </span>
      )}
      <div className={`relative flex items-center bg-[#050505] ${sizeClasses.box} border-2 border-[#1e1e1e] rounded-sm shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]`}>
        {sign !== undefined && (
          <div className={`mr-1 sm:mr-2 ${sizeClasses.text} segment-display text-[#a3ffcc] flex items-center justify-center ${sizeClasses.signWidth} ${sizeClasses.height}`}>
            {sign || ''}
          </div>
        )}
        <div className={`relative ${sizeClasses.height} flex items-center`}>
          {/* Background segments (dim) */}
          <div className={`segment-display segment-display-off ${sizeClasses.text} flex select-none pointer-events-none opacity-10`}>
            {background}
          </div>
          {/* Active segments */}
          <div className={`segment-display ${sizeClasses.text} relative z-10 flex ${glow ? 'brightness-125' : 'opacity-20 transition-opacity duration-300'}`}>
            {paddedValue}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Display;
