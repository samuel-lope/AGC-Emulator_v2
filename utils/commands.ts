
import { DSKYState } from '../types';

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
    return {
      status: Object.keys(state.status).reduce((acc, key) => ({ ...acc, [key]: true }), {} as DSKYState['status']),
      r1: '88888', r2: '88888', r3: '88888'
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
    // Agora o programa assume o valor do Noun inserido
    return { prog: noun, r1: '00000' };
  }

  return { status: { ...state.status, oprErr: true } };
};
