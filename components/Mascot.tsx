import React from 'react';

interface MascotProps {
  className?: string;
  emotion?: 'happy' | 'thinking' | 'surprised' | 'excited' | 'cool';
  eyesX?: number;
  eyesY?: number;
  accessory?: 'none' | 'glasses' | 'scarf';
}

export const Mascot: React.FC<MascotProps> = ({ 
  className = "w-24 h-24", 
  emotion = 'happy',
  eyesX = 0,
  eyesY = 0,
}) => {
  const pupilX = Math.max(-1, Math.min(1, eyesX)) * 3;
  const pupilY = Math.max(-1, Math.min(1, eyesY)) * 3;

  return (
    <div className={`${className} relative`}>
      {/* Glow Filter */}
      <svg width="0" height="0">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
           <linearGradient id="earGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#e879f9" />
          </linearGradient>
        </defs>
      </svg>

      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible" filter="url(#glow)">
        
        {/* Ears (Floating) */}
        <g className="animate-[float_4s_ease-in-out_infinite]">
            <path d="M22 28 C 5 20, -2 48, 18 55 C 18 55, 14 40, 22 28" fill="url(#earGrad)" opacity="0.9" />
            <path d="M78 28 C 95 20, 102 48, 82 55 C 82 55, 86 40, 78 28" fill="url(#earGrad)" opacity="0.9" />
        </g>
        
        {/* Head */}
        <circle cx="50" cy="55" r="38" fill="url(#bodyGrad)" />
        
        {/* Highlight on head */}
        <ellipse cx="35" cy="40" rx="10" ry="6" fill="white" opacity="0.2" transform="rotate(-45 35 40)" />

        {/* Snout Patch */}
        <ellipse cx="50" cy="72" rx="22" ry="16" fill="white" opacity="0.15" />

        {/* Eyes Container */}
        <g>
            <ellipse cx="32" cy="52" rx="10" ry="12" fill="#0f172a" />
            <ellipse cx="68" cy="52" rx="10" ry="12" fill="#0f172a" />

            {/* Glowing Pupils */}
            <circle cx={32 + pupilX} cy={52 + pupilY} r="4" fill="#38bdf8" />
            <circle cx={68 + pupilX} cy={52 + pupilY} r="4" fill="#38bdf8" />
            
            <circle cx={34 + pupilX} cy={50 + pupilY} r="1.5" fill="white" />
            <circle cx={70 + pupilX} cy={50 + pupilY} r="1.5" fill="white" />
        </g>
        
        {/* Nose */}
        <path d="M46 68 Q 50 65 54 68 Q 50 74 46 68 Z" fill="#1e293b" />

        {/* Mouth */}
        {emotion === 'happy' && (
             <path d="M45 76 Q 50 80 55 76" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
        )}
        {emotion === 'cool' && (
           <path d="M46 78 Q 50 79 54 78" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
        )}
        {emotion === 'thinking' && (
           <circle cx="58" cy="78" r="2" fill="#1e293b" opacity="0.6"/>
        )}
        {emotion === 'surprised' && (
           <ellipse cx="50" cy="80" rx="3" ry="5" stroke="#1e293b" strokeWidth="2" fill="#1e293b" opacity="0.6"/>
        )}
        
        {/* Cheeks Glow */}
        <circle cx="24" cy="62" r="6" fill="#f472b6" opacity="0.4" filter="blur(2px)" />
        <circle cx="76" cy="62" r="6" fill="#f472b6" opacity="0.4" filter="blur(2px)" />
      </svg>
    </div>
  );
};