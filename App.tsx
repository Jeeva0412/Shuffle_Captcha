
import React, { useState } from 'react';
import ShellGame from './components/ShellGame';
import { LEVELS } from './constants';

const App: React.FC = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSuccess = () => {
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleFailure = () => {
    setCurrentLevelIndex(0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {isCompleted ? (
        <div className="text-center animate-in fade-in duration-700">
          <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">VERIFIED</h2>
          <p className="text-slate-500 mb-10">Human tracking confirmed.</p>
          <button 
            onClick={() => {
              setIsCompleted(false);
              setCurrentLevelIndex(0);
            }}
            className="px-10 py-3 bg-slate-800 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md"
          >
            Restart
          </button>
        </div>
      ) : (
        <ShellGame 
          level={LEVELS[currentLevelIndex]}
          onSuccess={handleSuccess}
          onFailure={handleFailure}
        />
      )}
    </div>
  );
};

export default App;
