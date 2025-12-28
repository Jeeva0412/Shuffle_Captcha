
import { GameLevel, CaptchaPayload, Swap } from '../types';

export const generateShufflePayload = (level: GameLevel): CaptchaPayload => {
  const initialBallIndex = Math.floor(Math.random() * 3);
  let currentBallIndex = initialBallIndex;
  const swaps: Swap[] = [];

  for (let i = 0; i < level.shuffleCount; i++) {
    // Pick two distinct indices
    let a = Math.floor(Math.random() * 3);
    let b = Math.floor(Math.random() * 3);
    while (a === b) {
      b = Math.floor(Math.random() * 3);
    }

    const isTeleport = level.honeypot && Math.random() > 0.8;
    
    swaps.push({ indexA: a, indexB: b, isTeleport });

    // Track where the ball goes
    if (currentBallIndex === a) {
      currentBallIndex = b;
    } else if (currentBallIndex === b) {
      currentBallIndex = a;
    }
  }

  return {
    level: level.id,
    swaps,
    initialBallIndex,
    finalBallIndex: currentBallIndex
  };
};

export const verifyGuess = (payload: CaptchaPayload, guessIndex: number): boolean => {
  return payload.finalBallIndex === guessIndex;
};
