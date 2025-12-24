
import { FunctionKeyConfig } from './types';

export const STATUS_LABELS = [
  { id: 'uplinkActy', label: 'UPLINK ACTY', color: 'text-amber-400' },
  { id: 'noAtt', label: 'NO ATT', color: 'text-red-500' },
  { id: 'stby', label: 'STBY', color: 'text-amber-400' },
  { id: 'keyRel', label: 'KEY REL', color: 'text-amber-400' },
  { id: 'oprErr', label: 'OPR ERR', color: 'text-red-500' },
  { id: 'temp', label: 'TEMP', color: 'text-red-500' },
  { id: 'gimbalLock', label: 'GIMBAL LOCK', color: 'text-red-500' },
  { id: 'prog', label: 'PROG', color: 'text-amber-400' },
  { id: 'restart', label: 'RESTART', color: 'text-red-500' },
  { id: 'tracker', label: 'TRACKER', color: 'text-amber-400' },
  { id: 'alt', label: 'ALT', color: 'text-amber-400' },
  { id: 'vel', label: 'VEL', color: 'text-amber-400' },
];

export const INITIAL_STATE = {
  verb: '00',
  noun: '00',
  prog: '00',
  r1: '00000',
  r2: '00000',
  r3: '00000',
  r1Sign: '+' as const,
  r2Sign: '+' as const,
  r3Sign: '+' as const,
  status: {
    uplinkActy: false,
    noAtt: false,
    stby: true,
    keyRel: false,
    oprErr: false,
    temp: false,
    gimbalLock: false,
    prog: false,
    restart: false,
    tracker: false,
    alt: false,
    vel: false,
  }
};

const EMPTY_STATUS = INITIAL_STATE.status;

// Configuração padrão das teclas de função
export const DEFAULT_FUNCTION_KEYS: Record<string, FunctionKeyConfig> = {
  'F1': {
    key: 'F1',
    label: 'Orbit Insertion',
    verb: '37', noun: '11', prog: '11',
    r1: '0AB37', r1Sign: '+',
    r2: '00000', r2Sign: '+',
    r3: '00000', r3Sign: '+',
    status: { ...EMPTY_STATUS, restart: true, vel: true, alt: true }
  },
  'F2': {
    key: 'F2',
    label: 'Descent Prep',
    verb: '06', noun: '63', prog: '63',
    r1: '00000', r1Sign: '+',
    r2: '00900', r2Sign: '-',
    r3: '00000', r3Sign: '+',
    status: { ...EMPTY_STATUS, uplinkActy: true, stby: true, oprErr: true, temp: true }
  },
  'F3': {
    key: 'F3',
    label: 'Gimbal Reset',
    verb: '40', noun: '20', prog: '00',
    r1: '00000', r1Sign: '+',
    r2: '00000', r2Sign: '+',
    r3: '12345', r3Sign: '+',
    status: { ...EMPTY_STATUS, gimbalLock: true, noAtt: true, oprErr: true, temp: true }
  },
  'F4': {
    key: 'F4',
    label: 'Clock Sync',
    verb: '16', noun: '36', prog: '00',
    r1: '00000', r1Sign: '+',
    r2: '00000', r2Sign: '+',
    r3: '00000', r3Sign: '+',
    status: { ...EMPTY_STATUS, restart: true }
  },
  'F5': {
    key: 'F5',
    label: 'Sys Diagnostic',
    verb: '35', noun: '00', prog: '00',
    r1: 'A8944', r1Sign: '-',
    r2: 'F0200', r2Sign: '-',
    r3: 'E010C', r3Sign: '-',
    status: { ...EMPTY_STATUS, alt: true, vel: true, tracker: true, oprErr: true, temp: true }
  }
};
