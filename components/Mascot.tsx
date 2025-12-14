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
}) => {
  return (
    <div className={`${className} relative flex items-center justify-center`}>
       {/* Glass Sphere Container */}
       <div className="w-full h-full rounded-full bg-gradient-to-b from-white/10 to-blue-500/20 backdrop-blur-sm border border-white/50 shadow-glass relative overflow-hidden">
          
          {/* Inner Bot Body */}
          <div className="absolute top-[15%] left-[15%] right-[15%] bottom-[15%] bg-white rounded-full shadow-inner flex flex-col items-center justify-center animate-float">
               
               {/* Screen / Face */}
               <div className="w-[70%] h-[50%] bg-black rounded-2xl relative overflow-hidden flex items-center justify-center border-2 border-gray-300">
                   {/* Reflection on screen */}
                   <div className="absolute top-0 right-0 w-[150%] h-[50%] bg-white/10 transform -rotate-12 translate-x-4"></div>
                   
                   {/* Eyes */}
                   <div className="flex gap-2">
                       {emotion === 'happy' && (
                           <>
                             <div className="w-2 h-4 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_cyan]"></div>
                             <div className="w-2 h-4 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_cyan]"></div>
                           </>
                       )}
                       {emotion === 'thinking' && (
                           <>
                             <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                             <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
                             <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                           </>
                       )}
                       {emotion === 'cool' && (
                           <div className="w-12 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]"></div>
                       )}
                       {emotion === 'surprised' && (
                           <>
                             <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                             <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                           </>
                       )}
                   </div>
               </div>

               {/* Body details */}
               <div className="w-full h-2 bg-gray-100 mt-1"></div>
          </div>

          {/* Sphere Highlights (The "Frutiger" Gloss) */}
          <div className="absolute top-1 left-4 right-4 h-1/3 bg-gradient-to-b from-white/90 to-transparent rounded-full opacity-80 pointer-events-none"></div>
          <div className="absolute bottom-2 left-4 right-4 h-1/4 bg-gradient-to-t from-blue-300/50 to-transparent rounded-full blur-md opacity-60 pointer-events-none"></div>
       </div>
    </div>
  );
};