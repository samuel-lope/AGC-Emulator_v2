
import React, { useState, useLayoutEffect, useRef } from 'react';
import DSKY, { DSKYHandle } from './components/DSKY';
import MissionControl from './components/MissionControl';

const App: React.FC = () => {
  const [scale, setScale] = useState(1);
  const [isSerialConnected, setIsSerialConnected] = useState(false);
  const [isStartup, setIsStartup] = useState(true);
  
  const serialWriterRef = useRef<WritableStreamDefaultWriter | null>(null);
  const dskyRef = useRef<DSKYHandle>(null);

  const BASE_WIDTH = 1200;
  const BASE_HEIGHT = 620;

  useLayoutEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / BASE_WIDTH;
      const scaleY = window.innerHeight / BASE_HEIGHT;
      const newScale = Math.min(scaleX, scaleY) * 0.95;
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const connectSerial = async () => {
    if (!('serial' in navigator)) {
      console.warn('Web Serial API not supported.');
      return;
    }

    try {
      // @ts-ignore
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      
      // Apenas configura o Writer (Envio de dados)
      const textEncoder = new TextEncoderStream();
      textEncoder.readable.pipeTo(port.writable);
      const writer = textEncoder.writable.getWriter();
      serialWriterRef.current = writer;

      // Não configuramos Reader (Recepção) conforme solicitado
      setIsSerialConnected(true);

    } catch (err: any) {
      console.log('Serial connect error/cancel:', err);
      setIsSerialConnected(false);
    }
  };

  const handleSystemStart = async () => {
    await connectSerial();
    setIsStartup(false);
  };

  const sendSerialData = async (data: string) => {
    if (serialWriterRef.current) {
      try {
        await serialWriterRef.current.write(data + "\n");
      } catch (err) {
        console.error('Serial write error:', err);
      }
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative">
      
      {/* Tela de Inicialização Vintage */}
      {isStartup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-8 p-12 border-4 border-[#d4af37] rounded-lg shadow-[0_0_50px_rgba(212,175,55,0.2)] bg-[#121212] max-w-md text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-mono font-bold text-[#d4af37] tracking-[0.2em] uppercase">AGC Block II</h1>
              <div className="h-0.5 w-full bg-[#d4af37]/30"></div>
              <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mt-2">Guidance & Navigation System</p>
            </div>

            <div className="text-[#39ff14] font-mono text-xs leading-relaxed opacity-80 border border-[#39ff14]/20 p-4 rounded bg-[#0a1a0a]">
              <p>SYSTEM READY FOR INITIALIZATION.</p>
              <p className="mt-2">SERIAL TELEMETRY LINK WILL BE REQUESTED.</p>
            </div>

            <button 
              onClick={handleSystemStart}
              className="
                group relative px-8 py-4 bg-[#1a1a1a] border-2 border-[#d4af37] text-[#d4af37] 
                font-mono font-bold tracking-widest uppercase transition-all duration-100
                hover:bg-[#d4af37] hover:text-[#000] active:scale-95
              "
            >
              <span className="relative z-10">Initialize System</span>
              <div className="absolute inset-0 bg-[#d4af37]/10 group-hover:bg-transparent"></div>
            </button>
            
            <p className="text-[9px] text-gray-600 font-mono uppercase">MIT Instrumentation Laboratory</p>
          </div>
        </div>
      )}

      <div 
        style={{ 
          width: `${BASE_WIDTH}px`, 
          height: `${BASE_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-out',
          opacity: isStartup ? 0 : 1, 
          filter: isStartup ? 'blur(10px)' : 'none'
        }}
        className="flex flex-row gap-6 p-6 bg-[#1a1a1a] rounded-2xl border-2 border-[#333] shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden transition-all duration-700"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-20"></div>
        
        <div className="w-[720px] shrink-0">
          <DSKY 
            ref={dskyRef}
            onSendSerial={sendSerialData} 
          />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <header className="shrink-0 flex justify-between items-end mb-1">
            <div>
              <h1 className="text-gray-600 font-mono text-[10px] uppercase tracking-[0.4em] mb-1">Block II AGC System</h1>
              <div className="h-px w-32 bg-gradient-to-r from-gray-800 to-transparent"></div>
            </div>
          </header>
          
          <MissionControl 
            onConnectSerial={connectSerial} 
            isSerialConnected={isSerialConnected} 
          />

          <footer className="text-gray-700 font-mono text-[9px] uppercase tracking-wider opacity-40 mt-auto">
            NASA MSC - Raytheon / MIT Simulation — Apollo Guidance Computer Replica
          </footer>
        </div>
      </div>
    </div>
  );
};

export default App;
