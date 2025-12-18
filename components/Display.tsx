
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

const Display: React.FC<DisplayProps> = ({ value, length, sign, label, glow = true, size = 'md' }) => {
  const paddedValue = value.padStart(length, '0').slice(-length);
  
  const sizeClasses = {
    sm: { label: 'w-8 text-[9px]', box: 'h-8 px-1', digitHeight: 'h-6' },
    md: { label: 'w-10 text-[10px] sm:text-[11px]', box: 'h-12 px-2', digitHeight: 'h-9' },
    lg: { label: 'w-12 text-[12px] sm:text-[13px]', box: 'h-16 px-3', digitHeight: 'h-12' }
  }[size];

  return (
    <div className="flex items-center gap-2 sm:gap-4 w-full justify-center group">
      {label && (
        <span className={`${sizeClasses.label} text-gray-500 font-mono font-bold tracking-[0.1em] uppercase text-right leading-none shrink-0 opacity-80 group-hover:opacity-100 transition-opacity`}>
          {label}
        </span>
      )}
      <div className={`relative flex items-center bg-[#020402] ${sizeClasses.box} border-b border-r border-[#2a352a] rounded-sm shadow-[inset_0_2px_15px_rgba(0,0,0,1)]`}>
        {sign !== undefined && (
          <div className={`${sizeClasses.digitHeight} flex items-center justify-center mr-2`}>
            <Digit16Seg char={sign || ''} active={glow} className={sizeClasses.digitHeight} />
          </div>
        )}
        <div className="flex gap-1">
          {paddedValue.split('').map((char, idx) => (
            <div key={idx} className={sizeClasses.digitHeight}>
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
};

export default Display;
