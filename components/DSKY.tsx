
import React, { useState, useEffect } from 'react';
import Display from './Display';
import StatusPanel from './StatusPanel';
import Keypad from './Keypad';
import { INITIAL_STATE, FUNCTION_KEYS_MAP } from '../constants';
import { DSKYState, DSKYMode } from '../types';
import { executeCommand, executeProgram } from '../utils/commands';

interface DSKYProps {
  onSendSerial?: (data: string) => void;
}

const DSKY: React.FC<DSKYProps> = ({ onSendSerial }) => {
  const [state, setState] = useState<DSKYState>(INITIAL_STATE);
  const [mode, setMode] = useState<DSKYMode>(DSKYMode.IDLE);
  const [inputBuffer, setInputBuffer] = useState<string>('');
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [isLampTest, setIsLampTest] = useState<boolean>(false);

  useEffect(() => {
    if (mode === DSKYMode.IDLE) {
      setIsFlashing(false);
      return;
    }
    const interval = setInterval(() => setIsFlashing(f => !f), 400);
    return () => clearInterval(interval);
  }, [mode]);

  const handleKeyPress = (key: string) => {
    if (key.startsWith('F')) {
      const config = FUNCTION_KEYS_MAP[key];
      if (config) {
        setState(prev => ({
          ...prev,
          ...config,
          status: config.status ? { ...prev.status, ...config.status } : prev.status
        }));
      }
      return;
    }

    if (key === 'LAMP') {
      setIsLampTest(true);
      setTimeout(() => setIsLampTest(false), 3000);
      return;
    }

    if (key === 'RSET') {
      setState(prev => ({ ...prev, status: { ...prev.status, oprErr: false, prog: false } }));
      if (state.r1 === 'AAAAA' || state.status.restart === true) setState(INITIAL_STATE);
      return;
    }

    if (key === 'VERB') {
      setMode(DSKYMode.ENTERING_VERB);
      setInputBuffer('');
      return;
    }

    if (key === 'NOUN') {
      setMode(DSKYMode.ENTERING_NOUN);
      setInputBuffer('');
      return;
    }

    if (key === 'PROC') {
      const result = executeProgram(state.prog, state);
      const newState = { ...state, ...result };
      setState(newState);
      setMode(DSKYMode.IDLE);

      // Serial Transmission Trigger
      if (onSendSerial) {
        const payload = JSON.stringify({
          R1: `${newState.r1Sign}${newState.r1}`,
          R2: `${newState.r2Sign}${newState.r2}`,
          R3: `${newState.r3Sign}${newState.r3}`
        });
        onSendSerial(payload);
      }
      return;
    }

    if (key === 'CLR') {
      setInputBuffer('');
      return;
    }

    if (key === 'ENTR') {
      if (mode === DSKYMode.ENTERING_VERB) {
        setState(prev => ({ ...prev, verb: inputBuffer.padStart(2, '0') }));
      } else if (mode === DSKYMode.ENTERING_NOUN) {
        setState(prev => ({ ...prev, noun: inputBuffer.padStart(2, '0') }));
      } else {
        const result = executeCommand(state.verb, state.noun, state);
        setState(prev => ({ ...prev, ...result }));
      }
      setMode(DSKYMode.IDLE);
      setInputBuffer('');
      return;
    }

    if (/^[0-9]$/.test(key)) {
      const newBuf = (inputBuffer + key).slice(-5);
      setInputBuffer(newBuf);
      
      if (mode === DSKYMode.ENTERING_VERB) {
        setState(prev => ({ ...prev, verb: newBuf.slice(-2).padStart(2, '0') }));
      } else if (mode === DSKYMode.ENTERING_NOUN) {
        setState(prev => ({ ...prev, noun: newBuf.slice(-2).padStart(2, '0') }));
      }
    }
  };

  const displayValue = (val: string, length: number) => isLampTest ? 'AAAAA' : val;
  const displaySign = (sign: '+' | '-' | '') => isLampTest ? '+' : sign;
  const displayStatus = isLampTest 
    ? Object.keys(state.status).reduce((acc, k) => ({ ...acc, [k]: true }), {} as typeof state.status)
    : state.status;

  const verbGlow = isLampTest || (mode === DSKYMode.ENTERING_VERB ? isFlashing : true);
  const nounGlow = isLampTest || (mode === DSKYMode.ENTERING_NOUN ? isFlashing : true);

  return (
    <div className="dsky-panel w-full h-full p-6 rounded-xl border-4 border-[#333] flex flex-col gap-4 select-none shadow-[inset_0_2px_20px_rgba(255,255,255,0.05)] overflow-hidden">
      {/* Top Section */}
      <div className="flex gap-4 items-stretch flex-grow min-h-0 overflow-hidden">
        
        {/* Left: Status Indicators Panel (Alert Lamps) */}
        <div className="w-[30%] flex flex-col min-h-0 overflow-hidden shrink-0">
          <StatusPanel status={displayStatus} />
        </div>

        {/* Right: Integrated Display Assembly */}
        <div className="flex-1 flex bg-[#050505] p-2 rounded-lg border-2 border-[#1a1a1a] shadow-[inset_0_4px_30px_rgba(0,0,0,1)] min-h-0 overflow-hidden">
          
          {/* Column A: Operation Indicators (PROG, VERB, NOUN) */}
          <div className="flex-[0.7] flex flex-col justify-around items-center border-r border-[#222] py-2 shrink-0 overflow-hidden">
            <Display 
              label="PROG" 
              value={isLampTest ? '88' : state.prog} 
              length={2} 
              glow={true} 
              size="md"
            />
            <Display 
              label="VERB" 
              value={isLampTest ? '88' : state.verb} 
              length={2} 
              glow={verbGlow} 
              size="md"
            />
            <Display 
              label="NOUN" 
              value={isLampTest ? '88' : state.noun} 
              length={2} 
              glow={nounGlow} 
              size="md"
            />
          </div>

          {/* Column B: Data Registers (R1, R2, R3) */}
          <div className="flex-[1.3] flex flex-col justify-around items-center py-1 overflow-hidden">
            <Display sign={displaySign(state.r1Sign)} label="R1" value={displayValue(state.r1, 5)} length={5} size="lg" glow={true} />
            <Display sign={displaySign(state.r2Sign)} label="R2" value={displayValue(state.r2, 5)} length={5} size="lg" glow={true} />
            <Display sign={displaySign(state.r3Sign)} label="R3" value={displayValue(state.r3, 5)} length={5} size="lg" glow={true} />
          </div>
        </div>
      </div>

      {/* Keypad Section */}
      <div className="pt-2 border-t-2 border-[#444] shrink-0">
        <Keypad onKeyPress={handleKeyPress} compact={false} />
      </div>
    </div>
  );
};

export default DSKY;
