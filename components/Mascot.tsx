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
  const pupilX = Math.max(-1, Math.min(1, eyesX)) * 5;
  const pupilY = Math.max(-1, Math.min(1, eyesY)) * 5;

  return (
    <div className={`${className} relative group`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible drop-shadow-[0_0_10px_rgba(0,255,65,0.3)]">
        
        <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#00ff41" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
        </defs>

        {/* Wireframe Head */}
        <circle cx="50" cy="50" r="40" stroke="#00ff41" strokeWidth="1" fill="url(#grid)" className="animate-[pulse_4s_ease-in-out_infinite]" />
        
        {/* Orbital Ring */}
        <ellipse cx="50" cy="50" rx="50" ry="10" stroke="#008F11" strokeWidth="1" fill="none" className="animate-[spin_10s_linear_infinite] origin-center opacity-50" />
        <ellipse cx="50" cy="50" rx="50" ry="10" stroke="#008F11" strokeWidth="1" fill="none" className="animate-[spin_8s_linear_infinite_reverse] origin-center opacity-30" transform="rotate(45 50 50)" />

        {/* Digital Eyes */}
        <rect x="25" y="40" width="15" height="12" stroke="#00ff41" fill="#002200" />
        <rect x="60" y="40" width="15" height="12" stroke="#00ff41" fill="#002200" />
        
        {/* Pupils (Square pixels) */}
        <rect x={30 + pupilX} y={44 + pupilY} width="5" height="4" fill="#00ff41" />
        <rect x={65 + pupilX} y={44 + pupilY} width="5" height="4" fill="#00ff41" />

        {/* Mouth (LED Display) */}
        <path d="M35 70 L40 75 L60 75 L65 70" stroke="#00ff41" strokeWidth="2" fill="none" />

        {/* Glitch Overlay Elements */}
        <rect x="0" y="20" width="100" height="2" fill="#00ff41" className="animate-scan opacity-20" />
      </svg>
    </div>
  );
};