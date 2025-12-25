
import { FunctionKeyConfig } from './types';

// IDs sequenciais para os status:
// 0: UPLINK ACTY
// 1: NO ATT
// 2: STBY
// 3: KEY REL
// 4: OPR ERR
// 5: TEMP
// 6: GIMBAL LOCK
// 7: PROG
// 8: RESTART
// 9: TRACKER
// 10: ALT
// 11: VEL

export const STATUS_LABELS = [
  { id: 0, label: 'UPLINK ACTY', color: 'text-amber-400' },
  { id: 1, label: 'NO ATT', color: 'text-red-500' },
  { id: 2, label: 'STBY', color: 'text-amber-400' },
  { id: 3, label: 'KEY REL', color: 'text-amber-400' },
  { id: 4, label: 'OPR ERR', color: 'text-red-500' },
  { id: 5, label: 'TEMP', color: 'text-red-500' },
  { id: 6, label: 'GIMBAL LOCK', color: 'text-red-500' },
  { id: 7, label: 'PROG', color: 'text-amber-400' },
  { id: 8, label: 'RESTART', color: 'text-red-500' },
  { id: 9, label: 'TRACKER', color: 'text-amber-400' },
  { id: 10, label: 'ALT', color: 'text-amber-400' },
  { id: 11, label: 'VEL', color: 'text-amber-400' },
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
    0: false, // uplinkActy
    1: false, // noAtt
    2: true,  // stby
    3: false, // keyRel
    4: false, // oprErr
    5: false, // temp
    6: false, // gimbalLock
    7: false, // prog
    8: false, // restart
    9: false, // tracker
    10: false, // alt
    11: false, // vel
  }
};

const EMPTY_STATUS = INITIAL_STATE.status;

// Helper para criar status modificado
const withStatus = (overrides: Record<number, boolean>) => ({
  ...EMPTY_STATUS,
  ...overrides
});

// Configuração padrão das teclas de função
export const DEFAULT_FUNCTION_KEYS: Record<string, FunctionKeyConfig> = {
  'F1': {
    key: 'F1',
    label: 'Orbit Insertion',
    verb: '37', noun: '11', prog: '11',
    r1: '0AB37', r1Sign: '+',
    r2: '00000', r2Sign: '+',
    r3: '00000', r3Sign: '+',
    // restart(8), vel(11), alt(10)
    status: withStatus({ 8: true, 11: true, 10: true })
  },
  'F2': {
    key: 'F2',
    label: 'Descent Prep',
    verb: '06', noun: '63', prog: '63',
    r1: '00000', r1Sign: '+',
    r2: '00900', r2Sign: '-',
    r3: '00000', r3Sign: '+',
    // uplinkActy(0), stby(2), oprErr(4), temp(5)
    status: withStatus({ 0: true, 2: true, 4: true, 5: true })
  },
  'F3': {
    key: 'F3',
    label: 'Gimbal Reset',
    verb: '40', noun: '20', prog: '00',
    r1: '00000', r1Sign: '+',
    r2: '00000', r2Sign: '+',
    r3: '12345', r3Sign: '+',
    // gimbalLock(6), noAtt(1), oprErr(4), temp(5)
    status: withStatus({ 6: true, 1: true, 4: true, 5: true })
  },
  'F4': {
    key: 'F4',
    label: 'Clock Sync',
    verb: '16', noun: '36', prog: '00',
    r1: '00000', r1Sign: '+',
    r2: '00000', r2Sign: '+',
    r3: '00000', r3Sign: '+',
    // restart(8)
    status: withStatus({ 8: true })
  },
  'F5': {
    key: 'F5',
    label: 'Sys Diagnostic',
    verb: '35', noun: '00', prog: '00',
    r1: 'A8944', r1Sign: '-',
    r2: 'F0200', r2Sign: '-',
    r3: 'E010C', r3Sign: '-',
    // alt(10), vel(11), tracker(9), oprErr(4), temp(5)
    status: withStatus({ 10: true, 11: true, 9: true, 4: true, 5: true })
  }
};
