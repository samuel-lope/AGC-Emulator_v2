
import React, { useState, useLayoutEffect, useRef } from 'react';
import DSKY, { DSKYHandle } from './components/DSKY';
import MissionControl from './components/MissionControl';
import { DEFAULT_FUNCTION_KEYS } from './constants';
import { FunctionKeyConfig } from './types';

const App: React.FC = () => {
  const [scale, setScale] = useState(1);
  const [isSerialConnected, setIsSerialConnected] = useState(false);
  const [isStartup, setIsStartup] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  // Track last PROG to handle modal transitions intelligently
  const lastProgRef = useRef<string>('');
  
  // Estado para armazenar configurações das teclas F1-F5
  const [functionKeys, setFunctionKeys] = useState<Record<string, FunctionKeyConfig>>(() => {
    try {
      const saved = localStorage.getItem('agc_function_keys');
      return saved ? JSON.parse(saved) : DEFAULT_FUNCTION_KEYS;
    } catch (e) {
      console.error("Error loading keys", e);
      return DEFAULT_FUNCTION_KEYS;
    }
  });

  const serialWriterRef = useRef<WritableStreamDefaultWriter | null>(null);
  const dskyRef = useRef<DSKYHandle>(null);

  // Optimized for 16:9 Full HD screens
  const BASE_WIDTH = 1920;
  const BASE_HEIGHT = 1080;

  useLayoutEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / BASE_WIDTH;
      const scaleY = window.innerHeight / BASE_HEIGHT;
      const newScale = Math.min(scaleX, scaleY) * 0.98; // Slightly larger fit
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUpdateFunctionKeys = (newKeys: Record<string, FunctionKeyConfig>) => {
    setFunctionKeys(newKeys);
    localStorage.setItem('agc_function_keys', JSON.stringify(newKeys));
  };

  const connectSerial = async () => {
    if (!('serial' in navigator)) {
      console.warn('Web Serial API not supported.');
      return;
    }

    try {
      // @ts-ignore
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      
      const textEncoder = new TextEncoderStream();
      textEncoder.readable.pipeTo(port.writable);
      const writer = textEncoder.writable.getWriter();
      serialWriterRef.current = writer;

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

  // Intercept DSKY updates to handle Serial and 'EF' Program Logic
  const handleDSKYUpdate = async (dataString: string) => {
    // 1. Check for 'EF' Program (Info/Credits Modal)
    try {
      const data = JSON.parse(dataString);
      const currentProg = data.PROG;

      // Only open modal if entering EF state from a different state
      // This prevents the modal from reopening immediately after the user closes it manually
      if (currentProg === 'EF' && lastProgRef.current !== 'EF') {
        setShowInfoModal(true);
      } 
      // Auto-close if leaving EF state (e.g. via DSKY interaction)
      else if (currentProg !== 'EF') {
        setShowInfoModal(false);
      }
      
      lastProgRef.current = currentProg;

    } catch (e) {
      // Ignore parsing errors
    }

    // 2. Send to Serial Port
    if (serialWriterRef.current) {
      try {
        await serialWriterRef.current.write(dataString + "\n");
      } catch (err) {
        console.error('Serial write error:', err);
      }
    }
  };

  const handleCloseModal = () => {
    setShowInfoModal(false);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#020202] overflow-hidden relative">
      
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

      {/* MODAL 'EF' - Now contains Mission Control */}
      {showInfoModal && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-[1000px] h-[700px] relative flex flex-col shadow-[0_0_100px_rgba(217,119,6,0.2)]">
            
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-600 z-50"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-600 z-50"></div>
            
            {/* Header do Modal */}
             <div className="flex justify-between items-end bg-[#1a1a1a] px-8 pt-6 pb-4 border-b border-amber-900/50 shrink-0">
              <div>
                <h2 className="text-3xl text-amber-500 font-bold uppercase tracking-[0.2em]">System Operations</h2>
                <p className="text-gray-500 text-xs mt-1">Mission Control Interface</p>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-600 uppercase mb-1">Return to DSKY</div>
                <button 
                  onClick={handleCloseModal}
                  className="
                    border border-amber-600/50 text-amber-500 hover:bg-amber-600 hover:text-black 
                    uppercase text-[10px] px-3 py-1 font-bold transition-all tracking-widest rounded-sm
                    shadow-[0_0_10px_rgba(217,119,6,0.1)] hover:shadow-[0_0_15px_rgba(217,119,6,0.4)]
                  "
                >
                  Close Interface
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal: Mission Control Completo */}
            <div className="flex-1 bg-[#0a0a0a] overflow-hidden flex">
               <MissionControl 
                onConnectSerial={connectSerial} 
                onSendSerial={handleDSKYUpdate}
                isSerialConnected={isSerialConnected} 
                functionKeys={functionKeys}
                onUpdateFunctionKeys={handleUpdateFunctionKeys}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Container - Centered DSKY Only */}
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
        className="flex items-center justify-center relative transition-all duration-700"
      >
        <div className="absolute inset-0 bg-radial-gradient(circle, #1a1a1a 0%, #000 80%) -z-10 texture-noise opacity-50"></div>
        
        {/* DSKY Unit - Resized for horizontal proportion */}
        <div className="w-[1024px] h-[580px] relative z-10 filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <DSKY 
            ref={dskyRef}
            onSendSerial={handleDSKYUpdate} 
            functionKeys={functionKeys}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
