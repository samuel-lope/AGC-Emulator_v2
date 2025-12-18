
export enum DSKYMode {
  IDLE = 'IDLE',
  ENTERING_VERB = 'ENTERING_VERB',
  ENTERING_NOUN = 'ENTERING_NOUN',
  ENTERING_DATA = 'ENTERING_DATA'
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
  status: {
    uplinkActy: boolean;
    noAtt: boolean;
    stby: boolean;
    keyRel: boolean;
    oprErr: boolean;
    temp: boolean;
    gimbalLock: boolean;
    prog: boolean;
    restart: boolean;
    tracker: boolean;
    alt: boolean;
    vel: boolean;
  };
}

export interface VerbNounCommand {
  verb: string;
  noun?: string;
  description: string;
  action: (state: DSKYState) => Partial<DSKYState> | Promise<Partial<DSKYState>>;
}
