
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
    stby: false,
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
