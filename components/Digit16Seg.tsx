
import React, { useMemo } from 'react';

interface Digit16SegProps {
  char: string;
  active?: boolean;
  className?: string;
}

const SEGMENT_MAP: Record<string, string[]> = {
  '0': ['a1', 'a2', 'b', 'c', 'd1', 'd2', 'e', 'f', 'j', 'k'], // Diagonal j,k optional for zero style, removed here for standard 0
  '0_ALT': ['a1', 'a2', 'b', 'c', 'd1', 'd2', 'e', 'f', 'j', 'm'], // Slased zero
  '1': ['b', 'c'],
  '2': ['a1', 'a2', 'b', 'g1', 'g2', 'e', 'd1', 'd2'],
  '3': ['a1', 'a2', 'b', 'g1', 'g2', 'c', 'd1', 'd2'],
  '4': ['f', 'b', 'g1', 'g2', 'c'],
  '5': ['a1', 'a2', 'f', 'g1', 'g2', 'c', 'd1', 'd2'],
  '6': ['a1', 'a2', 'f', 'e', 'c', 'd1', 'd2', 'g1', 'g2'],
  '7': ['a1', 'a2', 'b', 'c'],
  '8': ['a1', 'a2', 'f', 'b', 'g1', 'g2', 'e', 'c', 'd1', 'd2'],
  '9': ['a1', 'a2', 'f', 'b', 'g1', 'g2', 'c', 'd1', 'd2'],
  'A': ['a1', 'a2', 'f', 'b', 'g1', 'g2', 'e', 'c'],
  'B': ['a1', 'a2', 'i', 'l', 'b', 'c', 'd1', 'd2', 'g2'],
  'C': ['a1', 'a2', 'f', 'e', 'd1', 'd2'],
  'D': ['a1', 'a2', 'i', 'l', 'b', 'c', 'd1', 'd2'],
  'E': ['a1', 'a2', 'f', 'e', 'g1', 'g2', 'd1', 'd2'],
  'F': ['a1', 'a2', 'f', 'e', 'g1', 'g2'],
  '+': ['g1', 'g2', 'i', 'l'],
  '-': ['g1', 'g2'],
  '_': ['d1', 'd2'],
  ' ': [],
  'AAAAA': ['a1', 'a2', 'f', 'b', 'g1', 'g2', 'e', 'c', 'd1', 'd2', 'h', 'i', 'j', 'k', 'l', 'm'],
};

// Ensure map is robust for '0' standard look
SEGMENT_MAP['0'] = ['a1', 'a2', 'b', 'c', 'd1', 'd2', 'e', 'f'];

const STYLE_ON = {
  fill: '#4ff', // Slightly more cyan/green mix for EL display
  filter: 'drop-shadow(0 0 3px rgba(60, 255, 100, 0.9))',
  opacity: 1,
};

const STYLE_OFF = {
  fill: '#1a221a', // Very dark green-grey for unlit segments
  opacity: 0.3, // Visible "ghost" segments
};

const Digit16Seg: React.FC<Digit16SegProps> = React.memo(({ char, active = true, className = "" }) => {
  const activeSegments = useMemo(() => {
    // Handle uppercase automatically
    const key = char.toUpperCase();
    return SEGMENT_MAP[key] || SEGMENT_MAP[' '] || [];
  }, [char]);

  const getStyle = (segId: string) => {
    const isOn = active && (activeSegments.includes(segId) || char === 'AAAAA');
    // If char is empty space, dim everything completely? No, keep ghosts for realism
    return isOn ? STYLE_ON : STYLE_OFF;
  };

  return (
    <svg viewBox="0 0 100 160" className={`h-full w-full overflow-visible ${className}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="glow-blur">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <g transform="skewX(-4)"> {/* Slight italic skew often found in displays */}
        {/* Top horizontal */}
        <path d="M15 10 L45 10 L42 18 L18 18 Z" style={getStyle('a1')} />
        <path d="M55 10 L85 10 L82 18 L58 18 Z" style={getStyle('a2')} />
        
        {/* Outer verticals */}
        <path d="M8 15 L8 75 L16 72 L16 18 Z" style={getStyle('f')} />
        <path d="M92 15 L92 75 L84 72 L84 18 Z" style={getStyle('b')} />
        <path d="M8 85 L8 145 L16 142 L16 88 Z" style={getStyle('e')} />
        <path d="M92 85 L92 145 L84 142 L84 88 Z" style={getStyle('c')} />

        {/* Center horizontal */}
        <path d="M18 76 L45 76 L42 84 L15 84 Z" style={getStyle('g1')} />
        <path d="M55 76 L82 76 L85 84 L58 84 Z" style={getStyle('g2')} />

        {/* Bottom horizontal */}
        <path d="M18 142 L42 142 L45 150 L15 150 Z" style={getStyle('d1')} />
        <path d="M58 142 L82 142 L85 150 L55 150 Z" style={getStyle('d2')} />

        {/* Inner Verticals */}
        <path d="M47 18 L53 18 L53 72 L47 72 Z" style={getStyle('i')} />
        <path d="M47 88 L53 88 L53 142 L47 142 Z" style={getStyle('l')} />

        {/* Diagonals Top */}
        <path d="M20 22 L26 22 L45 70 L39 70 Z" style={getStyle('h')} />
        <path d="M80 22 L74 22 L55 70 L61 70 Z" style={getStyle('j')} />

        {/* Diagonals Bottom */}
        <path d="M45 90 L39 90 L20 138 L26 138 Z" style={getStyle('k')} />
        <path d="M55 90 L61 90 L80 138 L74 138 Z" style={getStyle('m')} />
      </g>
    </svg>
  );
});

export default Digit16Seg;
