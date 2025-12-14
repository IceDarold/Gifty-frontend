import React from 'react';

interface MascotProps {
  className?: string;
  emotion?: 'happy' | 'thinking' | 'surprised' | 'excited' | 'cool';
  eyesX?: number; // -1 to 1 (left to right)
  eyesY?: number; // -1 to 1 (up to down)
  accessory?: 'none' | 'glasses' | 'scarf';
}

export const Mascot: React.FC<MascotProps> = ({ 
  className = "w-24 h-24", 
  emotion = 'happy',
  eyesX = 0,
  eyesY = 0,
  accessory = 'none'
}) => {
  // Clamp values to stay within eye boundaries
  const pupilX = Math.max(-1, Math.min(1, eyesX)) * 2.5;
  const pupilY = Math.max(-1, Math.min(1, eyesY)) * 2.5;

  return (
    <div className={`${className} relative`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
        {/* Ears */}
        <g className="origin-bottom animate-[pulse_3s_ease-in-out_infinite]">
            <path d="M20 30L10 50C10 50 5 45 15 25Z" fill="#D97706" />
            <path d="M80 30L90 50C90 50 95 45 85 25Z" fill="#D97706" />
        </g>
        
        {/* Head */}
        <circle cx="50" cy="50" r="35" fill="#FCD34D" />
        <ellipse cx="50" cy="65" rx="15" ry="12" fill="#FEF3C7" />
        
        {/* Scarf Accessory (Behind Face) */}
        {accessory === 'scarf' && (
           <g>
             <path d="M25 75 Q 50 90 75 75" stroke="#EC4899" strokeWidth="8" strokeLinecap="round" fill="none" />
             <path d="M25 75 L 15 90" stroke="#EC4899" strokeWidth="6" strokeLinecap="round" />
           </g>
        )}

        {/* Eyes Container */}
        <g>
            {/* Left Eye Background */}
            <circle cx="38" cy="45" r="5" fill="white" opacity="0.4" />
            {/* Right Eye Background */}
            <circle cx="62" cy="45" r="5" fill="white" opacity="0.4" />

            {/* Left Pupil (Tracking) */}
            <circle 
                cx={38 + pupilX} 
                cy={45 + pupilY} 
                r="4" 
                fill="#1F2937" 
                className="transition-all duration-100 ease-out"
            />
            {/* Right Pupil (Tracking) */}
            <circle 
                cx={62 + pupilX} 
                cy={45 + pupilY} 
                r="4" 
                fill="#1F2937" 
                className="transition-all duration-100 ease-out"
            />
            
            {/* Shine in eyes */}
            <circle cx={39} cy={43} r="1.5" fill="white" />
            <circle cx={63} cy={43} r="1.5" fill="white" />
        </g>
        
        {/* Glasses Accessory */}
        {accessory === 'glasses' && (
           <g>
              <circle cx="38" cy="45" r="10" stroke="#1F2937" strokeWidth="2" fill="black" fillOpacity="0.2" />
              <circle cx="62" cy="45" r="10" stroke="#1F2937" strokeWidth="2" fill="black" fillOpacity="0.2" />
              <line x1="48" y1="45" x2="52" y2="45" stroke="#1F2937" strokeWidth="2" />
              <line x1="28" y1="45" x2="15" y2="40" stroke="#1F2937" strokeWidth="2" />
              <line x1="72" y1="45" x2="85" y2="40" stroke="#1F2937" strokeWidth="2" />
              {/* Reflection on glasses */}
              <line x1="34" y1="40" x2="40" y2="48" stroke="white" strokeWidth="1" opacity="0.5" />
           </g>
        )}

        {/* Nose */}
        <path d="M46 58H54L50 63L46 58Z" fill="#4B5563" />

        {/* Mouth Expressions */}
        {emotion === 'happy' && (
           <path d="M45 65Q50 72 55 65" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
        )}
        {emotion === 'cool' && (
           <path d="M48 68Q50 70 52 68" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
        )}
        {emotion === 'thinking' && (
           <circle cx="58" cy="65" r="2" fill="#4B5563" />
        )}
        {emotion === 'surprised' && (
           <circle cx="50" cy="66" r="3" stroke="#4B5563" strokeWidth="2" fill="none" />
        )}
        {emotion === 'excited' && (
            <path d="M45 65Q50 75 55 65Z" fill="#4B5563" />
        )}

        {/* Cheeks */}
        <circle cx="30" cy="55" r="3" fill="#FCA5A5" opacity="0.6" />
        <circle cx="70" cy="55" r="3" fill="#FCA5A5" opacity="0.6" />
      </svg>
    </div>
  );
};