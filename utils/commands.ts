
import { DSKYState, DSKYStatusItem } from '../types';

export interface CommandDefinition {
  description: string;
  execute: (state: DSKYState) => Partial<DSKYState>;
}

export const VERB_DICT: Record<string, string> = {
  '16': 'Monitor Noun (Decimal)',
  '21': 'Write Component 1',
  '35': 'Lamp Test',
  '37': 'Change Program',
};

export const NOUN_DICT: Record<string, string> = {
  '18': 'Desired Auto Maneuver',
  '36': 'Time (Clock)',
  '40': 'VG (Velocity to be Gained)',
  '68': 'Landing Site Lat/Long',
};

export const executeCommand = (verb: string, noun: string, state: DSKYState): Partial<DSKYState> => {
  // Simple simulator logic
  if (verb === '35') { // Lamp Test
    // Create a new status object where all are active, preserving labels/colors
    const allOnStatus: Record<number, DSKYStatusItem> = {};
    Object.entries(state.status).forEach(([key, val]) => {
      allOnStatus[parseInt(key)] = { ...val, active: true };
    });

    return {
      status: allOnStatus,
      r1: 'AAAAA', r2: 'AAAAA', r3: 'AAAAA'
    };
  }

  if (verb === '16' && noun === '36') { // Monitor Time
    const now = new Date();
    return {
      r1: now.getHours().toString().padStart(5, '0'),
      r2: now.getMinutes().toString().padStart(5, '0'),
      r3: now.getSeconds().toString().padStart(5, '0'),
    };
  }

  if (verb === '37') { // Change Program
    return { prog: noun, r1: '00000' };
  }

  // OPR ERR (4)
  const newStatus = { ...state.status };
  if (newStatus[4]) newStatus[4] = { ...newStatus[4], active: true };
  return { status: newStatus };
};

export const executeProgram = (prog: string, state: DSKYState): Partial<DSKYState> => {
  // Helper to activate specific IDs
  const activate = (ids: number[]) => {
    const s = { ...state.status };
    ids.forEach(id => {
      if(s[id]) s[id] = { ...s[id], active: true };
    });
    return s;
  };

  switch (prog) {
    case '11': // Earth Orbit Insertion
      return {
        r1: '07800', r2: '25400', r3: '00100',
        status: activate([11, 10, 7]) // vel, alt, prog
      };
    case '63': // Lunar Landing Initial Phase
      return {
        r1: '00050', r2: '00010', r3: '00005',
        status: activate([9, 10, 7]) // tracker, alt, prog
      };
    case '00':
      return { status: activate([4]) }; // opr err
    default:
      return { r1: '00000', r2: '00000', r3: '00000', status: activate([7]) }; // prog
  }
};
