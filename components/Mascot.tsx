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
  accessory = 'none'
}) => {
  const pupilX = Math.max(-1, Math.min(1, eyesX)) * 4;
  const pupilY = Math.max(-1, Math.min(1, eyesY)) * 4;

  // Common stroke style for the "Sticker" look
  const strokeStyle = { stroke: "black", strokeWidth: "3", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  return (
    <div className={`${className} relative drop-shadow-md`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
        
        {/* Ears (Behind Head) */}
        <g className="origin-center animate-[pulse_5s_ease-in-out_infinite]">
            <path d="M22 28 C 5 20, -2 48, 18 55 C 18 55, 14 40, 22 28" fill="#A388EE" {...strokeStyle} />
            <path d="M78 28 C 95 20, 102 48, 82 55 C 82 55, 86 40, 78 28" fill="#A388EE" {...strokeStyle} />
        </g>
        
        {/* Head */}
        <circle cx="50" cy="55" r="38" fill="#3B82F6" {...strokeStyle} />
        
        {/* Snout Patch */}
        <ellipse cx="50" cy="72" rx="22" ry="16" fill="#93C5FD" {...strokeStyle} />
        
        {/* Scarf Accessory */}
        {accessory === 'scarf' && (
           <g>
             <path d="M25 88 Q 50 100 75 88" stroke="#FF90E8" strokeWidth="10" strokeLinecap="round" />
             <path d="M25 88 Q 50 100 75 88" fill="none" stroke="black" strokeWidth="3" /> {/* Border for scarf */}
             <path d="M30 88 L 20 105" stroke="#FF90E8" strokeWidth="8" strokeLinecap="round" />
             <path d="M30 88 L 20 105" fill="none" stroke="black" strokeWidth="3" />
           </g>
        )}

        {/* Eyes Container */}
        <g>
            <ellipse cx="32" cy="52" rx="11" ry="13" fill="white" {...strokeStyle} />
            <ellipse cx="68" cy="52" rx="11" ry="13" fill="white" {...strokeStyle} />

            <circle cx={32 + pupilX} cy={52 + pupilY} r="5.5" fill="black" />
            <circle cx={68 + pupilX} cy={52 + pupilY} r="5.5" fill="black" />
            
            <circle cx={35} cy={48} r="2.5" fill="white" />
            <circle cx={71} cy={48} r="2.5" fill="white" />
        </g>
        
        {/* Glasses */}
        {accessory === 'glasses' && (
           <g transform="translate(0, 5)">
              <circle cx="32" cy="52" r="14" stroke="black" strokeWidth="4" fill="black" fillOpacity="0.2" />
              <circle cx="68" cy="52" r="14" stroke="black" strokeWidth="4" fill="black" fillOpacity="0.2" />
              <line x1="46" y1="52" x2="54" y2="52" stroke="black" strokeWidth="4" />
           </g>
        )}

        {/* Nose */}
        <path d="M44 68 Q 50 63 56 68 Q 50 78 44 68 Z" fill="black" />
        <ellipse cx="50" cy="66" rx="3" ry="1.5" fill="white" opacity="0.3" />

        {/* Mouth */}
        {emotion === 'happy' && (
           <>
             <path d="M45 76 Q 50 82 55 76" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none" />
             <path d="M48 78 Q 50 82 52 78" fill="#FF90E8" stroke="black" strokeWidth="2" />
           </>
        )}
        {emotion === 'cool' && (
           <path d="M46 78 Q 50 80 54 78" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none" />
        )}
        {emotion === 'thinking' && (
           <circle cx="58" cy="78" r="3" fill="black" />
        )}
        {emotion === 'surprised' && (
           <ellipse cx="50" cy="80" rx="4" ry="6" stroke="black" strokeWidth="3" fill="black" />
        )}
        {emotion === 'excited' && (
            <path d="M42 76 Q 50 88 58 76Z" fill="black" />
        )}

        {/* Cheeks */}
        <circle cx="24" cy="62" r="4" fill="#FF90E8" opacity="0.6" />
        <circle cx="76" cy="62" r="4" fill="#FF90E8" opacity="0.6" />
        
        {/* Eyebrows */}
        {emotion === 'thinking' && (
           <path d="M25 38 Q 32 35 39 38" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none"/>
        )}
        {emotion === 'surprised' && (
           <>
            <path d="M25 35 Q 32 30 39 35" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M61 35 Q 68 30 75 35" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none"/>
           </>
        )}
      </svg>
    </div>
  );
};