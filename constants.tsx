
import { GameLevel } from './types';

export const LEVELS: GameLevel[] = [
  {
    id: 1,
    name: "Level 1: The Baseline",
    description: "Slow shuffling to confirm basic motor skills.",
    shuffleCount: 6,
    speed: 750,
    jitter: false,
    honeypot: false
  },
  {
    id: 2,
    name: "Level 2: The Hustle",
    description: "Medium speed with overlapping paths and jitter.",
    shuffleCount: 12,
    speed: 500,
    jitter: true,
    honeypot: false
  },
  {
    id: 3,
    name: "Level 3: The Speedrun",
    description: "High speed, randomized vectors, and visual teleports.",
    shuffleCount: 18,
    speed: 300,
    jitter: true,
    honeypot: true
  }
];

export const CUP_WIDTH = 130;
export const CUP_HEIGHT = 150;
export const CONTAINER_WIDTH = 600;
