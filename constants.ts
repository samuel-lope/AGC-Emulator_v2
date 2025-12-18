
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

// Configuração das teclas de função customizadas
export const FUNCTION_KEYS_MAP: Record<string, any> = {
  'F1': {
    status: { restart: true },
    r1: '88888',
    r2: 'AAAAA',
    r1Sign: '+'
  },
  'F2': {
    status: { uplinkActy: true, stby: true, oprErr: true, temp: true },
    r2: '00900',
    r2Sign: '-'
  },
  'F3': {
    status: { gimbalLock: true, noAtt: true, oprErr: true, temp: true },
    r3: '12345',
    r3Sign: '+'
  },
  'F4': {
    status: { restart: true },
    prog: '00',
    verb: '16',
    noun: '36'
  },
  'F5': {
    status: { alt: true, vel: true, tracker: true, oprErr: true, temp: true },
    r1: '00408',
    r2: '00200',
    r3: '00100',
    r1Sign: '+',
    r2Sign: '+',
    r3Sign: '+'
  }
};
