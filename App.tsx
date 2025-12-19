
import React, { useState, useEffect, useLayoutEffect } from 'react';
import DSKY from './components/DSKY';
import MissionControl from './components/MissionControl';

const App: React.FC = () => {
  const [scale, setScale] = useState(1);

  const BASE_WIDTH = 1200;
  const BASE_HEIGHT = 620;

  useLayoutEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / BASE_WIDTH;
      const scaleY = window.innerHeight / BASE_HEIGHT;
      // Mantém a proporção usando o menor valor de escala (contain)
      const newScale = Math.min(scaleX, scaleY) * 0.95; // 0.95 para deixar uma margem de respiro
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Inicial

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      <div 
        style={{ 
          width: `${BASE_WIDTH}px`, 
          height: `${BASE_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-out'
        }}
        className="flex flex-row gap-6 p-6 bg-[#1a1a1a] rounded-2xl border-2 border-[#333] shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-20"></div>
        
        {/* Left Side: The DSKY Main Unit */}
        <div className="w-[720px] shrink-0">
          <DSKY />
        </div>

        {/* Right Side: Mission Control Docs & Logs */}
        <div className="flex-1 flex flex-col gap-4">
          <header className="shrink-0">
            <h1 className="text-gray-600 font-mono text-[10px] uppercase tracking-[0.4em] mb-1">Block II AGC System</h1>
            <div className="h-px w-full bg-gradient-to-r from-gray-800 to-transparent"></div>
          </header>
          
          <MissionControl />

          <footer className="text-gray-700 font-mono text-[9px] uppercase tracking-wider opacity-40 mt-auto">
            NASA MSC - Raytheon / MIT Simulation — Apollo Guidance Computer Replica
          </footer>
        </div>
      </div>
    </div>
  );
};

export default App;
