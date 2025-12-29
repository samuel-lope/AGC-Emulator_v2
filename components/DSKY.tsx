
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

      // Restart logic (Triggers only if RESTART light (8) is active or LAMP test artifact)
      if (state.r1 === 'AAAAA' || state.status[8]?.active) {
         nextState = INITIAL_STATE;
      }
      
      setState(nextState);
      // FORCE SERIAL UPDATE ON RESET
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
      // Program ED Logic
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
      const editingModes = [
        DSKYMode.ENTERING_VERB, 
        DSKYMode.ENTERING_NOUN, 
        DSKYMode.ENTERING_R1, 
        DSKYMode.ENTERING_R2, 
        DSKYMode.ENTERING_R3
      ];

      // Caso 1: Se estiver editando, limpa apenas o buffer/campo atual
      if (editingModes.includes(mode)) {
        setInputBuffer('');
        
        // Atualiza visualmente o estado para Verb/Noun imediatamente para refletir o zero
        if (mode === DSKYMode.ENTERING_VERB) {
          setState(prev => ({ ...prev, verb: '00' }));
        } else if (mode === DSKYMode.ENTERING_NOUN) {
          setState(prev => ({ ...prev, noun: '00' }));
        }
        // Para R1/R2/R3, a limpeza do inputBuffer já é refletida no render via variável r1Val/etc
        return;
      }

      // Caso 2: Se não estiver editando, acende a luz RESTART
      // O usuário precisará pressionar RSET para efetivar o reset
      const newStatus = { ...state.status };
      if (newStatus[8]) {
        newStatus[8] = { ...newStatus[8], active: true }; // 8 = RESTART
      }

      const newState = { ...state, status: newStatus };
      setState(newState);
      sendSerialUpdate(newState);
      return;
    }

    // New logic for Sign (+/-) keys
    if (key === '+' || key === '-') {
      const sign = key as '+' | '-';
      if (mode === DSKYMode.ENTERING_R1) {
        setState(prev => ({ ...prev, r1Sign: sign }));
        return;
      }
      if (mode === DSKYMode.ENTERING_R2) {
        setState(prev => ({ ...prev, r2Sign: sign }));
        return;
      }
      if (mode === DSKYMode.ENTERING_R3) {
        setState(prev => ({ ...prev, r3Sign: sign }));
        return;
      }
      return;
    }

    if (key === 'ENTR') {
      let newState = { ...state };
      let shouldUpdate = false;

      if (mode === DSKYMode.ENTERING_VERB) {
        newState.verb = inputBuffer.padStart(2, '0');
        shouldUpdate = true;
      } else if (mode === DSKYMode.ENTERING_NOUN) {
        newState.noun = inputBuffer.padStart(2, '0');
        shouldUpdate = true;
      } else if (mode === DSKYMode.ENTERING_R1) {
        newState.r1 = inputBuffer.padStart(5, '0');
        shouldUpdate = true;
      } else if (mode === DSKYMode.ENTERING_R2) {
        newState.r2 = inputBuffer.padStart(5, '0');
        shouldUpdate = true;
      } else if (mode === DSKYMode.ENTERING_R3) {
        newState.r3 = inputBuffer.padStart(5, '0');
        shouldUpdate = true;
      } else {
        // IDLE Execute Command
        const result = executeCommand(state.verb, state.noun, state);
        newState = { ...state, ...result };
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        setState(newState);
        // FORCE SERIAL UPDATE ON ENTER (UNCONDITIONAL)
        sendSerialUpdate(newState);
      }
      
      setMode(DSKYMode.IDLE);
      setInputBuffer('');
      return;
    }

    // Updated Regex to allow A-F for Hexadecimal input
    if (/^[0-9A-F]$/.test(key)) {
      // Determine max length based on what we are editing
      const isRegisterEdit = [DSKYMode.ENTERING_R1, DSKYMode.ENTERING_R2, DSKYMode.ENTERING_R3].includes(mode);
      const maxLength = isRegisterEdit ? 5 : 2;

      const newBuf = (inputBuffer + key).slice(-maxLength);
      setInputBuffer(newBuf);
      
      // Update display immediately for Verb/Noun only (Standard AGC behavior typically shows entry)
      // For Registers, we use the display logic to show buffer, but don't commit to state yet
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

  // Glow Logic
  const verbGlow = isLampTest || (mode === DSKYMode.ENTERING_VERB ? isFlashing : true);
  const nounGlow = isLampTest || (mode === DSKYMode.ENTERING_NOUN ? isFlashing : true);
  const r1Glow = isLampTest || (mode === DSKYMode.ENTERING_R1 ? isFlashing : true);
  const r2Glow = isLampTest || (mode === DSKYMode.ENTERING_R2 ? isFlashing : true);
  const r3Glow = isLampTest || (mode === DSKYMode.ENTERING_R3 ? isFlashing : true);

  // Value Logic (Show InputBuffer if editing that specific field)
  const r1Val = mode === DSKYMode.ENTERING_R1 ? inputBuffer.padStart(5, '0') : state.r1;
  const r2Val = mode === DSKYMode.ENTERING_R2 ? inputBuffer.padStart(5, '0') : state.r2;
  const r3Val = mode === DSKYMode.ENTERING_R3 ? inputBuffer.padStart(5, '0') : state.r3;

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
            <Display sign={displaySign(state.r1Sign)} label="R1" value={displayValue(r1Val, 5)} length={5} size="lg" glow={r1Glow} />
            <Display sign={displaySign(state.r2Sign)} label="R2" value={displayValue(r2Val, 5)} length={5} size="lg" glow={r2Glow} />
            <Display sign={displaySign(state.r3Sign)} label="R3" value={displayValue(r3Val, 5)} length={5} size="lg" glow={r3Glow} />
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
