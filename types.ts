
export enum DSKYMode {
  IDLE = 'IDLE',
  ENTERING_VERB = 'ENTERING_VERB',
  ENTERING_NOUN = 'ENTERING_NOUN',
  ENTERING_DATA = 'ENTERING_DATA'
}

export interface DSKYStatusItem {
  active: boolean;
  label: string;
  color: 'red' | 'amber';
}

export interface DSKYState {
  verb: string;
  noun: string;
  prog: string;
  r1: string;
  r2: string;
  r3: string;
  r1Sign: '+' | '-' | '';
  r2Sign: '+' | '-' | '';
  r3Sign: '+' | '-' | '';
  // Status keys are now objects containing full config
  status: Record<number, DSKYStatusItem>;
}

export interface FunctionKeyConfig {
  key: string; // 'F1', 'F2', etc
  label: string; // Descrição curta para a UI
  verb: string;
  noun: string;
  prog: string;
  r1: string; r1Sign: '+' | '-' | '';
  r2: string; r2Sign: '+' | '-' | '';
  r3: string; r3Sign: '+' | '-' | '';
  status: DSKYState['status'];
}

export interface VerbNounCommand {
  verb: string;
  noun?: string;
  description: string;
  action: (state: DSKYState) => Partial<DSKYState> | Promise<Partial<DSKYState>>;
}
