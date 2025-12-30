
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
  const [isLampTest, setIsLampTest] = useState<boolean>(false);

  const sendSerialUpdate = (currentState: DSKYState) => {
    if (onSendSerial) {
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
    // ... logic remains same ...
    if (key.startsWith('F') && key.length > 1) {
      const config = functionKeys[key];
      if (config) {
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
      if (newStatus[4]) newStatus[4] = { ...newStatus[4], active: false };
      if (newStatus[7]) newStatus[7] = { ...newStatus[7], active: false };
      
      let nextState = { ...state, status: newStatus };
      if (state.r1 === 'AAAAA' || state.status[8]?.active) {
         nextState = INITIAL_STATE;
      }
      
      setState(nextState);
      sendSerialUpdate(nextState);
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
      if (state.prog === 'ED') {
        if (state.noun === '01') {
          setMode(DSKYMode.ENTERING_R1);
          setInputBuffer('');
          return;
        }
        if (state.noun === '02') {
          setMode(DSKYMode.ENTERING_R2);
          setInputBuffer('');
          return;
        }
        if (state.noun === '03') {
          setMode(DSKYMode.ENTERING_R3);
          setInputBuffer('');
          return;
        }
      }

      const result = executeProgram(state.prog, state);
      const newState = { ...state, ...result };
      setState(newState);
      setMode(DSKYMode.IDLE);
      sendSerialUpdate(newState);
      return;
    }

    if (key === 'CLR') {
      const editingModes = [DSKYMode.ENTERING_VERB, DSKYMode.ENTERING_NOUN, DSKYMode.ENTERING_R1, DSKYMode.ENTERING_R2, DSKYMode.ENTERING_R3];
      if (editingModes.includes(mode)) {
        setInputBuffer('');
        return;
      }
      const newStatus = { ...state.status };
      if (newStatus[8]) newStatus[8] = { ...newStatus[8], active: true };
      const newState = { ...state, status: newStatus };
      setState(newState);
      sendSerialUpdate(newState);
      return;
    }

    if (key === '+' || key === '-') {
      const sign = key as '+' | '-';
      if (mode === DSKYMode.ENTERING_R1) { setState(prev => ({ ...prev, r1Sign: sign })); return; }
      if (mode === DSKYMode.ENTERING_R2) { setState(prev => ({ ...prev, r2Sign: sign })); return; }
      if (mode === DSKYMode.ENTERING_R3) { setState(prev => ({ ...prev, r3Sign: sign })); return; }
      return;
    }

    if (key === 'ENTR') {
      let newState = { ...state };
      let shouldUpdate = false;

      if (mode === DSKYMode.ENTERING_VERB) { newState.verb = inputBuffer.padStart(2, '0'); shouldUpdate = true; } 
      else if (mode === DSKYMode.ENTERING_NOUN) { newState.noun = inputBuffer.padStart(2, '0'); shouldUpdate = true; } 
      else if (mode === DSKYMode.ENTERING_R1) { newState.r1 = inputBuffer.padStart(5, '0'); shouldUpdate = true; } 
      else if (mode === DSKYMode.ENTERING_R2) { newState.r2 = inputBuffer.padStart(5, '0'); shouldUpdate = true; } 
      else if (mode === DSKYMode.ENTERING_R3) { newState.r3 = inputBuffer.padStart(5, '0'); shouldUpdate = true; } 
      else {
        const result = executeCommand(state.verb, state.noun, state);
        newState = { ...state, ...result };
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        setState(newState);
        sendSerialUpdate(newState);
      }
      setMode(DSKYMode.IDLE);
      setInputBuffer('');
      return;
    }

    if (/^[0-9A-F]$/.test(key)) {
      const isRegisterEdit = [DSKYMode.ENTERING_R1, DSKYMode.ENTERING_R2, DSKYMode.ENTERING_R3].includes(mode);
      const maxLength = isRegisterEdit ? 5 : 2;
      const newBuf = (inputBuffer + key).slice(-maxLength);
      setInputBuffer(newBuf);
    }
  };

  useImperativeHandle(ref, () => ({
    triggerKey: handleKeyPress
  }));

  const displaySign = (sign: '+' | '-' | '') => isLampTest ? '+' : sign;
  
  const displayStatus = isLampTest 
    ? Object.keys(state.status).reduce((acc, key) => {
        const id = parseInt(key);
        acc[id] = { ...state.status[id], active: true };
        return acc;
      }, {} as Record<number, DSKYStatusItem>)
    : state.status;

  const getRenderValue = (editing: boolean, length: number, actualValue: string) => {
    if (isLampTest) return 'AAAAA'.slice(0, length);
    if (editing) return inputBuffer.padStart(length, '_');
    return actualValue;
  }

  const progVal = isLampTest ? '88' : state.prog;
  const verbVal = getRenderValue(mode === DSKYMode.ENTERING_VERB, 2, state.verb);
  const nounVal = getRenderValue(mode === DSKYMode.ENTERING_NOUN, 2, state.noun);
  const r1Val = getRenderValue(mode === DSKYMode.ENTERING_R1, 5, state.r1);
  const r2Val = getRenderValue(mode === DSKYMode.ENTERING_R2, 5, state.r2);
  const r3Val = getRenderValue(mode === DSKYMode.ENTERING_R3, 5, state.r3);

  const glow = true;

  return (
    <div className="relative w-full h-full p-4 select-none">
      
      {/* Outer Case (Mounting Plate) */}
      <div className="absolute inset-0 bg-[#0f0f11] rounded-lg shadow-2xl border border-[#222]"></div>
      
      {/* Main Metal Faceplate */}
      <div className="absolute inset-2 panel-metal texture-noise rounded shadow-inner flex flex-row gap-4 p-8 border-t border-white/10 border-b border-black/50">
        
        {/* Screws */}
        <div className="absolute top-3 left-3 screw"></div>
        <div className="absolute top-3 right-3 screw"></div>
        <div className="absolute bottom-3 left-3 screw"></div>
        <div className="absolute bottom-3 right-3 screw"></div>

        {/* Left Column: Status (Top) + Displays (Bottom) - Reduced to 55% */}
        <div className="w-[55%] flex flex-col gap-6 h-full relative z-10">
          
          {/* Status Panel Area */}
          <div className="shrink-0 bg-black/40 p-1 rounded-sm border-b border-white/5 shadow-lg">
             <StatusPanel status={displayStatus} />
          </div>

          {/* Displays Area (Beveled Housing) */}
          <div className="flex-1 flex bg-[#050505] p-6 rounded border-4 border-[#0a0a0a] shadow-[inset_0_0_20px_rgba(0,0,0,1)] gap-6 min-h-0 overflow-hidden items-center relative glass-panel">
             
             {/* Divider Line */}
             <div className="absolute top-0 bottom-0 left-[38%] w-0.5 bg-[#222] opacity-50 border-l border-black border-r border-white/10"></div>

             {/* Column 1: PROG / VERB / NOUN */}
             <div className="w-[38%] flex flex-col justify-center gap-6 pr-4 shrink-0 h-full relative">
               <div className="flex flex-col gap-1">
                  <Display label="PROG" value={progVal} length={2} glow={glow} size="md" />
               </div>
               
               <div className="flex flex-col gap-3">
                  <Display label="VERB" value={verbVal} length={2} glow={glow} size="md" flash={mode === DSKYMode.ENTERING_VERB} />
                  <Display label="NOUN" value={nounVal} length={2} glow={glow} size="md" flash={mode === DSKYMode.ENTERING_NOUN} />
               </div>
             </div>

             {/* Column 2: Registers R1 / R2 / R3 */}
             <div className="flex-1 flex flex-col justify-center gap-6 pl-4 min-w-0 h-full">
               <Display sign={displaySign(state.r1Sign)} label="R1" value={r1Val} length={5} size="lg" glow={glow} flash={mode === DSKYMode.ENTERING_R1} />
               <Display sign={displaySign(state.r2Sign)} label="R2" value={r2Val} length={5} size="lg" glow={glow} flash={mode === DSKYMode.ENTERING_R2} />
               <Display sign={displaySign(state.r3Sign)} label="R3" value={r3Val} length={5} size="lg" glow={glow} flash={mode === DSKYMode.ENTERING_R3} />
             </div>
          </div>
        </div>

        {/* Right Column: Keypad - Increased to 45% and reduced padding */}
        <div className="w-[45%] h-full flex flex-col justify-center relative z-10 pl-2 border-l border-white/5 shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.5)]">
           {/* Engraved Label - Repositioned slightly */}
           <div className="absolute top-2 right-2 text-[#666] font-engraved text-[10px] tracking-widest opacity-50 uppercase z-0">
              Raytheon
           </div>
          <Keypad onKeyPress={handleKeyPress} compact={false} />
        </div>
      </div>
    </div>
  );
});

DSKY.displayName = 'DSKY';
export default DSKY;
