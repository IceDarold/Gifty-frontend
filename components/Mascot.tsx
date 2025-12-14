import React from 'react';

export const Mascot: React.FC<{ className?: string, emotion?: 'happy' | 'thinking' }> = ({ className = "w-24 h-24", emotion = 'happy' }) => {
  return (
    <div className={`${className} animate-float drop-shadow-xl relative`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ears */}
        <path d="M20 30L10 50C10 50 5 45 15 25Z" fill="#D97706" />
        <path d="M80 30L90 50C90 50 95 45 85 25Z" fill="#D97706" />
        
        {/* Head */}
        <circle cx="50" cy="50" r="35" fill="#FCD34D" />
        <ellipse cx="50" cy="65" rx="15" ry="12" fill="#FEF3C7" />
        
        {/* Eyes */}
        <circle cx="38" cy="45" r="4" fill="#1F2937" />
        <circle cx="62" cy="45" r="4" fill="#1F2937" />
        {/* Shine in eyes */}
        <circle cx="39" cy="43" r="1.5" fill="white" />
        <circle cx="63" cy="43" r="1.5" fill="white" />

        {/* Nose */}
        <path d="M46 58H54L50 63L46 58Z" fill="#4B5563" />

        {/* Mouth */}
        {emotion === 'happy' && (
           <path d="M45 65Q50 72 55 65" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
        )}
        {emotion === 'thinking' && (
           <circle cx="58" cy="65" r="2" fill="#4B5563" />
        )}

        {/* Cheeks */}
        <circle cx="30" cy="55" r="3" fill="#FCA5A5" opacity="0.6" />
        <circle cx="70" cy="55" r="3" fill="#FCA5A5" opacity="0.6" />
      </svg>
    </div>
  );
};