import React from 'react';

interface MascotProps {
  className?: string;
  emotion?: 'happy' | 'thinking' | 'surprised' | 'excited' | 'cool';
}

export const Mascot: React.FC<MascotProps> = ({ 
  className = "w-24 h-24", 
  emotion = 'happy',
}) => {
  // Simple CSS Grid Pixel Art Representation of a robot face
  const pixelColor = 'bg-retro-white';
  const eyesColor = emotion === 'happy' ? 'bg-retro-accent' : 'bg-retro-primary';
  
  return (
    <div className={`${className} animate-float-pixel relative`}>
        {/* Shadow */}
        <div className="absolute -bottom-4 left-2 right-2 h-2 bg-black opacity-30 blur-none"></div>
        
        {/* Head Shape: 8x8 Grid Concept scaled up */}
        <div className="w-full h-full bg-retro-black border-4 border-white p-2 relative shadow-pixel-sm">
            {/* Antenna */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-2 h-4 bg-black border-l-2 border-r-2 border-white"></div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 border-2 border-white animate-blink"></div>

            {/* Face Screen */}
            <div className="w-full h-full bg-green-900 border-2 border-green-700 relative overflow-hidden flex flex-col items-center justify-center gap-2">
                {/* CRT Scanline inside face */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.2)_50%,transparent_50%)] bg-[size:100%_4px] pointer-events-none"></div>
                
                {/* Eyes */}
                <div className="flex gap-4 z-10">
                    {emotion === 'thinking' ? (
                         <>
                            <div className="w-4 h-2 bg-green-400"></div>
                            <div className="w-4 h-4 bg-green-400 animate-bounce"></div>
                         </>
                    ) : (
                        <>
                            <div className={`w-4 h-4 ${eyesColor} shadow-[0_0_5px_currentColor]`}></div>
                            <div className={`w-4 h-4 ${eyesColor} shadow-[0_0_5px_currentColor]`}></div>
                        </>
                    )}
                </div>

                {/* Mouth */}
                <div className="w-12 h-2 bg-green-400 z-10 mt-1"></div>
            </div>
        </div>
    </div>
  );
};