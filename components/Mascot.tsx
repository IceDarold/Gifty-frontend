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
    <div className={`${className} relative flex items-center justify-center animate-float-slow`}>
       {/* 3D Body (Sphere) - Added "wet" highlights */}
       <div className="w-full h-full rounded-full bg-[#a29bfe] relative shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),inset_10px_10px_20px_rgba(255,255,255,0.6),15px_25px_40px_rgba(108,92,231,0.4)]">
          
          {/* Main Specular Highlight (The "Wet" Look) */}
          <div className="absolute top-[12%] left-[18%] w-[25%] h-[12%] bg-white rounded-full opacity-60 blur-[1px] -rotate-12"></div>
          <div className="absolute top-[20%] left-[15%] w-[8%] h-[5%] bg-white rounded-full opacity-50 blur-[1px]"></div>

          {/* Face Area */}
          <div className="absolute top-[30%] left-[15%] right-[15%] h-[50%] flex flex-col items-center justify-center">
             
             {/* Eyes Container - Added Blinking Animation */}
             <div className="flex gap-6 mb-3">
                 {/* Left Eye */}
                 <div className="w-6 h-8 bg-[#2d3436] rounded-full relative overflow-hidden animate-blink origin-center">
                     <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-white rounded-full"></div>
                 </div>
                 {/* Right Eye */}
                 <div className="w-6 h-8 bg-[#2d3436] rounded-full relative overflow-hidden animate-blink origin-center" style={{ animationDelay: '100ms' }}>
                     <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-white rounded-full"></div>
                 </div>
             </div>

             {/* Mouth */}
             {emotion === 'happy' && (
                 <div className="w-8 h-4 border-b-[5px] border-[#2d3436] rounded-full opacity-80"></div>
             )}
             {emotion === 'excited' && (
                 <div className="w-8 h-6 bg-[#2d3436] rounded-b-full border-t-2 border-[#2d3436] relative overflow-hidden">
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-3 bg-red-400 rounded-t-lg"></div>
                 </div>
             )}
             {emotion === 'thinking' && (
                 <div className="w-3 h-3 rounded-full bg-[#2d3436] animate-ping"></div>
             )}
             {emotion === 'cool' && (
                 <div className="absolute top-[28%] w-24 h-10 bg-black rounded-xl border-[3px] border-white/30 shadow-lg flex items-center justify-center">
                     <div className="w-full h-[1px] bg-white/20"></div>
                 </div>
             )}

             {/* Cheeks */}
             <div className="absolute top-[60%] left-[-5%] w-6 h-3 bg-[#fd79a8] rounded-full opacity-50 blur-[3px]"></div>
             <div className="absolute top-[60%] right-[-5%] w-6 h-3 bg-[#fd79a8] rounded-full opacity-50 blur-[3px]"></div>

          </div>
       </div>
    </div>
  );
};