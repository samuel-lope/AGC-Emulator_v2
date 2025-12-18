
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
    // Agora o programa assume o valor do Noun inserido
    return { prog: noun, r1: '00000' };
  }

  return { status: { ...state.status, oprErr: true } };
};

export const executeProgram = (prog: string, state: DSKYState): Partial<DSKYState> => {
  // Simulação de programas pré-gravados
  switch (prog) {
    case '11': // Earth Orbit Insertion (EOI)
      return {
        r1: '07800', r2: '25400', r3: '00100',
        status: { ...state.status, vel: true, alt: true, prog: true }
      };
    case '63': // Lunar Landing Initial Phase
      return {
        r1: '00050', r2: '00010', r3: '00005',
        status: { ...state.status, tracker: true, alt: true, prog: true }
      };
    case '00':
      return { status: { ...state.status, oprErr: true } };
    default:
      // Se for um programa desconhecido, apenas limpa os registros
      return { r1: '00000', r2: '00000', r3: '00000', status: { ...state.status, prog: true } };
  }
};
