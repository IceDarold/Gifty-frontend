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
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible filter drop-shadow-sm">
        
        {/* Doodle Body - Irregular Circle */}
        <path 
            d="M50 10 C 80 10, 95 30, 90 50 C 85 80, 70 95, 50 90 C 20 85, 5 70, 10 50 C 15 20, 30 10, 50 10 Z" 
            fill="#FFFFFF" 
            stroke="#2C2C2C" 
            strokeWidth="3"
            strokeLinecap="round"
        />
        
        {/* Antenna */}
        <path d="M50 10 Q 45 0, 50 -10" stroke="#2C2C2C" strokeWidth="3" fill="none" />
        <circle cx="50" cy="-10" r="4" fill="#FFD93D" stroke="#2C2C2C" strokeWidth="2" />

        {/* Face Screen - Scribble fill */}
        <rect x="25" y="30" width="50" height="40" rx="5" fill="#E0F2F1" stroke="#2C2C2C" strokeWidth="2" transform="rotate(-2 50 50)" />

        {/* Eyes Group */}
        <g transform="translate(0, 0) rotate(-2 50 50)">
            {/* Left Eye */}
            <circle cx="38" cy="45" r="5" fill="#2C2C2C" />
            
            {/* Right Eye */}
            <circle cx="62" cy="45" r="5" fill="#2C2C2C" />
            
            {/* Mouth */}
            {emotion === 'happy' && <path d="M42 55 Q50 60 58 55" stroke="#2C2C2C" strokeWidth="3" strokeLinecap="round" fill="none" />}
            {emotion === 'thinking' && <path d="M42 58 L58 55" stroke="#2C2C2C" strokeWidth="3" strokeLinecap="round" />}
            {emotion === 'surprised' && <ellipse cx="50" cy="58" rx="4" ry="6" stroke="#2C2C2C" strokeWidth="3" fill="none" />}
            {emotion === 'excited' && <path d="M42 55 Q50 65 58 55 Z" fill="#FF6B6B" stroke="#2C2C2C" strokeWidth="1" />}
        </g>

        {/* Blush - Scribble */}
        <path d="M25 60 l5 0 M26 62 l4 0" stroke="#FF6B6B" strokeWidth="2" opacity="0.6" />
        <path d="M70 60 l5 0 M71 62 l4 0" stroke="#FF6B6B" strokeWidth="2" opacity="0.6" />

      </svg>
    </div>
  );
};