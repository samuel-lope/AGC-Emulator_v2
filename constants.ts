
import { FunctionKeyConfig, DSKYState, DSKYStatusItem } from './types';

// Default configuration for labels and colors
const DEFAULT_LABELS: Record<number, { label: string, color: 'red' | 'amber' }> = {
  0: { label: 'UPLINK ACTY', color: 'amber' },
  1: { label: 'NO ATT', color: 'red' },
  2: { label: 'STBY', color: 'amber' },
  3: { label: 'KEY REL', color: 'amber' },
  4: { label: 'OPR ERR', color: 'red' },
  5: { label: 'TEMP', color: 'red' },
  6: { label: 'GIMBAL LOCK', color: 'red' },
  7: { label: 'PROG', color: 'amber' },
  8: { label: 'RESTART', color: 'red' },
  9: { label: 'TRACKER', color: 'amber' },
  10: { label: 'ALT', color: 'amber' },
  11: { label: 'VEL', color: 'amber' },
};

// Helper to build initial status object
const buildInitialStatus = (): Record<number, DSKYStatusItem> => {
  const status: Record<number, DSKYStatusItem> = {};
  for (let i = 0; i <= 11; i++) {
    status[i] = {
      active: false,
      label: DEFAULT_LABELS[i].label,
      color: DEFAULT_LABELS[i].color
    };
  }
  // Set default active states (STBY is usually on)
  status[2].active = true; 
  return status;
};

export const INITIAL_STATE: DSKYState = {
  verb: '00',
  noun: '00',
  prog: '00',
  r1: '00000',
  r2: '00000',
  r3: '00000',
  r1Sign: '+' as const,
  r2Sign: '+' as const,
  r3Sign: '+' as const,
  status: buildInitialStatus()
};

// Helper para criar status modificado mantendo labels/cores originais se não especificado
// Agora aceita overrides de active, e opcionalmente label/color
const withStatus = (overrides: Record<number, boolean>): Record<number, DSKYStatusItem> => {
  const base = buildInitialStatus();
  Object.keys(overrides).forEach((key) => {
    const id = parseInt(key);
    if (base[id]) {
      base[id].active = overrides[id];
    }
  });
  return base;
};

// Export STATUS_LABELS for backward compatibility components if needed, 
// though we primarily use state now.
export const STATUS_LABELS = Object.entries(DEFAULT_LABELS).map(([id, val]) => ({
  id: parseInt(id),
  ...val
}));

// Definição do Layout do Teclado (6 colunas x 5 linhas)
export const KEYPAD_LAYOUT: string[][] = [
  ['A', 'B', 'C', 'D', 'E', 'F'],
  ['VERB', '7', '8', '9', 'F1', 'F2'],
  ['NOUN', '4', '5', '6', 'LAMP', 'F3'],
  ['PROC', '1', '2', '3', 'RSET', 'F4'],
  ['CLR', '-', '0', '+', 'ENTR', 'F5']
];

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
