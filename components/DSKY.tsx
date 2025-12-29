
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Display from './Display';
import StatusPanel from './StatusPanel';
import Keypad from './Keypad';
import { INITIAL_STATE } from '../constants';
import { DSKYState, DSKYMode, FunctionKeyConfig, DSKYStatusItem } from '../types';
import { executeCommand, executeProgram } from '../utils/commands';

interface DSKYProps {
  onSendSerial?: (data: string) => void;
  functionKeys: Record<string, FunctionKeyConfig>;
}

export interface DSKYHandle {
  triggerKey: (key: string) => void;
}

const DSKY = forwardRef<DSKYHandle, DSKYProps>(({ onSendSerial, functionKeys }, ref) => {
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

  const sendSerialUpdate = (currentState: DSKYState) => {
    if (onSendSerial) {
      // Map directly from state to payload
      const statusPayload = Object.entries(currentState.status)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([id, config]) => ({
          id: parseInt(id),
          label: config.label,
          active: config.active,
          color: config.color
        }));

      const payload = JSON.stringify({
        VERB: currentState.verb,
        NOUN: currentState.noun,
        PROG: currentState.prog,
        R1: `${currentState.r1Sign}${currentState.r1}`,
        R2: `${currentState.r2Sign}${currentState.r2}`,
        R3: `${currentState.r3Sign}${currentState.r3}`,
        STATUS: statusPayload
      });
      onSendSerial(payload);
    }
  };

  const handleKeyPress = (key: string) => {
    console.log(`DSKY Internal: Key Pressed -> ${key}`);

    // Fix: Ensure we don't trap the Hex digit 'F' as a Function Key
    // Function keys are F1, F2... (length > 1), while Hex F is just 'F'
    if (key.startsWith('F') && key.length > 1) {
      const config = functionKeys[key];
      if (config) {
        // Now fully replaces status object including labels/colors
        const newState = {
          ...state,
          verb: config.verb || state.verb,
          noun: config.noun || state.noun,
          prog: config.prog || state.prog,
          r1: config.r1 || state.r1,
          r1Sign: config.r1Sign || state.r1Sign,
          r2: config.r2 || state.r2,
          r2Sign: config.r2Sign || state.r2Sign,
          r3: config.r3 || state.r3,
          r3Sign: config.r3Sign || state.r3Sign,
          status: config.status ? JSON.parse(JSON.stringify(config.status)) : state.status
        };

        setState(newState);
        sendSerialUpdate(newState);
      }
      return;
    }

    if (key === 'LAMP') {
      setIsLampTest(true);
      setTimeout(() => setIsLampTest(false), 3000);
      return;
    }

    if (key === 'RSET') {
      const newStatus = { ...state.status };
      // Turn off errors
      if (newStatus[4]) newStatus[4] = { ...newStatus[4], active: false };
      if (newStatus[7]) newStatus[7] = { ...newStatus[7], active: false };
      
      let nextState = { ...state, status: newStatus };

      // Restart logic
      if (state.r1 === 'AAAAA' || state.status[8]?.active) {
         nextState = INITIAL_STATE;
      }
      
      setState(nextState);
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
      sendSerialUpdate(newState);
      return;
    }

    if (key === 'CLR') {
      const newState = {
        ...state,
        verb: '00',
        noun: '00',
        prog: '00',
        r1: '00000',
        r2: '00000',
        r3: '00000',
        r1Sign: '+' as const,
        r2Sign: '+' as const,
        r3Sign: '+' as const
      };

      setState(newState);
      setMode(DSKYMode.IDLE);
      setInputBuffer('');
      sendSerialUpdate(newState);
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

    // Updated Regex to allow A-F for Hexadecimal input
    if (/^[0-9A-F]$/.test(key)) {
      const newBuf = (inputBuffer + key).slice(-5);
      setInputBuffer(newBuf);
      
      if (mode === DSKYMode.ENTERING_VERB) {
        setState(prev => ({ ...prev, verb: newBuf.slice(-2).padStart(2, '0') }));
      } else if (mode === DSKYMode.ENTERING_NOUN) {
        setState(prev => ({ ...prev, noun: newBuf.slice(-2).padStart(2, '0') }));
      }
    }
  };

  useImperativeHandle(ref, () => ({
    triggerKey: handleKeyPress
  }));

  const displayValue = (val: string, length: number) => isLampTest ? 'AAAAA' : val;
  const displaySign = (sign: '+' | '-' | '') => isLampTest ? '+' : sign;
  
  // Logic for lamp test display
  const displayStatus = isLampTest 
    ? Object.keys(state.status).reduce((acc, key) => {
        const id = parseInt(key);
        acc[id] = { ...state.status[id], active: true };
        return acc;
      }, {} as Record<number, DSKYStatusItem>)
    : state.status;

  const verbGlow = isLampTest || (mode === DSKYMode.ENTERING_VERB ? isFlashing : true);
  const nounGlow = isLampTest || (mode === DSKYMode.ENTERING_NOUN ? isFlashing : true);

  return (
    <div className="dsky-panel w-full h-full p-6 rounded-xl border-4 border-[#333] flex flex-col gap-4 select-none shadow-[inset_0_2px_20px_rgba(255,255,255,0.05)] overflow-hidden">
      <div className="flex gap-4 items-stretch flex-grow min-h-0 overflow-hidden">
        <div className="w-[30%] flex flex-col min-h-0 overflow-hidden shrink-0">
          <StatusPanel status={displayStatus} />
        </div>

        <div className="flex-1 flex bg-[#050505] p-2 rounded-lg border-2 border-[#1a1a1a] shadow-[inset_0_4px_30px_rgba(0,0,0,1)] min-h-0 overflow-hidden">
          <div className="flex-[0.7] flex flex-col justify-around items-center border-r border-[#222] py-2 shrink-0 overflow-hidden">
            <Display label="PROG" value={isLampTest ? '88' : state.prog} length={2} glow={true} size="md" />
            <Display label="VERB" value={isLampTest ? '88' : state.verb} length={2} glow={verbGlow} size="md" />
            <Display label="NOUN" value={isLampTest ? '88' : state.noun} length={2} glow={nounGlow} size="md" />
          </div>

          <div className="flex-[1.3] flex flex-col justify-around items-center py-1 overflow-hidden">
            <Display sign={displaySign(state.r1Sign)} label="R1" value={displayValue(state.r1, 5)} length={5} size="lg" glow={true} />
            <Display sign={displaySign(state.r2Sign)} label="R2" value={displayValue(state.r2, 5)} length={5} size="lg" glow={true} />
            <Display sign={displaySign(state.r3Sign)} label="R3" value={displayValue(state.r3, 5)} length={5} size="lg" glow={true} />
          </div>
        </div>
      </div>
      <div className="pt-2 border-t-2 border-[#444] shrink-0">
        <Keypad onKeyPress={handleKeyPress} compact={false} />
      </div>
    </div>
  );
});

DSKY.displayName = 'DSKY';
export default DSKY;
