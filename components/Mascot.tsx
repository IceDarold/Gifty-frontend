import React from 'react';

interface MascotProps {
  className?: string;
  emotion?: 'happy' | 'thinking' | 'surprised' | 'excited' | 'cool';
}

export const Mascot: React.FC<MascotProps> = ({ 
  className = "", 
  emotion = 'happy',
}) => {
  
  // Anti-Design faces
  const faces = {
    happy: "ʕ •`ᴥ•´ʔ",
    thinking: "Loading...",
    surprised: "!!!_ERROR_!!!",
    excited: "↖(^ω^)↗",
    cool: "[ SYSTEM_OK ]"
  };

  const captions = {
    happy: "I am legally required to smile.",
    thinking: "Pretending to think.",
    surprised: "That was unexpected.",
    excited: "Dopamine levels rising.",
    cool: "I feel nothing."
  };

  return (
    <div className={`font-mono border border-dashed border-black p-4 inline-block bg-white relative ${className}`}>
        {/* Tape effect */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-yellow-200/50 rotate-2"></div>
        
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="text-xl font-bold whitespace-nowrap">
                {faces[emotion]}
            </div>
            <div className="text-[10px] bg-black text-white px-1 uppercase max-w-[150px] text-center leading-tight">
                {captions[emotion]}
            </div>
        </div>
    </div>
  );
};