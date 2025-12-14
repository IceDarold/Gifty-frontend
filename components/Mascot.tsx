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
  return (
    <div className={`${className} relative`}>
      {/* "Napkin" Background for drawing */}
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible filter drop-shadow-md">
        
        {/* Paper Texture */}
        <path 
            d="M10 15 L90 10 L95 90 L5 85 Z" 
            fill="#FFFFFF" 
            stroke="none"
        />
        
        {/* Marker Drawing */}
        <path 
            d="M20 20 C 20 10, 80 10, 80 20 C 85 50, 85 70, 80 80 C 70 90, 30 90, 20 80 C 15 70, 15 50, 20 20 Z" 
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-scribble"
        />
        
        {/* Antenna */}
        <path d="M50 15 L50 0" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="0" r="4" fill="#1a1a1a" />

        {/* Face */}
        <g transform="translate(0, 5)">
            {/* Eyes */}
            <circle cx="35" cy="40" r="2" fill="#1a1a1a" />
            <circle cx="65" cy="40" r="2" fill="#1a1a1a" />
            
            {/* Mouth */}
            {emotion === 'happy' && <path d="M35 60 Q50 70 65 60" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" />}
            {emotion === 'thinking' && <path d="M35 65 L65 60" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />}
            {emotion === 'surprised' && <circle cx="50" cy="65" r="5" stroke="#1a1a1a" strokeWidth="3" fill="none" />}
            {emotion === 'excited' && <path d="M35 60 Q50 80 65 60 Z" fill="#1a1a1a" />}
        </g>

        {/* Red Marker Blush */}
        <path d="M25 55 L30 50 M28 58 L33 53" stroke="#d93025" strokeWidth="2" opacity="0.7" />
        <path d="M70 50 L75 55 M73 48 L78 53" stroke="#d93025" strokeWidth="2" opacity="0.7" />

      </svg>
    </div>
  );
};