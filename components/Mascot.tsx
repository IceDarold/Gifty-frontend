import React, { useState, useEffect } from 'react';

interface MascotProps {
  className?: string;
  emotion?: 'happy' | 'thinking' | 'surprised' | 'excited' | 'cool';
  eyesX?: number; // -1 to 1
  eyesY?: number; // -1 to 1
  accessory?: 'none' | 'glasses' | 'scarf';
}

export const Mascot: React.FC<MascotProps> = ({ 
  className = "w-32 h-32", 
  emotion = 'happy',
  eyesX = 0,
  eyesY = 0
}) => {
  // Eye tracking movement calculation
  const pupilX = Math.max(-1, Math.min(1, eyesX)) * 6;
  const pupilY = Math.max(-1, Math.min(1, eyesY)) * 6;

  // --- IMAGE PATH RESOLUTION LOGIC ---
  // We try paths in this order: 
  // 1. /mascot.png (Standard Vite/Webpack root)
  // 2. /public/mascot.png (Explicit public folder)
  // 3. mascot.png (Relative)
  const pathsToTry = ['/mascot.png', '/public/mascot.png', 'mascot.png'];
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const handleImgError = () => {
    const nextIndex = currentPathIndex + 1;
    if (nextIndex < pathsToTry.length) {
      setCurrentPathIndex(nextIndex);
    } else {
      setImgError(true); // All paths failed, show SVG fallback
    }
  };

  // Reset error state if component remounts or critical props change
  useEffect(() => {
    setImgError(false);
    setCurrentPathIndex(0);
  }, []);

  return (
    <div className={`${className} relative select-none pointer-events-none`}>
      <div className="w-full h-full relative animate-[float_6s_ease-in-out_infinite]">
        
        {/* Base Image with Robust Fallback */}
        {!imgError ? (
            <img 
                src={pathsToTry[currentPathIndex]}
                alt="Gifty Mascot" 
                className="w-full h-full object-contain drop-shadow-2xl" 
                onError={handleImgError}
            />
        ) : (
            // Fallback SVG Mascot (matches the style exactly if PNG is missing)
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                {/* Ears */}
                <path d="M15 25 Q5 10 5 40 Q20 50 35 35 Z" fill="#3B82F6" />
                <path d="M85 25 Q95 10 95 40 Q80 50 65 35 Z" fill="#3B82F6" />
                {/* Head */}
                <rect x="20" y="25" width="60" height="55" rx="25" fill="#3B82F6" />
                {/* Snout Highlight */}
                <ellipse cx="50" cy="62" rx="16" ry="12" fill="#60A5FA" />
                {/* Nose */}
                <ellipse cx="50" cy="58" rx="6" ry="4" fill="#1F2937" />
                {/* Mouth */}
                <path d="M46 68 Q50 72 54 68" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
        )}

        {/* --- Interactive Eyes Overlay --- */}
        {/* Positioned to align with both PNG and SVG fallback */}
        
        {/* Left Eye */}
        <div 
            className="absolute bg-white rounded-[50%] overflow-hidden flex items-center justify-center shadow-sm"
            style={{
                left: '26%',
                top: '32%',
                width: '23%',
                height: '28%',
                transform: 'rotate(-5deg)'
            }}
        >
            <div 
                className="bg-[#1F2937] rounded-full relative"
                style={{
                    width: '60%',
                    height: '70%',
                    transform: `translate(${pupilX}px, ${pupilY}px)`
                }}
            >
                 <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-white rounded-full"></div>
            </div>
        </div>

        {/* Right Eye */}
        <div 
            className="absolute bg-white rounded-[50%] overflow-hidden flex items-center justify-center shadow-sm"
            style={{
                left: '54%',
                top: '32%',
                width: '23%',
                height: '28%',
                transform: 'rotate(5deg)'
            }}
        >
             <div 
                className="bg-[#1F2937] rounded-full relative"
                style={{
                    width: '60%',
                    height: '70%',
                    transform: `translate(${pupilX}px, ${pupilY}px)`
                }}
            >
                 <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-white rounded-full"></div>
            </div>
        </div>

        {/* Eyebrows for emotion */}
        {emotion === 'thinking' && (
            <>
                <div className="absolute top-[22%] left-[26%] w-[20%] h-[5%] bg-indigo-900/20 rounded-full rotate-[-10deg]"></div>
                <div className="absolute top-[22%] left-[56%] w-[20%] h-[5%] bg-indigo-900/20 rounded-full rotate-[10deg]"></div>
            </>
        )}

      </div>
    </div>
  );
};