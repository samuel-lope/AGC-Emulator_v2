
import React, { useState, useEffect } from 'react';
import Display from './Display';
import StatusPanel from './StatusPanel';
import Keypad from './Keypad';
import { INITIAL_STATE, FUNCTION_KEYS_MAP } from '../constants';
import { DSKYState, DSKYMode } from '../types';
import { executeCommand } from '../utils/commands';

const DSKY: React.FC = () => {
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
    // Lógica para as novas teclas F1-F5
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
      setTimeout(() => setIsLampTest(false), 4000);
      return;
    }

    if (key === 'RSET') {
      setState(prev => ({ ...prev, status: { ...prev.status, oprErr: false } }));
      if (state.status.restart === true) setState(INITIAL_STATE);
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

    if (key === 'PROG') {
      setMode(DSKYMode.ENTERING_PROG);
      setInputBuffer('');
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
      } else if (mode === DSKYMode.ENTERING_PROG) {
        setState(prev => ({ ...prev, prog: inputBuffer.padStart(2, '0') }));
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
      } else if (mode === DSKYMode.ENTERING_PROG) {
        setState(prev => ({ ...prev, prog: newBuf.slice(-2).padStart(2, '0') }));
      }
    }
  };

  // Determine effective display values based on lamp test state
  const displayValue = (val: string, length: number) => isLampTest ? '8'.repeat(length) : val;
  const displaySign = (sign: '+' | '-' | '') => isLampTest ? '+' : sign;
  const displayStatus = isLampTest 
    ? Object.keys(state.status).reduce((acc, k) => ({ ...acc, [k]: true }), {} as typeof state.status)
    : state.status;

  return (
    <div className="dsky-panel w-full max-w-[950px] h-full max-h-[calc(100vh-60px)] p-6 rounded-xl border-4 border-[#333] flex flex-col gap-4 select-none shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden">
      {/* Top Section */}
      <div className="flex gap-6 items-stretch flex-grow min-h-0">
        
        {/* Left: Status Indicators Panel (Alert Lamps) */}
        <div className="w-[40%] flex flex-col min-h-0">
          <StatusPanel status={displayStatus} />
        </div>

        {/* Right: Integrated Display Assembly */}
        <div className="flex-1 flex bg-[#080808] p-4 rounded-lg border-2 border-[#1a1a1a] shadow-[inset_0_4px_20px_rgba(0,0,0,0.9)] min-h-0">
          
          {/* Column A: Operation Indicators (PROG, VERB, NOUN) */}
          <div className="flex-1 flex flex-col justify-between items-center py-2 border-r border-[#222]">
            <Display 
              label="PROG" 
              value={displayValue(state.prog, 2)} 
              length={2} 
              glow={(mode !== DSKYMode.ENTERING_PROG || !isFlashing) || isLampTest} 
              size="md"
            />
            <Display 
              label="VERB" 
              value={displayValue(state.verb, 2)} 
              length={2} 
              glow={(mode !== DSKYMode.ENTERING_VERB || !isFlashing) || isLampTest} 
              size="md"
            />
            <Display 
              label="NOUN" 
              value={displayValue(state.noun, 2)} 
              length={2} 
              glow={(mode !== DSKYMode.ENTERING_NOUN || !isFlashing) || isLampTest} 
              size="md"
            />
          </div>

          {/* Column B: Data Registers (R1, R2, R3) */}
          <div className="flex-[1.5] flex flex-col justify-between items-center py-2 pl-4">
            <Display sign={displaySign(state.r1Sign)} label="R1" value={displayValue(state.r1, 5)} length={5} size="md" glow={true} />
            <Display sign={displaySign(state.r2Sign)} label="R2" value={displayValue(state.r2, 5)} length={5} size="md" glow={true} />
            <Display sign={displaySign(state.r3Sign)} label="R3" value={displayValue(state.r3, 5)} length={5} size="md" glow={true} />
          </div>
        </div>
      </div>

      {/* Keypad Section */}
      <div className="pt-2 border-t-2 border-[#444] shrink-0">
        <Keypad onKeyPress={handleKeyPress} compact />
      </div>
    </div>
  );
};

export default DSKY;
