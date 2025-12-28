
import React from 'react';
import { CUP_WIDTH, CUP_HEIGHT } from '../constants';

interface CupProps {
  isRevealing: boolean;
  hasBall: boolean;
  onClick?: () => void;
  disabled?: boolean;
  jitterX?: number;
  jitterY?: number;
}

const Cup: React.FC<CupProps> = ({ 
  isRevealing, 
  hasBall, 
  onClick, 
  disabled, 
  jitterX = 0,
  jitterY = 0
}) => {
  return (
    <div 
      className={`relative transition-transform duration-200 ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
      onClick={!disabled ? onClick : undefined}
      style={{
        transform: `translate(${jitterX}px, ${jitterY}px)`
      }}
    >
      {/* The Ball - Plain White Circle */}
      <div 
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full transition-opacity duration-300 ${hasBall && isRevealing ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* The Cup - Matches reference image style */}
      <div 
        className={`relative transition-transform duration-500 ease-in-out ${isRevealing ? '-translate-y-28' : 'translate-y-0'}`}
        style={{ width: CUP_WIDTH, height: CUP_HEIGHT }}
      >
        <svg viewBox="0 0 100 120" className="w-full h-full">
          {/* Main Body - Red Trapezoid */}
          <path 
            d="M25,10 L75,10 L92,110 L8,110 Z" 
            fill="#f44336" 
          />
          
          {/* Horizontal Ridges */}
          <g stroke="#d32f2f" strokeWidth="1.5" opacity="0.6">
            <line x1="22" y1="35" x2="78" y2="35" />
            <line x1="18" y1="60" x2="82" y2="60" />
            <line x1="14" y1="85" x2="86" y2="85" />
          </g>

          {/* Top Edge (slightly darker red for definition) */}
          <path d="M25,10 L75,10" stroke="#b71c1c" strokeWidth="2" />

          {/* Bottom White Rim */}
          <rect x="6" y="108" width="88" height="4" fill="#ffffff" />
        </svg>
      </div>
    </div>
  );
};

export default Cup;
