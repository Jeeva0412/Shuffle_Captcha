
import React, { useState, useEffect } from 'react';
import { GameLevel, GameState, CaptchaPayload } from '../types';
import { generateShufflePayload, verifyGuess } from '../services/captchaService';
import { CONTAINER_WIDTH, CUP_WIDTH, LEVELS } from '../constants';
import Cup from './Cup';

interface ShellGameProps {
  level: GameLevel;
  onSuccess: () => void;
  onFailure: () => void;
}

const ShellGame: React.FC<ShellGameProps> = ({ level, onSuccess, onFailure }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.INITIAL);
  const [payload, setPayload] = useState<CaptchaPayload | null>(null);
  const [positions, setPositions] = useState<number[]>([0, 1, 2]); 
  const [revealing, setRevealing] = useState(false);
  const [jitter, setJitter] = useState({ x: 0, y: 0 });
  const [flicker, setFlicker] = useState(false);

  // Reset state when level changes to allow progression
  useEffect(() => {
    setGameState(GameState.INITIAL);
    setRevealing(false);
    setPayload(null);
    setPositions([0, 1, 2]);
    setJitter({ x: 0, y: 0 });
    setFlicker(false);
  }, [level.id]);

  const startLevel = () => {
    const newPayload = generateShufflePayload(level);
    setPayload(newPayload);
    setGameState(GameState.SHOWING_BALL);
    setRevealing(true);
    
    setTimeout(() => {
      setRevealing(false);
      setGameState(GameState.HIDING_BALL);
      setTimeout(() => performShuffle(newPayload), 800);
    }, 1200);
  };

  const performShuffle = async (currentPayload: CaptchaPayload) => {
    setGameState(GameState.SHUFFLING);

    for (let i = 0; i < currentPayload.swaps.length; i++) {
      const swap = currentPayload.swaps[i];

      // Honeypot/Teleport Logic (Level 3 specific security feature)
      if (swap.isTeleport) {
        setFlicker(true);
        await new Promise(r => setTimeout(r, 60)); 
        setFlicker(false);
      }
      
      // Update cup identities in their respective slots (indices)
      setPositions(prev => {
        const next = [...prev];
        const temp = next[swap.indexA];
        next[swap.indexA] = next[swap.indexB];
        next[swap.indexB] = temp;
        return next;
      });

      // Trajectory Jitter (Level 2 & 3 security feature)
      if (level.jitter) {
        const jitterInterval = setInterval(() => {
          setJitter({
            x: (Math.random() - 0.5) * (level.id * 5),
            y: (Math.random() - 0.5) * (level.id * 2)
          });
        }, 50);
        setTimeout(() => {
          clearInterval(jitterInterval);
          setJitter({ x: 0, y: 0 });
        }, level.speed);
      }

      await new Promise(resolve => setTimeout(resolve, level.speed));
    }

    setGameState(GameState.GUESSING);
  };

  const handleCupClick = (cupId: number) => {
    if (gameState !== GameState.GUESSING || !payload) return;

    setRevealing(true);
    // Find which slot the user clicked based on the cup identity
    const clickedSlot = positions.indexOf(cupId);
    const isCorrect = verifyGuess(payload, clickedSlot);

    if (isCorrect) {
      setGameState(GameState.SUCCESS);
      setTimeout(onSuccess, 1200);
    } else {
      setGameState(GameState.FAILED);
      setTimeout(() => {
        onFailure();
        setGameState(GameState.INITIAL);
        setRevealing(false);
        setPayload(null);
        setPositions([0, 1, 2]);
      }, 1500);
    }
  };

  const getLeftOffsetForCupId = (cupId: number) => {
    const slotIndex = positions.indexOf(cupId);
    const spacing = (CONTAINER_WIDTH - (3 * CUP_WIDTH)) / 4;
    return spacing + slotIndex * (CUP_WIDTH + spacing);
  };

  const shouldCupShowBall = (cupId: number) => {
    if (!payload) return false;
    const currentSlot = positions.indexOf(cupId);
    
    if (gameState === GameState.SHOWING_BALL) {
      return currentSlot === payload.initialBallIndex;
    }
    if (gameState === GameState.GUESSING || gameState === GameState.SUCCESS || gameState === GameState.FAILED) {
      return currentSlot === payload.finalBallIndex;
    }
    return false;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto py-12 select-none">
      
      {/* Level Progress Indicator */}
      <div className="flex gap-4 mb-8">
        {LEVELS.map((lvl) => (
          <div 
            key={lvl.id}
            className={`h-2.5 w-12 rounded-full transition-all duration-500 ${
              level.id > lvl.id ? 'bg-green-500' : 
              level.id === lvl.id ? 'bg-[#6c879d] scale-110 shadow-lg' : 'bg-[#6c879d]/20'
            }`}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="text-center mb-6 px-4 min-h-[5rem]">
        <p className="text-[#546e7a] text-xl font-medium leading-relaxed">
          {gameState === GameState.SHUFFLING ? (
            <span className="italic opacity-70">Focus on the ball...</span>
          ) : (
            <>
              The cups will switch around when you hit 'Start'.<br />
              Select the cup that has the ball in it.
            </>
          )}
        </p>
      </div>

      {/* Start Button */}
      <div className="h-20 mb-12 flex items-center">
        {gameState === GameState.INITIAL && (
          <button
            onClick={startLevel}
            className="px-14 py-3 bg-[#f0f4f8]/50 hover:bg-white text-[#6c879d] font-bold text-lg rounded-full border-2 border-[#6c879d] transition-all shadow-sm active:scale-95 tracking-widest uppercase"
          >
            START
          </button>
        )}
      </div>

      {/* Game Area */}
      <div 
        className={`relative h-64 w-full flex items-end pb-8 transition-opacity duration-150 ${flicker ? 'opacity-40 brightness-110' : 'opacity-100'}`}
        style={{ width: CONTAINER_WIDTH }}
      >
        {[0, 1, 2].map((cupId) => {
          return (
            <div
              key={cupId}
              className="absolute transition-all ease-in-out"
              style={{
                left: getLeftOffsetForCupId(cupId),
                transitionDuration: `${level.speed}ms`,
                transform: `translate(${jitter.x}px, ${jitter.y}px)`,
                zIndex: 10
              }}
            >
              <Cup
                isRevealing={revealing}
                hasBall={shouldCupShowBall(cupId)}
                onClick={() => handleCupClick(cupId)}
                disabled={gameState !== GameState.GUESSING}
              />
            </div>
          );
        })}
      </div>

      {/* Status Messages */}
      <div className="mt-12 text-center h-24">
        {gameState === GameState.SUCCESS && (
          <p className="text-2xl font-bold text-[#546e7a] animate-in fade-in">Verification point reached.</p>
        )}
        {gameState === GameState.FAILED && (
          <div className="animate-in shake">
            <p className="text-2xl font-bold text-red-500">Focus lost!</p>
            <p className="text-sm text-[#546e7a]">Restarting security protocol...</p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-12">
        <p className="text-[#546e7a] font-medium italic opacity-60">Now You See It, Now You Don't</p>
      </div>
    </div>
  );
};

export default ShellGame;
