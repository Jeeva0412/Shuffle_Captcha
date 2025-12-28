
export enum GameState {
  INITIAL = 'INITIAL',
  PREPARING = 'PREPARING',
  SHOWING_BALL = 'SHOWING_BALL',
  HIDING_BALL = 'HIDING_BALL',
  SHUFFLING = 'SHUFFLING',
  GUESSING = 'GUESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export interface GameLevel {
  id: number;
  name: string;
  description: string;
  shuffleCount: number;
  speed: number;
  jitter: boolean;
  honeypot: boolean;
}

export interface Swap {
  indexA: number;
  indexB: number;
  isTeleport?: boolean;
}

export interface CaptchaPayload {
  level: number;
  swaps: Swap[];
  initialBallIndex: number;
  finalBallIndex: number;
}
