import React from 'react';

interface MascotProps {
  className?: string;
  emotion?: 'happy' | 'thinking' | 'surprised' | 'excited' | 'cool';
}

export const Mascot: React.FC<MascotProps> = ({ 
  className = "", 
  emotion = 'happy',
}) => {
  
  const faces = {
    happy: "( ◡‿◡ )",
    thinking: "( ._. )?",
    surprised: "( O_O )",
    excited: "★_★",
    cool: "( -_-)b"
  };

  return (
    <div className={`
        bg-yellow-200 w-24 h-24 shadow-md flex items-center justify-center rotate-3 
        font-handwritten text-xl font-bold text-ink border-b-4 border-yellow-300/50
        ${className}
    `}>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-tape/40 rotate-[-2deg]"></div>
        {faces[emotion]}
    </div>
  );
};