import React from 'react';

interface MascotProps {
  className?: string;
  emotion?: 'happy' | 'thinking' | 'surprised' | 'excited' | 'cool';
}

export const Mascot: React.FC<MascotProps> = ({ 
  className = "w-32 h-32", 
  emotion = 'happy',
}) => {
  return (
    <div className={`${className} relative flex items-center justify-center`}>
       {/* 3D Body (Sphere) */}
       <div className="w-full h-full rounded-full bg-[#a29bfe] relative animate-float shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.1),inset_10px_10px_20px_rgba(255,255,255,0.5),10px_20px_30px_rgba(108,92,231,0.3)]">
          
          {/* Face Area */}
          <div className="absolute top-[25%] left-[15%] right-[15%] h-[50%] flex flex-col items-center justify-center">
             
             {/* Eyes Container */}
             <div className="flex gap-4 mb-2">
                 {/* Left Eye */}
                 <div className="w-5 h-7 bg-[#2d3436] rounded-full relative overflow-hidden">
                     <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                 </div>
                 {/* Right Eye */}
                 <div className="w-5 h-7 bg-[#2d3436] rounded-full relative overflow-hidden">
                     <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                 </div>
             </div>

             {/* Mouth */}
             {emotion === 'happy' && (
                 <div className="w-6 h-3 border-b-4 border-[#2d3436] rounded-full"></div>
             )}
             {emotion === 'thinking' && (
                 <div className="w-4 h-4 rounded-full border-4 border-[#2d3436]"></div>
             )}
             {emotion === 'cool' && (
                 <div className="absolute top-[28%] w-20 h-8 bg-black rounded-lg border-2 border-white/50 shadow-sm"></div>
             )}

             {/* Cheeks */}
             <div className="absolute top-[55%] left-0 w-4 h-2 bg-[#fd79a8] rounded-full opacity-60 blur-[2px]"></div>
             <div className="absolute top-[55%] right-0 w-4 h-2 bg-[#fd79a8] rounded-full opacity-60 blur-[2px]"></div>

          </div>

          {/* Highlight (Gloss) */}
          <div className="absolute top-[15%] left-[20%] w-[30%] h-[15%] bg-white rounded-full opacity-40 blur-[1px]"></div>
       </div>
    </div>
  );
};