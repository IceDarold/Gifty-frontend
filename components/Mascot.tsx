import React from 'react';

interface MascotProps {
  className?: string;
  emotion?: 'happy' | 'thinking' | 'surprised' | 'excited' | 'cool';
  eyesX?: number;
  eyesY?: number;
}

export const Mascot: React.FC<MascotProps> = ({ 
  className = "w-24 h-24", 
  emotion = 'happy',
  eyesX = 0,
  eyesY = 0,
}) => {
  // Eye tracking movement limited range
  const pupilX = Math.max(-2, Math.min(2, eyesX)) * 2;
  const pupilY = Math.max(-2, Math.min(2, eyesY)) * 2;

  return (
    <div className={`${className} relative`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
        
        {/* Drop Shadow */}
        <path d="M15 20 H85 V85 H15 Z" fill="#121212" transform="translate(4, 4) rotate(-3 50 50)" className="opacity-100" />

        {/* Main Body - Square shape with rounded corners (Sticker style) */}
        <rect x="10" y="10" width="80" height="80" rx="15" fill="#FFFFFF" stroke="#121212" strokeWidth="3" transform="rotate(-3 50 50)" />
        
        {/* Screen/Face */}
        <rect x="20" y="25" width="60" height="45" rx="8" fill="#5CE1E6" stroke="#121212" strokeWidth="2.5" transform="rotate(-3 50 50)" />

        {/* Eyes Group */}
        <g transform="translate(0, 0) rotate(-3 50 50)">
            {/* Left Eye */}
            <circle cx="35" cy="45" r="8" fill="white" stroke="#121212" strokeWidth="2" />
            <circle cx={35 + pupilX} cy={45 + pupilY} r="3" fill="#121212" />

            {/* Right Eye */}
            <circle cx="65" cy="45" r="8" fill="white" stroke="#121212" strokeWidth="2" />
            <circle cx={65 + pupilX} cy={45 + pupilY} r="3" fill="#121212" />
            
            {/* Blush */}
            <ellipse cx="30" cy="55" rx="3" ry="2" fill="#FF66C4" opacity="0.6" />
            <ellipse cx="70" cy="55" rx="3" ry="2" fill="#FF66C4" opacity="0.6" />
            
            {/* Mouth */}
            {emotion === 'happy' && <path d="M42 55 Q50 62 58 55" stroke="#121212" strokeWidth="2.5" strokeLinecap="round" />}
            {emotion === 'thinking' && <line x1="42" y1="58" x2="58" y2="58" stroke="#121212" strokeWidth="2.5" strokeLinecap="round" />}
            {emotion === 'surprised' && <circle cx="50" cy="58" r="4" stroke="#121212" strokeWidth="2.5" />}
        </g>

        {/* Antenna */}
        <line x1="50" y1="10" x2="50" y2="0" stroke="#121212" strokeWidth="3" transform="rotate(-3 50 50)" />
        <circle cx="50" cy="-3" r="4" fill="#FFDE59" stroke="#121212" strokeWidth="2.5" transform="rotate(-3 50 50)" />

      </svg>
    </div>
  );
};